import registerUserModel from "../model/registerUserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const saltRounds = 10;
const MAX_LOGIN_ATTEMPTS = 5; // Maximum allowed login attempts
const LOCK_TIME = 0.5* 60 * 1000; // Lockout duration in milliseconds (30 minutes)



const login = async (req, res) => {
  const { username, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const user = await registerUserModel.getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    if (user.lockeduntil && new Date(user.lockeduntil) > new Date()) {
      const lockedUntilDate = new Date(user.lockeduntil);
      const lockedUntilTime = lockedUntilDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
      });
      
      return res.status(403).json({ message: `Account locked. Try again at ${lockedUntilTime}` });
  }
  
    

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      await registerUserModel.incrementLoginAttempts(user.id);
      
      if (user.loginattempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        await registerUserModel.lockUserAccount(user.id, new Date(Date.now() + LOCK_TIME));
        return res.status(403).json({ message: 'Account locked due to too many failed login attempts.' });
      }

      return res.status(401).json({ message: 'Incorrect password' });
    }

    await registerUserModel.resetLoginAttempts(user.id);

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '4h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    //CHANGE PRODUCTION MODE WHEN DEPLOYING;


    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        surname: user.surname,
        role: user.role,
        gender: user.gender
      },
      message: 'Logged in successfully and token is set in cookies',
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login unsuccessful' });
  }


};



const register = async (req, res) => {
  const { name, surname, username, password, role,gender,email } = req.body;

  try {
   
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const values = [username, hashedPassword, role, name, surname,gender,email];

    const user = await registerUserModel.register(values);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        surname: user.username,
        username:user.username,
        role:user.role

      },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration unsuccessful' });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await registerUserModel.getUser();

    if (users.length === 0) {
      return res.status(204).send(); // Send 204 with no content
    }
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'An error occurred while fetching users', details: err.message });
  }
};

const updateUser = async (req, res) => {
  const { username, role, name, surname, email } = req.body;
  const { id } = req.params;
  const values = [username, role, name, surname, email, id];

  try {
    const result = await registerUserModel.updateUser(values);

    if (!result) {
      return res.status(404).json({ error: 'No user found with the provided ID' });
    }

    res.status(200).json({ message: 'User updated successfully', user: result });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'An error occurred while updating the user', details: error.message });
  }
};



const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
      sameSite: 'strict',
      path: '/'
    });

    // Send the response immediately after clearing the cookie
    res.status(200).json({ message: 'Logged out successfully, cookie cleared' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};


const isAuth = async (req, res) => {
  try {
    // The authenticateToken middleware should be used before this function
    // This function should just return the authenticated status
    res.status(200).json({ isAuthenticated: true });
    
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ isAuthenticated: false, error: 'Authentication failed' });
  }
};

export default {
  login,
  register,
  getUser,
  logout,
  isAuth,
  updateUser
};

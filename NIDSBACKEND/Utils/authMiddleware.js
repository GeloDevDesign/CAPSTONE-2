import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('No token found in cookies');
    return res.status(401).json({ message: 'No token provided' });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    return res.status(500).json({ message: 'Internal server error' });
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      console.log('Token verification error:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      }
      return res.status(403).json({ message: 'Invalid token' }); 
    }

    console.log('Token verified successfully for user:', user.username);
    req.user = user; 
    next();
  });
};
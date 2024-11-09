import express from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { hash } from 'crypto';

const saltRounds = 10;


export default function (db) {
  const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    message: 'Too many login attempts from this IP. Please try again after 5 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});



// Middleware to Verify JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Expected Format: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error('JWT Verification Failed:', err);
        return res.sendStatus(403); // Forbidden
      }

      req.user = user; // Attach user info to request
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};



// Home Route (Public)
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});


app.post('/register',(req,res)=>{

  const {name,surname,username,password} = req.body

  if(!req) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  try {
    //PASSWORD HASHING
    bcrypt.hash(password,saltRounds,async(err,hash)=>{
      if(err) {
        console.log('Invalid Register')
      } else {
        const result = await db.query('');
      }
    })
  } catch (error) {
    
  }
})


app.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  // Find User by Username
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  try {
    
    // Compare Passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.json({ token });
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  

app.get('/systempage', authenticateJWT, (req, res) => {
  res.json({
    message: `Hello, ${req.user.username}! Welcome to the system page.`,
  });
});


  
    

  return router; 
}






// Dummy User Data with Hashed Passwords
const users = [
  {
    id: 1,
    username: 'user1',
    // Password: password1 (hashed using bcrypt)
    password: '$2b$10$KIXbfnGgS8ZpJ1dfy3ExdOZq6eM5dj1v1pBnSbt3F0BZKxjFoNReW', // Replace with actual hashed passwords
  },
  // Add more users as needed
];



const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { authenticateToken, authorizeRole } = require('./authMiddleware');

const app = express();
app.use(express.json());

const users = [
  { id: 1, username: 'warehouse_staff', password: 'password123', role: 'staff' },
  { id: 2, username: 'manager', password: 'password456', role: 'manager' }
];

// Mock login to generate JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  // Create a JWT token with the user’s role and id
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// Protected route: only accessible to users with the 'staff' or 'manager' role
app.get('/inventory/view', authenticateToken, (req, res) => {
  res.send('Inventory viewed!');
});

// Protected route: only accessible to users with the 'manager' role
app.post('/inventory/add', authenticateToken, authorizeRole('manager'), (req, res) => {
  res.send('Item added to inventory');
});

// Protected route: only accessible to users with the 'manager' role
app.delete('/inventory/remove', authenticateToken, authorizeRole('manager'), (req, res) => {
  res.send('Item removed from inventory');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




const jwt = require('jsonwebtoken');

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Access token required');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    
    req.user = user; // Save the decoded token to request object
    next();
  });
}

// Middleware to authorize specific roles
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send('Access denied. Insufficient permissions.');
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole
};

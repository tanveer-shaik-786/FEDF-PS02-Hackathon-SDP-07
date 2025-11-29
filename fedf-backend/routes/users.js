const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't send passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Don't send password back
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    userResponse.name = `${user.firstName} ${user.lastName}`;
    
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = new User({ 
      firstName, 
      lastName, 
      email, 
      password, 
      role: role || 'user' 
    });
    const savedUser = await newUser.save();
    
    // Don't send password back
    const userResponse = { ...savedUser.toObject() };
    delete userResponse.password;
    userResponse.name = `${savedUser.firstName} ${savedUser.lastName}`;
    
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

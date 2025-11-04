const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt received:', { 
      username: req.body.username, 
      usernameType: typeof req.body.username,
      usernameLength: req.body.username?.length,
      hasPassword: !!req.body.password,
      passwordLength: req.body.password?.length 
    });
    
    // Trim and get values
    const username = req.body.username?.trim();
    const password = req.body.password;

    // Validate input
    if (!username || !password) {
      console.log('Validation failed:', { username: !!username, password: !!password });
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }
    
    console.log('Processing login for:', username);

    // Find user
    const user = await User.findOne({ 
      $or: [
        { username },
        { email: username }
      ],
      isActive: true
    });

    if (!user) {
      console.log('Login failed: User not found for:', username);
      // Also check if user exists but is inactive
      const inactiveUser = await User.findOne({ 
        $or: [
          { username },
          { email: username }
        ]
      });
      if (inactiveUser) {
        console.log('User exists but is inactive:', inactiveUser.isActive);
      } else {
        console.log('No user found with username or email:', username);
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User found:', { username: user.username, role: user.role, isActive: user.isActive });

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('Login failed: Not an admin user');
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Login successful for user:', user.username);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// Verify token route (for frontend to check if user is still authenticated)
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || user.role !== 'admin' || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive admin account'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

module.exports = router;


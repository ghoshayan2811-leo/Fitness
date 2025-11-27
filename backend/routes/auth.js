const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ==================== PUBLIC ROUTES ====================

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, age, weight, height, gender, goal, activityLevel } = req.body;
    
    console.log('📝 Signup data received:', { name, email, age, weight, height, gender, goal, activityLevel });

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with ALL fields
    user = new User({
      name,
      email,
      password: hashedPassword,
      age: age ? parseInt(age) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      gender: gender || 'male',
      goal: goal || 'weight_loss',
      activityLevel: activityLevel || 'moderate'
    });

    await user.save();
    console.log('✅ User created with ID:', user._id);

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    // Return user data (matching signup form structure)
    res.json({
      success: true,
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        goal: user.goal,
        activityLevel: user.activityLevel
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    // Return user data (matching signup form structure)
    res.json({
      success: true,
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        goal: user.goal,
        activityLevel: user.activityLevel
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// ==================== PROTECTED ROUTES ====================

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        goal: user.goal,
        activityLevel: user.activityLevel,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, age, weight, height, gender, goal, activityLevel } = req.body;

    console.log('📝 Update profile data received:', { name, age, weight, height, gender, goal, activityLevel });

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields (EXACT SAME NAMES AS SIGNUP)
    if (name) user.name = name;
    if (age) user.age = parseInt(age);
    if (weight) user.weight = parseFloat(weight);
    if (height) user.height = parseFloat(height);
    if (gender) user.gender = gender;
    if (goal) user.goal = goal;
    if (activityLevel) user.activityLevel = activityLevel;

    await user.save();
    
    console.log('✅ Profile updated for user:', user._id);

    res.json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        goal: user.goal,
        activityLevel: user.activityLevel
      }
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete account
router.delete('/account', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

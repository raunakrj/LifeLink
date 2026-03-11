const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const { detectFakeProfile } = require('../services/profileDetectionService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, age, bloodGroup, phone, location, address, donationPreferences } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name, email, password, role, age, bloodGroup, phone, location, address, donationPreferences
    });

    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      
      user.refreshToken = refreshToken;
      await user.save();

      // Trigger fake profile detection in background
      detectFakeProfile(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        accessToken
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('[AUTH ERROR] Registration failed:', error.message);
    if (error.name === 'ValidationError') {
      console.error('[AUTH ERROR] Validation Details:', Object.values(error.errors).map(e => e.message));
    }
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        accessToken
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401);
      throw new Error('No refresh token provided');
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.status(403);
      throw new Error('Invalid refresh token');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      if (user._id.toString() !== decoded.id) {
         throw new Error('Token mismatch');
      }
      const newAccessToken = generateAccessToken(user._id);
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403);
      throw new Error('Invalid or expired refresh token');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const user = await User.findOne({ refreshToken });
    
    if (user) {
      user.refreshToken = '';
      await user.save();
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
};

const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        age: user.age,
        phone: user.phone,
        address: user.address,
        location: user.location,
        gender: user.gender,
        bio: user.bio,
        donationPreferences: user.donationPreferences,
        availability: user.availability
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.age = req.body.age || user.age;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.gender = req.body.gender || user.gender;
      user.bio = req.body.bio || user.bio;
      user.availability = req.body.availability !== undefined ? req.body.availability : user.availability;

      if (req.body.location) {
        user.location = req.body.location;
      }
      
      if (req.body.donationPreferences) {
        user.donationPreferences = req.body.donationPreferences;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bloodGroup: updatedUser.bloodGroup,
        gender: updatedUser.gender,
        bio: updatedUser.bio,
        donationPreferences: updatedUser.donationPreferences,
        accessToken: req.token 
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};

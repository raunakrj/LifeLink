const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Donor', 'Receiver', 'Both'], default: 'Donor' },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  address: { type: String, required: true },
  photoUrl: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  bio: { type: String, maxlength: 500 },
  donationPreferences: {
    blood: { type: Boolean, default: true },
    organs: [{ type: String }] // e.g., ['Kidney', 'Liver']
  },
  refreshToken: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  isFlagged: { type: Boolean, default: false },
  availability: { type: Boolean, default: true }
}, { timestamps: true });

// Index for geo-spatial queries
userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

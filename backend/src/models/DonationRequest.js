const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
  organType: { type: String }, // Optional for organ requests
  urgency: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  status: { type: String, enum: ['Open', 'Matched', 'Closed'], default: 'Open' },
  message: { type: String }
}, { timestamps: true });

donationRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DonationRequest', donationRequestSchema);

const mongoose = require('mongoose');

const donationHistorySchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Blood', 'Organ'], required: true },
  details: { type: String },
  date: { type: Date, default: Date.now },
  location: { type: String },
  certificateUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('DonationHistory', donationHistorySchema);

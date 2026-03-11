const mongoose = require('mongoose');

const matchRequestSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, required: true },
  organType: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], 
    default: 'Pending' 
  },
  urgency: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
  matchScore: { type: Number },
  matchReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MatchRequest', matchRequestSchema);

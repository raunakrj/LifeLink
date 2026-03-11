const mongoose = require('mongoose');

const flaggedProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  flaggedBy: { type: String, default: 'System-AI' }, // e.g., 'System-AI' or 'Admin'
  status: { type: String, enum: ['Under Review', 'Resolved', 'Banned'], default: 'Under Review' },
  evidence: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('FlaggedProfile', flaggedProfileSchema);

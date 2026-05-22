const mongoose = require('mongoose');
const routeSchema = new mongoose.Schema({
  startLocation: { type: String, required: true, trim: true },
  endLocation: { type: String, required: true, trim: true },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  estimatedTime: { type: Number, required: true },
  distanceKm: { type: Number, default: 0 },
  safetyScore: { type: Number, min: 0, max: 100, default: 80 },
  transportMode: { type: String, enum: ['Walking', 'Cycling', 'Public Transport', 'Driving'], default: 'Walking' },
  notes: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });
module.exports = mongoose.model('Route', routeSchema);

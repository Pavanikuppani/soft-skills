const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, default: 'Student' },
  totalSessions: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  weakAreas: [String],
  history: [{
    sessionId: String,
    question: String,
    bestScore: Number,
    mode: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

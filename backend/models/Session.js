const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  responseText: { type: String, required: true },
  scores: {
    clarity: Number,
    confidence: Number,
    structure: Number,
    grammar: Number,
    relevance: Number
  },
  overall_score: Number,
  filler_words: {
    count: Number,
    examples: [String]
  },
  strengths: [String],
  improvements: [String],
  suggested_answer: String,
  confidence_level: String,
  timestamp: { type: Date, default: Date.now }
});

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  question: { type: String, required: true },
  mode: { 
    type: String, 
    enum: ['hr', 'group', 'casual', 'technical'], 
    default: 'hr' 
  },
  attempts: [attemptSchema],
  bestScore: { type: Number, default: 0 },
  weakAreas: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

sessionSchema.pre('save', function(next) {
  if (this.attempts.length > 0) {
    const scores = this.attempts.map(a => a.overall_score || 0);
    this.bestScore = Math.max(...scores);
    const latest = this.attempts[this.attempts.length - 1];
    if (latest?.scores) {
      this.weakAreas = Object.entries(latest.scores)
        .filter(([_, val]) => val < 6)
        .map(([key]) => key);
    }
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Session', sessionSchema);

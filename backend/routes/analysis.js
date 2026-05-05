const express = require('express');
const router = express.Router();
const { validateAnalysis } = require('../middleware/validate');
const { buildSystemPrompt, buildUserMessage } = require('../utils/prompt');
const { analyzeWithGroq } = require('../utils/groqClient');
const Session = require('../models/Session');

// In-memory fallback when MongoDB is unavailable
const inMemorySessions = {};

/**
 * POST /api/analysis/submit
 * Main endpoint: analyze a student's interview response
 */
router.post('/submit', validateAnalysis, async (req, res) => {
  const { question, responseText, mode, userId, sessionId } = req.body;

  try {
    // 1. Build prompts
    const systemPrompt = buildSystemPrompt(mode);
    const userMessage = buildUserMessage(question, responseText);

    // 2. Call Groq AI
    const feedback = await analyzeWithGroq(systemPrompt, userMessage);

    // 3. Ensure overall_score exists
    if (!feedback.overall_score) {
      const vals = Object.values(feedback.scores || {});
      feedback.overall_score = vals.length 
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) 
        : 50;
    }

    // 4. Save to DB (with graceful fallback)
    let savedSessionId = sessionId;
    try {
      let session;
      if (sessionId) {
        session = await Session.findById(sessionId);
      }
      if (!session) {
        session = new Session({ userId, question, mode, attempts: [] });
      }
      session.attempts.push({ responseText, ...feedback });
      await session.save();
      savedSessionId = session._id.toString();
    } catch (dbErr) {
      // DB unavailable - use in-memory store
      if (!inMemorySessions[userId]) inMemorySessions[userId] = [];
      inMemorySessions[userId].push({ question, mode, feedback, timestamp: new Date() });
      savedSessionId = `mem_${Date.now()}`;
    }

    // 5. Return feedback + metadata
    res.json({
      success: true,
      sessionId: savedSessionId,
      attemptNumber: 1,
      feedback
    });

  } catch (err) {
    console.error('Analysis error:', err);
    
    if (err.message?.includes('GROQ_API_KEY')) {
      return res.status(503).json({ error: 'AI service not configured. Please set GROQ_API_KEY.' });
    }
    
    res.status(500).json({ error: 'Failed to analyze response. Please try again.' });
  }
});

/**
 * POST /api/analysis/retry
 * Submit a retry attempt for the same question
 */
router.post('/retry', validateAnalysis, async (req, res) => {
  const { question, responseText, mode, userId, sessionId } = req.body;

  try {
    const systemPrompt = buildSystemPrompt(mode);
    const userMessage = buildUserMessage(question, responseText);
    const feedback = await analyzeWithGroq(systemPrompt, userMessage);

    if (!feedback.overall_score) {
      const vals = Object.values(feedback.scores || {});
      feedback.overall_score = vals.length 
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) 
        : 50;
    }

    let improvement = null;
    let attemptNumber = 1;

    try {
      if (sessionId) {
        const session = await Session.findById(sessionId);
        if (session) {
          const prevScore = session.attempts[session.attempts.length - 1]?.overall_score || 0;
          improvement = feedback.overall_score - prevScore;
          session.attempts.push({ responseText, ...feedback });
          await session.save();
          attemptNumber = session.attempts.length;
        }
      }
    } catch (dbErr) {
      console.log('DB unavailable for retry');
    }

    res.json({ success: true, sessionId, attemptNumber, improvement, feedback });

  } catch (err) {
    console.error('Retry error:', err);
    res.status(500).json({ error: 'Failed to analyze retry. Please try again.' });
  }
});

/**
 * GET /api/analysis/questions
 * Return sample interview questions by category
 */
router.get('/questions', (req, res) => {
  const { mode = 'hr' } = req.query;

  const questions = {
    hr: [
      "Tell me about yourself.",
      "What is your greatest weakness?",
      "Where do you see yourself in 5 years?",
      "Why do you want to work here?",
      "Describe a time you handled conflict at work.",
      "What motivates you?",
      "How do you handle pressure and tight deadlines?"
    ],
    technical: [
      "Explain the concept of RESTful APIs.",
      "What is the difference between SQL and NoSQL databases?",
      "How does garbage collection work in JavaScript?",
      "Explain Object-Oriented Programming principles.",
      "What is the difference between TCP and UDP?",
      "How would you optimize a slow database query?"
    ],
    group: [
      "Should social media platforms be regulated by governments?",
      "Is remote work more productive than office work?",
      "How should companies approach AI ethics?",
      "Discuss the pros and cons of four-day work weeks.",
      "Should coding be taught as a mandatory school subject?"
    ],
    casual: [
      "What are your hobbies outside of work?",
      "How do you stay updated with industry trends?",
      "What's the most interesting project you've worked on?",
      "How do you prefer to receive feedback?",
      "Describe your ideal work environment."
    ]
  };

  res.json({ questions: questions[mode] || questions.hr });
});

module.exports = router;

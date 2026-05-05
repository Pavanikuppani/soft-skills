const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

/**
 * GET /api/sessions/:userId
 * Get all sessions for a user
 */
router.get('/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('-attempts.responseText'); // Exclude full text for performance

    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

/**
 * GET /api/sessions/detail/:sessionId
 * Get full detail of a specific session
 */
router.get('/detail/:sessionId', async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

/**
 * DELETE /api/sessions/:sessionId
 * Delete a specific session
 */
router.delete('/:sessionId', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.sessionId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

/**
 * GET /api/sessions/stats/:userId
 * Get user performance statistics
 */
router.get('/stats/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId });
    
    if (sessions.length === 0) {
      return res.json({ totalSessions: 0, averageScore: 0, weakAreas: [], improvement: 0 });
    }

    const allAttempts = sessions.flatMap(s => s.attempts);
    const avgScore = allAttempts.length
      ? Math.round(allAttempts.reduce((a, b) => a + (b.overall_score || 0), 0) / allAttempts.length)
      : 0;

    // Compute weak areas across all sessions
    const areaCounts = {};
    sessions.forEach(s => {
      s.weakAreas.forEach(area => {
        areaCounts[area] = (areaCounts[area] || 0) + 1;
      });
    });

    const weakAreas = Object.entries(areaCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([area]) => area);

    // Score improvement trend (first vs last)
    const sortedAttempts = allAttempts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const improvement = sortedAttempts.length >= 2
      ? (sortedAttempts[sortedAttempts.length - 1].overall_score || 0) - (sortedAttempts[0].overall_score || 0)
      : 0;

    res.json({
      totalSessions: sessions.length,
      totalAttempts: allAttempts.length,
      averageScore: avgScore,
      bestScore: Math.max(...allAttempts.map(a => a.overall_score || 0)),
      weakAreas,
      improvement
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

module.exports = router;

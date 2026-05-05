import { Router } from "express";
import {
  getOrCreateSession,
  deleteSession,
  getAllSessions,
} from "../utils/sessionStore.js";

const router = Router();

/**
 * GET /api/sessions/:userId
 * Get a user's full session data (history + weak areas).
 */
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const session = getOrCreateSession(userId);
  res.json({ success: true, session });
});

/**
 * DELETE /api/sessions/:userId
 * Clear a user's session.
 */
router.delete("/:userId", (req, res) => {
  deleteSession(req.params.userId);
  res.json({ success: true, message: "Session cleared." });
});

/**
 * GET /api/sessions/:userId/stats
 * Aggregated stats for the user.
 */
router.get("/:userId/stats", (req, res) => {
  const session = getOrCreateSession(req.params.userId);
  const history = session.history;

  if (!history.length) {
    return res.json({ success: true, stats: null });
  }

  // Average scores across all sessions
  const scoreKeys = ["clarity", "confidence", "structure", "grammar", "relevance"];
  const totals = Object.fromEntries(scoreKeys.map((k) => [k, 0]));
  let totalOverall = 0;

  history.forEach((h) => {
    scoreKeys.forEach((k) => {
      totals[k] += h.feedback?.scores?.[k] || 0;
    });
    totalOverall += h.feedback?.overall_score || 0;
  });

  const averages = Object.fromEntries(
    scoreKeys.map((k) => [k, +(totals[k] / history.length).toFixed(1)])
  );

  const stats = {
    totalAttempts: history.length,
    averageOverallScore: +(totalOverall / history.length).toFixed(1),
    averageScores: averages,
    weakAreas: session.weakAreas,
    recentHistory: history.slice(-5).map((h) => ({
      question: h.question?.substring(0, 60) + "...",
      overallScore: h.feedback?.overall_score,
      confidenceLevel: h.feedback?.confidence_level,
      timestamp: h.timestamp,
    })),
  };

  res.json({ success: true, stats });
});

export default router;

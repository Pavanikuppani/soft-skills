import { db } from "../utils/db.js";

export const getUserHistory = (req, res) => {
  const { userId = "default-user" } = req.query;
  const history = db.getHistory(userId);
  const weakAreas = db.getWeakAreas(userId);

  // Compute score trend
  const trend = history.map((entry) => ({
    id: entry.id,
    timestamp: entry.timestamp,
    question: entry.question,
    overall_score: entry.analysis.overall_score,
    confidence_level: entry.analysis.confidence_level,
  }));

  res.json({ userId, history, trend, weakAreas });
};

export const clearHistory = (req, res) => {
  const { userId = "default-user" } = req.body;
  db.createSession(userId); // Reset
  res.json({ success: true, message: "History cleared" });
};

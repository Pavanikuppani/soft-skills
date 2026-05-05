const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { analyzeSpeech } = require("../groqService");
const db = require("../db");

router.post("/", async (req, res) => {
  const { question, responseText, mode = "hr", userId } = req.body;

  if (!question || !responseText) {
    return res.status(400).json({ error: "question and responseText are required" });
  }

  if (responseText.trim().length < 10) {
    return res.status(400).json({ error: "Response is too short to analyze" });
  }

  const uid = userId || uuidv4();

  try {
    const feedback = await analyzeSpeech(question, responseText, mode);
    const sessionId = uuidv4();

    db.saveSession(uid, { sessionId, question, response: responseText, feedback, mode });
    const user = db.getUser(uid);

    res.json({
      success: true,
      sessionId,
      userId: uid,
      feedback,
      userStats: {
        totalSessions: user.totalSessions,
        weakAreas: user.weakAreas
      }
    });
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({ error: "Failed to analyze response. Please try again." });
  }
});

module.exports = router;

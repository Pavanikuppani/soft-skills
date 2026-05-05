import { analyzeWithClaude } from "../utils/anthropicService.js";
import { db } from "../utils/db.js";

export const analyzeResponse = async (req, res, next) => {
  try {
    const { question, responseText, mode = "hr", userId = "default-user" } = req.body;

    if (!question || !responseText) {
      return res.status(400).json({ error: "question and responseText are required" });
    }
    if (responseText.trim().length < 10) {
      return res.status(400).json({ error: "Response is too short to analyze" });
    }

    const analysis = await analyzeWithClaude(question, responseText, mode);
    const entry = db.updateSession(userId, analysis, question);
    const weakAreas = db.getWeakAreas(userId);

    res.json({
      success: true,
      entryId: entry.id,
      analysis,
      weakAreas,
      personalized_tip: generatePersonalizedTip(weakAreas),
    });
  } catch (err) {
    next(err);
  }
};

function generatePersonalizedTip(weakAreas) {
  const tips = {
    clarity: "Practice the 'newspaper headline' technique: summarize your point in one sentence first.",
    confidence: "Record yourself answering questions and watch it back — awareness builds confidence.",
    structure: "Use the STAR method: Situation, Task, Action, Result for every behavioral question.",
    grammar: "Write out your answers first, then practice speaking them aloud.",
    relevance: "Before answering, repeat the question silently to yourself to stay on track.",
    filler_words: "Replace filler words with a deliberate 1-second pause — it sounds more authoritative.",
  };

  if (weakAreas.length === 0) return "Great work! Keep practicing to maintain your performance.";
  const area = weakAreas[0];
  return tips[area] || "Focus on your weakest area and practice daily for 10 minutes.";
}

import { Router } from "express";
import Groq from "groq-sdk";
import {
  buildSystemPrompt,
  buildUserMessage,
  parseGroqResponse,
} from "../utils/promptBuilder.js";
import {
  addToHistory,
  getOrCreateSession,
  getScoreImprovement,
} from "../utils/sessionStore.js";

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * POST /api/analysis/submit
 * Analyze a student's interview response.
 */
router.post("/submit", async (req, res) => {
  const { question, responseText, mode = "hr", userId = "guest" } = req.body;

  if (!question || !responseText) {
    return res.status(400).json({ error: "question and responseText are required." });
  }

  if (responseText.trim().length < 10) {
    return res.status(400).json({ error: "Response is too short to analyze." });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: buildSystemPrompt(mode) },
        { role: "user", content: buildUserMessage(question, responseText) },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) throw new Error("Empty response from AI.");

    const feedback = parseGroqResponse(rawContent);

    // Persist to session
    addToHistory(userId, { question, responseText, feedback, mode });

    // Check for improvement on retry
    const improvement = getScoreImprovement(userId, question);

    return res.json({ success: true, feedback, improvement });
  } catch (err) {
    console.error("[Analysis Error]", err.message);

    if (err instanceof SyntaxError) {
      return res.status(502).json({ error: "AI returned invalid JSON. Please retry." });
    }

    return res.status(500).json({ error: "Failed to analyze response. Please try again." });
  }
});

/**
 * POST /api/analysis/compare
 * Compare two responses for the same question.
 */
router.post("/compare", async (req, res) => {
  const { question, responseA, responseB, userId = "guest" } = req.body;

  if (!question || !responseA || !responseB) {
    return res.status(400).json({ error: "question, responseA, and responseB are required." });
  }

  try {
    const [resultA, resultB] = await Promise.all([
      groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: buildSystemPrompt("hr") },
          { role: "user", content: buildUserMessage(question, responseA) },
        ],
        temperature: 0.4,
        max_tokens: 1200,
      }),
      groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: buildSystemPrompt("hr") },
          { role: "user", content: buildUserMessage(question, responseB) },
        ],
        temperature: 0.4,
        max_tokens: 1200,
      }),
    ]);

    const feedbackA = parseGroqResponse(resultA.choices[0].message.content);
    const feedbackB = parseGroqResponse(resultB.choices[0].message.content);

    return res.json({ success: true, feedbackA, feedbackB });
  } catch (err) {
    console.error("[Compare Error]", err.message);
    return res.status(500).json({ error: "Comparison failed. Please retry." });
  }
});

export default router;

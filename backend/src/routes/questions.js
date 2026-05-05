import { Router } from "express";

const router = Router();

const QUESTIONS = {
  hr: [
    "Tell me about yourself.",
    "What is your greatest strength and how have you used it?",
    "Describe a challenging situation at work and how you handled it.",
    "Where do you see yourself in 5 years?",
    "Why do you want to work for our company?",
    "Tell me about a time you failed and what you learned from it.",
    "How do you handle pressure and tight deadlines?",
    "Describe your ideal work environment.",
    "What motivates you to do your best work?",
    "How do you prioritize tasks when you have multiple deadlines?",
  ],
  group: [
    "Should social media platforms be regulated by the government?",
    "Is remote work more productive than working from an office?",
    "Discuss the impact of AI on employment.",
    "Should higher education be free for everyone?",
    "Is climate change the most pressing issue of our generation?",
  ],
  casual: [
    "How was your weekend?",
    "What hobbies do you enjoy outside of work?",
    "Tell me about a book or show you've been into lately.",
    "What's a skill you've been trying to learn recently?",
    "Describe your morning routine.",
  ],
};

/**
 * GET /api/questions
 * Get all questions by mode.
 */
router.get("/", (req, res) => {
  const { mode = "hr" } = req.query;
  const questions = QUESTIONS[mode] || QUESTIONS.hr;
  res.json({ success: true, mode, questions });
});

/**
 * GET /api/questions/random
 * Get a random question.
 */
router.get("/random", (req, res) => {
  const { mode = "hr" } = req.query;
  const questions = QUESTIONS[mode] || QUESTIONS.hr;
  const question = questions[Math.floor(Math.random() * questions.length)];
  res.json({ success: true, mode, question });
});

export default router;

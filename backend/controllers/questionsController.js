const QUESTION_BANK = {
  hr: [
    "Tell me about yourself.",
    "What is your greatest weakness?",
    "Where do you see yourself in 5 years?",
    "Why do you want to work here?",
    "Describe a time you handled a conflict at work.",
    "What motivates you?",
    "How do you handle pressure and tight deadlines?",
    "Tell me about a time you failed and what you learned from it.",
  ],
  group: [
    "Should remote work become the permanent standard for tech companies?",
    "Is social media doing more harm than good to society?",
    "How can companies balance innovation with employee well-being?",
    "What is more important: technical skills or soft skills in today's workplace?",
  ],
  casual: [
    "What's a project you're really proud of?",
    "How do you like to spend your weekends?",
    "What kind of work environment brings out your best?",
    "Who has been the biggest influence on your career so far?",
  ],
};

export const getQuestions = (req, res) => {
  const { mode = "hr" } = req.query;
  const questions = QUESTION_BANK[mode] || QUESTION_BANK.hr;
  res.json({ mode, questions });
};

export const getRandomQuestion = (req, res) => {
  const { mode = "hr" } = req.query;
  const questions = QUESTION_BANK[mode] || QUESTION_BANK.hr;
  const question = questions[Math.floor(Math.random() * questions.length)];
  res.json({ mode, question });
};

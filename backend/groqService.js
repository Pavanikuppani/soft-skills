const Groq = require("groq-sdk");
const { getSystemPrompt } = require("./prompt");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeSpeech = async (question, responseText, mode = "hr") => {
  const userMessage = `Question: ${question}\n\nStudent Response: ${responseText}`;

  const completion = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      { role: "system", content: getSystemPrompt(mode) },
      { role: "user", content: userMessage }
    ],
    temperature: 0.3,
    max_tokens: 1200
  });

  const raw = completion.choices[0].message.content.trim();

  // Strip markdown code blocks if present
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  const feedback = JSON.parse(cleaned);

  // Validate required fields
  const required = ["scores", "filler_words", "strengths", "improvements", "suggested_answer", "confidence_level"];
  for (const field of required) {
    if (!feedback[field]) throw new Error(`Missing field: ${field}`);
  }

  // Compute overall_score if not present
  if (!feedback.overall_score) {
    const s = feedback.scores;
    const avg = (s.clarity + s.confidence + s.structure + s.grammar + s.relevance) / 5;
    const fillerPenalty = Math.min(feedback.filler_words.count * 2, 20);
    feedback.overall_score = Math.round(avg * 10 - fillerPenalty);
  }

  return feedback;
};

module.exports = { analyzeSpeech };

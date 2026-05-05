import { buildAnalysisPrompt } from "./prompt.js";

export const analyzeWithClaude = async (question, responseText, mode = "hr") => {
  const prompt = buildAnalysisPrompt(question, responseText, mode);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const raw = data.content?.[0]?.text || "";

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

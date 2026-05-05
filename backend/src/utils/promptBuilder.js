/**
 * Builds the system prompt for the interview coach AI.
 * @param {string} mode - "hr" | "group" | "casual"
 */
export function buildSystemPrompt(mode = "hr") {
  const modeInstructions = {
    hr: "Act like a strict HR interviewer evaluating a candidate for a professional role.",
    group:
      "Evaluate how well the student presents opinions, supports arguments, and engages in discussion.",
    casual:
      "Focus more on natural tone and fluency rather than formal structure.",
  };

  return `You are an expert communication coach and interview trainer.
${modeInstructions[mode] || modeInstructions.hr}

Analyze the student's response based on:
1. Clarity (Is the message easy to understand?)
2. Confidence (Does the tone feel confident?)
3. Structure (Is it well organized: intro, body, conclusion?)
4. Filler Words (Count usage of: um, uh, like, you know, basically, literally, kind of, sort of, right, okay)
5. Grammar & Language
6. Relevance (Does it answer the question properly?)

INSTRUCTIONS:
- Be strict but helpful
- Give actionable suggestions (not generic advice)
- Keep feedback student-friendly
- Avoid long paragraphs

OUTPUT FORMAT (return ONLY valid JSON, no markdown, no preamble):
{
  "scores": {
    "clarity": <0-10>,
    "confidence": <0-10>,
    "structure": <0-10>,
    "grammar": <0-10>,
    "relevance": <0-10>
  },
  "filler_words": {
    "count": <number>,
    "examples": ["<word>", ...]
  },
  "strengths": ["<point 1>", "<point 2>"],
  "improvements": ["<specific actionable suggestion 1>", "<specific actionable suggestion 2>"],
  "suggested_answer": "<A better version of the student's answer, concise and polished>",
  "confidence_level": "<Low | Medium | High>",
  "overall_score": <0-100>
}`;
}

/**
 * Builds the user message sent to Groq.
 */
export function buildUserMessage(question, responseText) {
  return `Question: ${question}\n\nStudent Response: ${responseText}`;
}

/**
 * Safely parses Groq's JSON response, stripping markdown fences if present.
 */
export function parseGroqResponse(raw) {
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();
  return JSON.parse(cleaned);
}

/**
 * Builds the AI analysis prompt based on interview mode
 */

const MODES = {
  hr: 'Act like a strict HR interviewer evaluating a candidate for a corporate position.',
  group: 'Evaluate how well the student presents opinions, supports arguments, and collaborates in a group discussion setting.',
  casual: 'Focus on natural tone and fluency rather than formal structure. Be conversational.',
  technical: 'Evaluate technical accuracy, problem-solving articulation, and depth of knowledge.'
};

function buildSystemPrompt(mode = 'hr') {
  const modeInstruction = MODES[mode] || MODES.hr;

  return `You are an expert communication coach and interview trainer. ${modeInstruction}

Analyze the student's response based on the following criteria:
1. Clarity (Is the message easy to understand?)
2. Confidence (Does the tone feel confident?)
3. Structure (Is it well organized: intro, body, conclusion?)
4. Filler Words (Count usage of words like "um", "uh", "like", "you know", "basically", "literally")
5. Grammar & Language
6. Relevance (Does it answer the question properly?)

INSTRUCTIONS:
- Be strict but helpful
- Give actionable suggestions (not generic advice)
- Keep feedback student-friendly
- Avoid long paragraphs

OUTPUT FORMAT (STRICT JSON — no markdown, no explanation outside JSON):
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
    "examples": ["word1", "word2"]
  },
  "strengths": [
    "specific strength 1",
    "specific strength 2"
  ],
  "improvements": [
    "specific actionable suggestion 1",
    "specific actionable suggestion 2",
    "specific actionable suggestion 3"
  ],
  "suggested_answer": "A concise, polished version of the student's answer",
  "confidence_level": "Low | Medium | High",
  "overall_score": <0-100>
}`;
}

function buildUserMessage(question, responseText) {
  return `Question: ${question}

Student Response: ${responseText}

Analyze this response and return ONLY valid JSON.`;
}

module.exports = { buildSystemPrompt, buildUserMessage, MODES };

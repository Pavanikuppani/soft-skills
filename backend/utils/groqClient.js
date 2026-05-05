const Groq = require('groq-sdk');

let groqClient = null;

function getGroqClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

async function analyzeWithGroq(systemPrompt, userMessage) {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.3,
    max_tokens: 1500,
    response_format: { type: 'json_object' }
  });

  const rawContent = completion.choices[0]?.message?.content;
  if (!rawContent) throw new Error('Empty response from Groq');

  // Clean and parse JSON
  const cleaned = rawContent.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { analyzeWithGroq };

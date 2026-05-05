import { useState, useCallback } from 'react';
import { analysisApi } from '../utils/api';
import { storage } from '../utils/storage';

// ─── Demo mode: works 100% without a backend ─────────────────────────────────
function buildMockFeedback(responseText) {
  const words = responseText.trim().split(/\s+/);
  const fillerList = ['um', 'uh', 'like', 'you know', 'basically', 'literally'];
  const foundFillers = fillerList.filter(f => responseText.toLowerCase().includes(f));
  const clarity    = Math.min(10, 5 + Math.floor(words.length / 20));
  const confidence = foundFillers.length > 2 ? 5 : 7;
  const structure  = words.length > 60 ? 7 : 5;
  const grammar    = 7;
  const relevance  = 7;
  const overall    = Math.round(((clarity + confidence + structure + grammar + relevance) / 50) * 100);

  return {
    scores: { clarity, confidence, structure, grammar, relevance },
    filler_words: { count: foundFillers.length, examples: foundFillers.slice(0, 3) },
    strengths: [
      'You provided a response with relevant content.',
      words.length > 50 ? 'Good response length — detailed enough.' : 'Concise and to the point.'
    ],
    improvements: [
      'Add a clear structure: briefly introduce yourself, describe your skills, then close with your goal.',
      foundFillers.length > 0 ? `Eliminate filler words: "${foundFillers.join('", "')}"` : 'Keep your confident tone throughout.',
      'Quantify your achievements (e.g., "built a feature used by 500 users") for more impact.'
    ],
    suggested_answer:
      'I am a final-year Computer Science student with hands-on experience in full-stack development using React and Node.js. ' +
      'I have built several projects that strengthened my problem-solving skills and understanding of core concepts. ' +
      'I am looking for an opportunity to apply my skills, contribute to real-world products, and grow as a developer.',
    confidence_level: confidence >= 7 ? 'High' : confidence >= 5 ? 'Medium' : 'Low',
    overall_score: overall
  };
}
// ─────────────────────────────────────────────────────────────────────────────

export function useAnalysis() {
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [feedback, setFeedback]         = useState(null);
  const [sessionId, setSessionId]       = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [improvement, setImprovement]   = useState(null);
  const [usingDemo, setUsingDemo]       = useState(false);

  const submitResponse = useCallback(async ({ question, responseText, mode }) => {
    setLoading(true);
    setError(null);
    setImprovement(null);

    const rawId = localStorage.getItem('interviewai_userId');
    const userId = (rawId && rawId.trim()) ? rawId.trim() : 'anonymous'; // never empty

    try {
      const isRetry = attemptCount > 0 && sessionId;
      const fn      = isRetry ? analysisApi.retry : analysisApi.submit;
      const payload = { question, responseText, mode, userId };
      if (sessionId) payload.sessionId = sessionId;

      const result = await fn(payload);

      setUsingDemo(false);
      setFeedback(result.feedback);
      setSessionId(result.sessionId);
      setAttemptCount(prev => prev + 1);
      if (result.improvement !== undefined) setImprovement(result.improvement);
      storage.updateSkillMemory(result.feedback);
      return result.feedback;

    } catch (err) {
      // ── If backend is unreachable, fall back to client-side mock ──────────
      const isNetworkErr = !err.response || err.message === 'Network Error'
        || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED';

      if (isNetworkErr) {
        console.warn('Backend unreachable — running in demo mode');
        const mock = buildMockFeedback(responseText);
        setUsingDemo(true);
        setFeedback(mock);
        setSessionId(`demo_${Date.now()}`);
        setAttemptCount(prev => prev + 1);
        storage.updateSkillMemory(mock);
        return mock;
      }

      // Real error (validation, 500, etc.) — surface it
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [attemptCount, sessionId]);

  const reset = useCallback(() => {
    setFeedback(null);
    setSessionId(null);
    setAttemptCount(0);
    setError(null);
    setImprovement(null);
    setUsingDemo(false);
  }, []);

  return { loading, error, feedback, sessionId, attemptCount, improvement, usingDemo, submitResponse, reset };
}

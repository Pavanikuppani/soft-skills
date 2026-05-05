/**
 * Simple in-memory store for user sessions and skill memory.
 * In production, replace with a database (MongoDB, PostgreSQL, Redis).
 */

const sessions = new Map();

/**
 * Get or create a session for a user.
 */
export function getOrCreateSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      userId,
      history: [],
      weakAreas: [],
      attemptCounts: {},
      createdAt: new Date().toISOString(),
    });
  }
  return sessions.get(userId);
}

/**
 * Add a feedback entry to the user's session history.
 */
export function addToHistory(userId, entry) {
  const session = getOrCreateSession(userId);
  session.history.push({ ...entry, timestamp: new Date().toISOString() });

  // Keep only last 20 entries
  if (session.history.length > 20) {
    session.history = session.history.slice(-20);
  }

  // Update weak areas (scores below 6)
  const scores = entry.feedback?.scores || {};
  const newWeakAreas = Object.entries(scores)
    .filter(([, v]) => v < 6)
    .map(([k]) => k);

  session.weakAreas = [...new Set([...session.weakAreas, ...newWeakAreas])];

  // Track attempt counts per question
  const qKey = entry.question?.substring(0, 50);
  session.attemptCounts[qKey] = (session.attemptCounts[qKey] || 0) + 1;

  sessions.set(userId, session);
  return session;
}

/**
 * Get all sessions (for debugging/admin).
 */
export function getAllSessions() {
  return Object.fromEntries(sessions);
}

/**
 * Delete a session.
 */
export function deleteSession(userId) {
  sessions.delete(userId);
}

/**
 * Get score improvement between last two attempts for a question.
 */
export function getScoreImprovement(userId, question) {
  const session = getOrCreateSession(userId);
  const qKey = question?.substring(0, 50);
  const relevant = session.history.filter(
    (h) => h.question?.substring(0, 50) === qKey
  );

  if (relevant.length < 2) return null;

  const prev = relevant[relevant.length - 2].feedback?.overall_score || 0;
  const curr = relevant[relevant.length - 1].feedback?.overall_score || 0;
  return { previous: prev, current: curr, delta: curr - prev };
}

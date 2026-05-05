// In-memory DB (replace with MongoDB/PostgreSQL in production)
const store = {
  users: {},
  sessions: {}
};

const db = {
  // Get or create user profile
  getUser(userId) {
    if (!store.users[userId]) {
      store.users[userId] = {
        userId,
        totalSessions: 0,
        weakAreas: [],
        history: [],
        createdAt: new Date().toISOString()
      };
    }
    return store.users[userId];
  },

  // Save a feedback session
  saveSession(userId, sessionData) {
    const user = this.getUser(userId);
    const session = {
      sessionId: sessionData.sessionId,
      question: sessionData.question,
      response: sessionData.response,
      feedback: sessionData.feedback,
      mode: sessionData.mode,
      timestamp: new Date().toISOString()
    };

    user.history.push(session);
    user.totalSessions += 1;

    // Update weak areas based on scores
    const scores = sessionData.feedback.scores;
    const weakAreas = [];
    if (scores.clarity < 6) weakAreas.push("clarity");
    if (scores.confidence < 6) weakAreas.push("confidence");
    if (scores.structure < 6) weakAreas.push("structure");
    if (scores.grammar < 6) weakAreas.push("grammar");
    if (scores.relevance < 6) weakAreas.push("relevance");
    if (sessionData.feedback.filler_words.count > 3) weakAreas.push("filler_words");

    user.weakAreas = [...new Set([...user.weakAreas, ...weakAreas])];

    return session;
  },

  // Get user history
  getUserHistory(userId) {
    return this.getUser(userId).history;
  },

  // Get score trends
  getScoreTrends(userId) {
    const user = this.getUser(userId);
    if (user.history.length === 0) return [];

    return user.history.map((s, idx) => ({
      session: idx + 1,
      overall: s.feedback.overall_score,
      clarity: s.feedback.scores.clarity,
      confidence: s.feedback.scores.confidence,
      structure: s.feedback.scores.structure,
      grammar: s.feedback.scores.grammar,
      relevance: s.feedback.scores.relevance,
      timestamp: s.timestamp
    }));
  }
};

module.exports = db;

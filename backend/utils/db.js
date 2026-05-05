// In-memory database (replace with real DB like MongoDB/PostgreSQL in production)
const sessions = new Map();
const history = new Map();

export const db = {
  // Session management
  createSession(userId) {
    const session = {
      userId,
      weakAreas: [],
      history: [],
      createdAt: new Date().toISOString(),
    };
    sessions.set(userId, session);
    return session;
  },

  getSession(userId) {
    return sessions.get(userId) || this.createSession(userId);
  },

  updateSession(userId, analysisResult, question) {
    const session = this.getSession(userId);
    const entry = {
      id: Date.now().toString(),
      question,
      analysis: analysisResult,
      timestamp: new Date().toISOString(),
    };
    session.history.push(entry);

    // Update weak areas tracking
    const scores = analysisResult.scores;
    const newWeakAreas = Object.entries(scores)
      .filter(([_, score]) => score < 6)
      .map(([area]) => area);

    session.weakAreas = [...new Set([...session.weakAreas, ...newWeakAreas])];

    if (analysisResult.filler_words?.count > 3) {
      if (!session.weakAreas.includes("filler_words")) {
        session.weakAreas.push("filler_words");
      }
    }

    sessions.set(userId, session);
    return entry;
  },

  getHistory(userId) {
    const session = this.getSession(userId);
    return session.history;
  },

  getWeakAreas(userId) {
    const session = this.getSession(userId);
    return session.weakAreas;
  },
};

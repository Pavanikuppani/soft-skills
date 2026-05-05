const PREFIX = 'interviewai_';

export const storage = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(PREFIX + key)); } 
    catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } 
    catch {}
  },
  remove: (key) => localStorage.removeItem(PREFIX + key),
  
  // Skill memory
  getSkillMemory: () => storage.get('skillMemory') || { weakAreas: [], history: [] },
  updateSkillMemory: (feedback) => {
    const mem = storage.getSkillMemory();
    const entry = {
      score: feedback.overall_score,
      weakAreas: Object.entries(feedback.scores || {})
        .filter(([_, v]) => v < 6).map(([k]) => k),
      date: new Date().toISOString()
    };
    mem.history = [entry, ...mem.history].slice(0, 50);
    
    // Recompute weak areas from recent history
    const recent = mem.history.slice(0, 5);
    const areaCounts = {};
    recent.forEach(h => h.weakAreas.forEach(a => areaCounts[a] = (areaCounts[a] || 0) + 1));
    mem.weakAreas = Object.entries(areaCounts)
      .sort(([,a],[,b]) => b-a).map(([k]) => k).slice(0, 3);
    
    storage.set('skillMemory', mem);
    return mem;
  }
};

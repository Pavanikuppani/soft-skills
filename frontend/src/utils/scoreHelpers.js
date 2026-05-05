/**
 * Returns a CSS class name based on a score value (0-10).
 */
export function scoreClass(score) {
  if (score >= 7.5) return "score-high";
  if (score >= 5)   return "score-mid";
  return "score-low";
}

/**
 * Returns a CSS color variable string based on score.
 */
export function scoreColor(score) {
  if (score >= 7.5) return "var(--green)";
  if (score >= 5)   return "var(--accent)";
  return "var(--red)";
}

/**
 * Returns badge variant for confidence level.
 */
export function confidenceBadge(level) {
  const map = { High: "badge-green", Medium: "badge-amber", Low: "badge-red" };
  return map[level] || "badge-blue";
}

/**
 * Converts a 0-10 score to a 0-100 percent for progress bars.
 */
export function toPercent(score) {
  return Math.round((score / 10) * 100);
}

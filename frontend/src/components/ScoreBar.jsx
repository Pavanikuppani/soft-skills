import React from 'react';

const COLORS = {
  clarity: '#06b6d4',
  confidence: '#8b5cf6',
  structure: '#f59e0b',
  grammar: '#10b981',
  relevance: '#ec4899'
};

function getColor(score) {
  if (score >= 8) return '#10b981';
  if (score >= 6) return '#f59e0b';
  return '#ef4444';
}

export function ScoreBar({ label, score, category }) {
  const color = COLORS[category] || getColor(score);
  const pct = (score / 10) * 100;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: '#8888aa', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700 }}>{score}/10</span>
      </div>
      <div style={{
        height: 6,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 99,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 8px ${color}66`
        }} />
      </div>
    </div>
  );
}

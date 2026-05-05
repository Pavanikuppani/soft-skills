import React, { useState } from 'react';
import { ScoreBar } from './ScoreBar';
import { ScoreRadar } from './ScoreRadar';

const SCORE_LABELS = {
  clarity: 'Clarity',
  confidence: 'Confidence',
  structure: 'Structure',
  grammar: 'Grammar',
  relevance: 'Relevance'
};

function ConfidenceBadge({ level }) {
  const config = {
    High: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '🚀' },
    Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '⚡' },
    Low: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '💪' }
  }[level] || { color: '#8888aa', bg: 'rgba(136,136,170,0.1)', icon: '•' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 99,
      background: config.bg, color: config.color,
      fontSize: 12, fontWeight: 700, border: `1px solid ${config.color}33`
    }}>
      {config.icon} {level} Confidence
    </span>
  );
}

function Section({ title, children, accent = '#8b5cf6' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, padding: 20, marginBottom: 16
    }}>
      <h3 style={{
        fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: accent, marginBottom: 14
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export function FeedbackCard({ feedback, improvement, attemptCount, question, onRetry }) {
  const [showSuggested, setShowSuggested] = useState(false);
  const overall = feedback.overall_score || 0;

  const ringColor = overall >= 80 ? '#10b981' : overall >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease forwards' }}>
      
      {/* Overall Score Hero */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24,
        background: 'rgba(139,92,246,0.06)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: 20, padding: '24px 28px', marginBottom: 20
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle cx="45" cy="45" r="38" fill="none" stroke={ringColor} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 38}`}
              strokeDashoffset={`${2 * Math.PI * 38 * (1 - overall / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: ringColor, fontFamily: 'DM Serif Display' }}>
              {overall}
            </span>
            <span style={{ fontSize: 9, color: '#555570', fontWeight: 600, letterSpacing: '0.05em' }}>SCORE</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
            <ConfidenceBadge level={feedback.confidence_level} />
            {improvement !== null && (
              <span style={{
                fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 99,
                background: improvement > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: improvement > 0 ? '#10b981' : '#ef4444',
                border: `1px solid ${improvement > 0 ? '#10b98133' : '#ef444433'}`
              }}>
                {improvement > 0 ? `↑ +${improvement}` : `↓ ${improvement}`} pts from last
              </span>
            )}
          </div>
          
          {attemptCount > 1 && (
            <p style={{ fontSize: 12, color: '#555570' }}>Attempt #{attemptCount}</p>
          )}
          
          {/* Filler words */}
          {feedback.filler_words?.count > 0 && (
            <div style={{
              marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 8, padding: '6px 12px'
            }}>
              <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>
                ⚠️ {feedback.filler_words.count} filler word{feedback.filler_words.count !== 1 ? 's' : ''} detected
              </span>
              {feedback.filler_words.examples?.map(w => (
                <code key={w} style={{
                  fontSize: 10, background: 'rgba(245,158,11,0.15)',
                  color: '#f59e0b', padding: '1px 6px', borderRadius: 4
                }}>"{w}"</code>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scores Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Section title="Score Breakdown">
          {Object.entries(feedback.scores).map(([key, val]) => (
            <ScoreBar key={key} label={SCORE_LABELS[key]} score={val} category={key} />
          ))}
        </Section>

        <Section title="Visual Analysis">
          <ScoreRadar scores={feedback.scores} />
        </Section>
      </div>

      {/* Strengths & Improvements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Section title="✅ Strengths" accent="#10b981">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {feedback.strengths?.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#ccccdd' }}>
                <span style={{ color: '#10b981', flexShrink: 0 }}>→</span>
                {s}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="🎯 Improvements" accent="#f59e0b">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {feedback.improvements?.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#ccccdd' }}>
                <span style={{ color: '#f59e0b', flexShrink: 0 }}>→</span>
                {s}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Suggested Answer */}
      <Section title="💡 Model Answer" accent="#8b5cf6">
        <button
          onClick={() => setShowSuggested(!showSuggested)}
          style={{
            width: '100%', padding: '10px 16px',
            background: showSuggested ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.05)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 10, color: '#a78bfa', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', textAlign: 'left',
            transition: 'all 200ms ease', marginBottom: showSuggested ? 12 : 0
          }}
        >
          {showSuggested ? '▾ Hide Model Answer' : '▸ Show Model Answer — Learn from it'}
        </button>
        {showSuggested && (
          <div style={{
            padding: '16px', background: 'rgba(139,92,246,0.05)',
            borderRadius: 10, border: '1px solid rgba(139,92,246,0.15)',
            fontSize: 14, color: '#ddd8f8', lineHeight: 1.7,
            fontStyle: 'italic', animation: 'fadeIn 0.3s ease'
          }}>
            "{feedback.suggested_answer}"
          </div>
        )}
      </Section>

      {/* Retry Button */}
      <button
        onClick={onRetry}
        style={{
          width: '100%', padding: '16px',
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          color: 'white', borderRadius: 14, fontSize: 15,
          fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em',
          transition: 'all 200ms ease', boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
          border: 'none'
        }}
        onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
      >
        🔄 Try Again — See Your Improvement
      </button>
    </div>
  );
}

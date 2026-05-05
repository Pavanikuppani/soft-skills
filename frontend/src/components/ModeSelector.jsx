import React from 'react';

const MODES = [
  { id: 'hr', label: 'HR Interview', emoji: '👔', desc: 'Behavioral & culture fit questions' },
  { id: 'technical', label: 'Technical', emoji: '💻', desc: 'Coding & system design questions' },
  { id: 'group', label: 'Group Discussion', emoji: '🗣️', desc: 'Opinion & argument evaluation' },
  { id: 'casual', label: 'Casual', emoji: '☕', desc: 'Natural tone & fluency focus' }
];

export function ModeSelector({ selected, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {MODES.map(mode => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          style={{
            padding: '14px 16px',
            background: selected === mode.id 
              ? 'rgba(139,92,246,0.15)' 
              : 'rgba(255,255,255,0.03)',
            border: selected === mode.id 
              ? '1px solid rgba(139,92,246,0.5)' 
              : '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 200ms ease',
            transform: selected === mode.id ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 4 }}>{mode.emoji}</div>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: selected === mode.id ? '#a78bfa' : '#f0f0f8',
            marginBottom: 2
          }}>
            {mode.label}
          </div>
          <div style={{ fontSize: 11, color: '#555570', lineHeight: 1.3 }}>
            {mode.desc}
          </div>
        </button>
      ))}
    </div>
  );
}

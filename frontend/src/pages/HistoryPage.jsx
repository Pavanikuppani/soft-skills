import React, { useMemo } from 'react';
import { storage } from '../utils/storage';

function ScorePill({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 99,
      background: `${color}18`, color, border: `1px solid ${color}33`,
      fontSize: 12, fontWeight: 700
    }}>
      {score}
    </span>
  );
}

export function HistoryPage() {
  const skillMemory = storage.getSkillMemory();
  const history = skillMemory.history || [];

  const grouped = useMemo(() => {
    const groups = {};
    history.forEach((entry, i) => {
      const date = new Date(entry.date).toLocaleDateString('en', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push({ ...entry, index: i });
    });
    return groups;
  }, [history]);

  if (history.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🗂️</div>
        <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 28, marginBottom: 12, color: '#f0f0f8' }}>
          No history yet
        </h2>
        <p style={{ color: '#8888aa', fontSize: 15 }}>
          Your practice session history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 36, marginBottom: 8 }}>
        Session History
      </h1>
      <p style={{ color: '#8888aa', marginBottom: 36 }}>
        {history.length} practice session{history.length !== 1 ? 's' : ''} recorded
      </p>

      {Object.entries(grouped).map(([date, entries]) => (
        <div key={date} style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#555570',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 14, paddingBottom: 10,
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            {date}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {entries.map((entry, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  transition: 'border-color 200ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <ScorePill score={entry.score} />
                    {entry.weakAreas?.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {entry.weakAreas.map(a => (
                          <span key={a} style={{
                            fontSize: 10, padding: '2px 8px', borderRadius: 6,
                            background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                            border: '1px solid rgba(245,158,11,0.2)', fontWeight: 600
                          }}>
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#555570' }}>
                    {new Date(entry.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize: 22, fontWeight: 800, fontFamily: 'DM Serif Display',
                    color: entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#f59e0b' : '#ef4444'
                  }}>
                    {entry.score}
                  </div>
                  <div style={{ fontSize: 10, color: '#555570' }}>/ 100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

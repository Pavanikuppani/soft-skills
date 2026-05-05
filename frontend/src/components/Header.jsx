import React from 'react';

export function Header({ currentPage, onNavigate, skillMemory }) {
  const weakCount = skillMemory?.weakAreas?.length || 0;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(8,8,16,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button
          onClick={() => onNavigate('home')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16
          }}>✦</div>
          <span style={{
            fontFamily: 'DM Serif Display', fontSize: 18,
            color: '#f0f0f8', letterSpacing: '-0.02em'
          }}>
            InterviewAI
          </span>
        </button>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[
            { id: 'home', label: 'Practice' },
            { id: 'history', label: 'History' },
            { id: 'progress', label: 'Progress' }
          ].map(page => (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: currentPage === page.id ? 'rgba(139,92,246,0.15)' : 'transparent',
                color: currentPage === page.id ? '#a78bfa' : '#8888aa',
                border: currentPage === page.id ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 200ms ease'
              }}
            >
              {page.label}
            </button>
          ))}

          {weakCount > 0 && (
            <div style={{
              marginLeft: 8, padding: '4px 10px', borderRadius: 99,
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
              fontSize: 11, color: '#f59e0b', fontWeight: 700
            }}>
              {weakCount} weak area{weakCount !== 1 ? 's' : ''} flagged
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

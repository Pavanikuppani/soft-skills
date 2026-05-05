import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { storage } from '../utils/storage';

const AREA_LABELS = {
  clarity: 'Clarity',
  confidence: 'Confidence',
  structure: 'Structure',
  grammar: 'Grammar',
  relevance: 'Relevance'
};

const AREA_COLORS = {
  clarity: '#06b6d4',
  confidence: '#8b5cf6',
  structure: '#f59e0b',
  grammar: '#10b981',
  relevance: '#ec4899'
};

function StatCard({ label, value, sub, accent = '#8b5cf6' }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '20px 24px'
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent, fontFamily: 'DM Serif Display', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f8', marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#555570' }}>{sub}</div>}
    </div>
  );
}

export function ProgressPage() {
  const skillMemory = storage.getSkillMemory();
  
  const chartData = useMemo(() => {
    return skillMemory.history.slice(0, 15).reverse().map((h, i) => ({
      attempt: i + 1,
      score: h.score,
      date: new Date(h.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    }));
  }, [skillMemory.history]);

  const avgScore = chartData.length
    ? Math.round(chartData.reduce((a, b) => a + b.score, 0) / chartData.length)
    : 0;

  const best = chartData.length ? Math.max(...chartData.map(d => d.score)) : 0;
  const trend = chartData.length >= 2
    ? chartData[chartData.length - 1].score - chartData[0].score
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: '#13131f', border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: 8, padding: '8px 14px', fontSize: 13
      }}>
        <div style={{ color: '#8888aa', marginBottom: 4 }}>{payload[0]?.payload?.date}</div>
        <div style={{ color: '#8b5cf6', fontWeight: 700 }}>Score: {payload[0]?.value}</div>
      </div>
    );
  };

  if (chartData.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>📈</div>
        <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 28, marginBottom: 12, color: '#f0f0f8' }}>
          No progress yet
        </h2>
        <p style={{ color: '#8888aa', fontSize: 15 }}>
          Complete your first practice session to start tracking your improvement.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 36, marginBottom: 8 }}>
        Your Progress
      </h1>
      <p style={{ color: '#8888aa', marginBottom: 36 }}>Track how your interview skills improve over time.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
        <StatCard label="Sessions" value={chartData.length} sub="total attempts" accent="#8b5cf6" />
        <StatCard label="Avg Score" value={`${avgScore}`} sub="out of 100" accent="#06b6d4" />
        <StatCard label="Best Score" value={`${best}`} sub="personal best" accent="#10b981" />
        <StatCard 
          label="Trend" 
          value={`${trend >= 0 ? '+' : ''}${trend}`} 
          sub="first vs latest"
          accent={trend >= 0 ? '#10b981' : '#ef4444'} 
        />
      </div>

      {/* Score Chart */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 28, marginBottom: 24
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 24, color: '#f0f0f8' }}>
          Score Over Time
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <XAxis
              dataKey="date" tick={{ fill: '#555570', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false}
            />
            <YAxis
              domain={[0, 100]} tick={{ fill: '#555570', fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5}
              dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#a78bfa' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weak Areas */}
      {skillMemory.weakAreas.length > 0 && (
        <div style={{
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 20, padding: 24
        }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            🎯 Focus Areas — Practice These
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {skillMemory.weakAreas.map(area => (
              <div key={area} style={{
                padding: '10px 18px', borderRadius: 10,
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                color: AREA_COLORS[area] || '#f59e0b',
                fontSize: 13, fontWeight: 600
              }}>
                {AREA_LABELS[area] || area}
              </div>
            ))}
          </div>
          <p style={{ marginTop: 14, fontSize: 13, color: '#8888aa' }}>
            These areas have been consistently below 6/10 in your recent sessions.
          </p>
        </div>
      )}
    </div>
  );
}

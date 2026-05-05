import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const LABEL_MAP = {
  clarity: 'Clarity',
  confidence: 'Confidence',
  structure: 'Structure',
  grammar: 'Grammar',
  relevance: 'Relevance'
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#13131f',
      border: '1px solid rgba(139,92,246,0.3)',
      borderRadius: 8,
      padding: '8px 14px',
      fontSize: 13,
      color: '#f0f0f8'
    }}>
      <span style={{ fontWeight: 600, color: '#8b5cf6' }}>{payload[0].payload.label}</span>
      <span style={{ marginLeft: 8 }}>{payload[0].value}/10</span>
    </div>
  );
};

export function ScoreRadar({ scores }) {
  const data = Object.entries(scores).map(([key, value]) => ({
    label: LABEL_MAP[key] || key,
    value
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fill: '#8888aa', fontSize: 12, fontFamily: 'DM Sans' }}
        />
        <Radar
          dataKey="value"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={{ fill: '#8b5cf6', r: 4 }}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

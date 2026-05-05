import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TrendChart = ({ data }) => {
  if (!data || data.length < 2) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace", fontSize: 13 }}>
        Complete at least 2 sessions to see your progress chart 📈
      </div>
    );
  }
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="session" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
          <YAxis domain={[0, 10]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "var(--text-secondary)" }} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
          <Line type="monotone" dataKey="clarity" stroke="#6c63ff" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="confidence" stroke="#22d3a8" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="structure" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="grammar" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="relevance" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;

export default function ScoreRing({ score, label, size = 80, prev }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 10) * circ;
  const color = score >= 7 ? "var(--success)" : score >= 5 ? "var(--warning)" : "var(--danger)";
  const delta = prev !== undefined ? score - prev : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={5} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
            strokeDasharray={`${fill} ${circ - fill}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s ease" }}
          />
        </svg>
        <span style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          fontSize: size * 0.22, fontWeight: 700, fontFamily: "var(--font-display)", color,
        }}>{score}</span>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textAlign: "center", textTransform: "capitalize" }}>
        {label}
      </span>
      {delta !== null && (
        <span style={{ fontSize: 10, fontWeight: 700, color: delta > 0 ? "var(--success)" : delta < 0 ? "var(--danger)" : "var(--text-muted)" }}>
          {delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : "—"}
        </span>
      )}
    </div>
  );
}

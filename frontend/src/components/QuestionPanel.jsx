import { useState, useEffect } from "react";
import { api } from "../utils/api.js";

export default function QuestionPanel({ mode, question, onQuestionSelect, onNewQuestion }) {
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    setLoadingQ(true);
    api.getQuestions(mode).then((d) => { setQuestions(d.questions); setLoadingQ(false); });
  }, [mode]);

  const handleRandom = async () => {
    onNewQuestion();
    const d = await api.getRandomQuestion(mode);
    onQuestionSelect(d.question);
  };

  return (
    <div className="fade-in-delay-1" style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          Select a Question
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleRandom} style={btnStyle("var(--accent)", "var(--accent-dim)")}>
            🎲 Random
          </button>
          <button onClick={() => setShowCustom(!showCustom)} style={btnStyle("var(--text-secondary)", "var(--bg-elevated)")}>
            ✏️ Custom
          </button>
        </div>
      </div>

      {showCustom && (
        <div style={{ marginBottom: 16 }}>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Type your own question..."
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "var(--radius)",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              color: "var(--text-primary)", fontSize: 14, outline: "none",
            }}
          />
          <button
            onClick={() => { if (custom.trim()) { onQuestionSelect(custom.trim()); setShowCustom(false); } }}
            style={{ marginTop: 8, ...btnStyle("var(--accent)", "var(--accent-dim)") }}
          >
            Use This Question →
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {loadingQ ? (
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading questions...</p>
        ) : questions.map((q, i) => (
          <button key={i} onClick={() => { onQuestionSelect(q); onNewQuestion(); setTimeout(() => onQuestionSelect(q), 0); }} style={{
            textAlign: "left", padding: "11px 16px", borderRadius: "var(--radius)",
            border: `1px solid ${question === q ? "var(--accent)" : "var(--border)"}`,
            background: question === q ? "var(--accent-dim)" : "transparent",
            color: question === q ? "var(--accent-light)" : "var(--text-secondary)",
            fontSize: 13.5, lineHeight: 1.5, cursor: "pointer", transition: "all 0.15s",
          }}>
            {q}
          </button>
        ))}
      </div>

      {question && (
        <div style={{
          marginTop: 18, padding: "14px 18px", borderRadius: "var(--radius)",
          background: "var(--success-dim)", border: "1px solid var(--success)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--success)", marginBottom: 4 }}>
            Selected Question
          </p>
          <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.55 }}>{question}</p>
        </div>
      )}
    </div>
  );
}

const btnStyle = (color, bg) => ({
  padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
  border: `1px solid ${color}`, background: bg, color: color, cursor: "pointer",
  fontFamily: "var(--font-body)", transition: "all 0.15s",
});

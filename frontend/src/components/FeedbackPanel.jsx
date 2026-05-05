import { useState } from "react";
import ScoreRing from "./ScoreRing.jsx";

const CONFIDENCE_COLOR = { Low: "var(--danger)", Medium: "var(--warning)", High: "var(--success)" };

export default function FeedbackPanel({ result, previousResult, question }) {
  const { analysis, weakAreas, personalized_tip } = result;
  const [showSuggested, setShowSuggested] = useState(false);
  const prevScores = previousResult?.analysis?.scores;

  const overall = analysis.overall_score;
  const overallColor = overall >= 70 ? "var(--success)" : overall >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Overall Score Banner */}
      <div style={{
        padding: "24px 28px", borderRadius: "var(--radius-lg)",
        background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)",
        border: "1px solid var(--border)", display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
            Overall Score
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 52, fontWeight: 800, fontFamily: "var(--font-display)", color: overallColor, lineHeight: 1 }}>
              {overall}
            </span>
            <span style={{ fontSize: 20, color: "var(--text-muted)" }}>/100</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            display: "inline-block", padding: "6px 18px", borderRadius: 999,
            background: CONFIDENCE_COLOR[analysis.confidence_level] + "22",
            border: `1px solid ${CONFIDENCE_COLOR[analysis.confidence_level]}`,
            color: CONFIDENCE_COLOR[analysis.confidence_level],
            fontSize: 13, fontWeight: 700, marginBottom: 8,
          }}>
            {analysis.confidence_level} Confidence
          </div>
          {analysis.filler_words.count > 0 && (
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              🚩 {analysis.filler_words.count} filler word{analysis.filler_words.count !== 1 ? "s" : ""} detected
            </p>
          )}
        </div>
      </div>

      {/* Score Rings */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "24px 28px",
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
          Detailed Scores {prevScores && <span style={{ color: "var(--accent)", marginLeft: 6 }}>↕ vs Previous</span>}
        </p>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "space-around" }}>
          {Object.entries(analysis.scores).map(([key, val]) => (
            <ScoreRing key={key} score={val} label={key} prev={prevScores?.[key]} />
          ))}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="✅ Strengths" color="var(--success)" bgColor="var(--success-dim)" items={analysis.strengths} />
        <Card title="⚡ Improvements" color="var(--warning)" bgColor="var(--warning-dim)" items={analysis.improvements} />
      </div>

      {/* Filler Words */}
      {analysis.filler_words.count > 0 && (
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "20px 24px",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>
            🚩 Filler Words Detected
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {analysis.filler_words.examples.map((word, i) => (
              <span key={i} style={{
                padding: "4px 12px", borderRadius: 999,
                background: "var(--danger-dim)", border: "1px solid var(--danger)",
                color: "var(--danger)", fontSize: 13, fontWeight: 600,
              }}>"{word}"</span>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Total count: <strong style={{ color: "var(--danger)" }}>{analysis.filler_words.count}</strong>.
            Replace filler words with a deliberate 1-second pause — silence sounds confident.
          </p>
        </div>
      )}

      {/* Personalized Tip */}
      {personalized_tip && (
        <div style={{
          background: "var(--accent-dim)", border: "1px solid var(--border-glow)",
          borderRadius: "var(--radius-lg)", padding: "18px 22px",
          display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 22 }}>💡</span>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-light)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Personalized Tip
            </p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{personalized_tip}</p>
          </div>
        </div>
      )}

      {/* AI Suggested Answer */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", overflow: "hidden",
      }}>
        <button
          onClick={() => setShowSuggested(!showSuggested)}
          style={{
            width: "100%", padding: "18px 24px", display: "flex", alignItems: "center",
            justifyContent: "space-between", background: "none", cursor: "pointer",
            color: "var(--text-primary)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
          }}
        >
          <span>🤖 See AI-Improved Answer</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", transition: "transform 0.2s", transform: showSuggested ? "rotate(180deg)" : "none" }}>▼</span>
        </button>
        {showSuggested && (
          <div style={{ padding: "0 24px 20px", borderTop: "1px solid var(--border)" }}>
            <div style={{
              marginTop: 16, padding: "16px 18px", borderRadius: "var(--radius)",
              background: "var(--bg-elevated)", borderLeft: "3px solid var(--accent)",
            }}>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic" }}>
                "{analysis.suggested_answer}"
              </p>
            </div>
            <p style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)" }}>
              Study the structure and tone — then try answering again to see your improvement score.
            </p>
          </div>
        )}
      </div>

      {/* Weak Areas */}
      {weakAreas?.length > 0 && (
        <div style={{
          padding: "14px 20px", borderRadius: "var(--radius)",
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Focus Areas:</span>
          {weakAreas.map((a) => (
            <span key={a} style={{
              padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
              background: "var(--warning-dim)", border: "1px solid var(--warning)",
              color: "var(--warning)", textTransform: "capitalize",
            }}>{a.replace("_", " ")}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ title, color, bgColor, items }) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: "20px 22px",
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color, marginBottom: 14 }}>
        {title}
      </p>
      <ul style={{ listStyle: "none" }}>
        {items.map((item, i) => (
          <li key={i} style={{
            fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55,
            paddingLeft: 14, marginBottom: 10, position: "relative",
          }}>
            <span style={{ position: "absolute", left: 0, color, fontWeight: 700 }}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

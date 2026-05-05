import React, { useState } from "react";
import ModeSelector from "../components/ModeSelector";
import FeedbackCard from "../components/FeedbackCard";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { analyzeResponse } from "../utils/api";

const SAMPLE_QUESTIONS = {
  hr: [
    "Tell me about yourself and your professional background.",
    "What is your greatest weakness, and how are you working on it?",
    "Where do you see yourself in 5 years?",
    "Describe a time you resolved a difficult team conflict.",
    "Why do you want to work at this company?"
  ],
  group: [
    "Do you think AI will replace human jobs in the next decade?",
    "Should social media platforms be regulated by governments?",
    "Is remote work more productive than office work?",
    "What is more important: work-life balance or career ambition?"
  ],
  casual: [
    "What do you do in your free time?",
    "Tell me about a book or movie that changed your perspective.",
    "How do you handle stress in your daily life?",
    "What's the best advice you've ever received?"
  ]
};

const Practice = ({ userId }) => {
  const [mode, setMode] = useState("hr");
  const [question, setQuestion] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const { isListening, transcript, error: speechError, supported, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  const currentQuestion = useCustom ? customQuestion : question;

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript) setResponseText(transcript);
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion.trim()) return setError("Please select or enter a question.");
    if (!responseText.trim()) return setError("Please enter your response.");
    setError(null);
    setLoading(true);
    try {
      const data = await analyzeResponse({ question: currentQuestion, responseText, mode, userId });
      setResult({ ...data, originalResponse: responseText });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => { setResult(null); setResponseText(""); resetTranscript(); };

  const samples = SAMPLE_QUESTIONS[mode] || [];

  if (result) return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono, monospace", marginBottom: 6, textTransform: "uppercase" }}>Question Asked</div>
        <div style={{ fontSize: 16, color: "var(--text-primary)", fontWeight: 600, padding: "12px 16px", background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--border)" }}>
          {currentQuestion}
        </div>
      </div>
      <FeedbackCard result={result} originalResponse={result.originalResponse} onRetry={handleRetry} />
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px", display: "flex", flexDirection: "column", gap: 28 }}>

      <div className="fade-up">
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 34, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          Practice Your <span style={{ color: "var(--accent)" }}>Interview Skills</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 8, fontSize: 15 }}>
          Speak or type your answer — get instant AI feedback with a score breakdown.
        </p>
      </div>

      <div className="fade-up fade-up-delay-1">
        <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>Evaluation Mode</label>
        <ModeSelector selected={mode} onChange={(m) => { setMode(m); setQuestion(""); }} />
      </div>

      <div className="fade-up fade-up-delay-2">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>Question</label>
          <button onClick={() => setUseCustom(!useCustom)} style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "DM Mono, monospace" }}>
            {useCustom ? "← Pick sample" : "Custom question →"}
          </button>
        </div>

        {useCustom ? (
          <textarea placeholder="Type your custom question here..." value={customQuestion} onChange={(e) => setCustomQuestion(e.target.value)} rows={2}
            style={{ width: "100%", padding: "14px 16px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 14, fontFamily: "Cabinet Grotesk, sans-serif", resize: "vertical", outline: "none" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {samples.map((q, i) => (
              <button key={i} onClick={() => setQuestion(q)} style={{
                width: "100%", padding: "13px 16px", borderRadius: "var(--radius)", textAlign: "left",
                border: question === q ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                background: question === q ? "var(--accent-glow)" : "var(--bg-card)",
                color: question === q ? "var(--text-primary)" : "var(--text-secondary)",
                cursor: "pointer", fontSize: 14, fontFamily: "Cabinet Grotesk, sans-serif", transition: "all 0.2s"
              }}>{q}</button>
            ))}
          </div>
        )}
      </div>

      <div className="fade-up fade-up-delay-3">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Your Response {isListening && <span style={{ color: "var(--danger)", marginLeft: 6, animation: "pulse-glow 1s infinite" }}>● REC</span>}
          </label>
          {supported && (
            <button onClick={handleVoiceToggle} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8,
              border: `1.5px solid ${isListening ? "var(--danger)" : "var(--border)"}`,
              background: isListening ? "var(--danger-glow)" : "var(--bg-elevated)",
              color: isListening ? "var(--danger)" : "var(--text-secondary)",
              cursor: "pointer", fontSize: 12, fontFamily: "DM Mono, monospace", transition: "all 0.2s"
            }}>
              {isListening ? "⏹ Stop Recording" : "🎤 Speak"}
            </button>
          )}
        </div>

        {isListening && (
          <div style={{ marginBottom: 8, padding: "10px 14px", background: "var(--danger-glow)", borderRadius: 8, fontSize: 13, color: "var(--danger)", fontFamily: "DM Mono, monospace" }}>
            🎙️ Listening... {transcript && `"${transcript.slice(0, 60)}..."`}
          </div>
        )}
        {speechError && <div style={{ marginBottom: 8, padding: "8px 14px", background: "var(--warning-glow)", borderRadius: 8, fontSize: 12, color: "var(--warning)" }}>{speechError}</div>}

        <textarea placeholder="Type your answer here, or use the microphone to speak..." value={responseText} onChange={(e) => setResponseText(e.target.value)} rows={6}
          style={{ width: "100%", padding: "16px", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 14, fontFamily: "Cabinet Grotesk, sans-serif", resize: "vertical", outline: "none", lineHeight: 1.7, transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
        <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>
          {responseText.length} chars · {responseText.trim().split(/\s+/).filter(Boolean).length} words
        </div>
      </div>

      {error && <div style={{ padding: "12px 16px", borderRadius: 8, background: "var(--danger-glow)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--danger)", fontSize: 13 }}>⚠️ {error}</div>}

      <button onClick={handleSubmit} disabled={loading} style={{
        width: "100%", padding: "18px", borderRadius: "var(--radius)", border: "none",
        background: loading ? "var(--bg-elevated)" : "linear-gradient(135deg, var(--accent), #8b5cf6)",
        color: loading ? "var(--text-muted)" : "white",
        fontSize: 16, fontWeight: 800, fontFamily: "Syne, sans-serif",
        cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
        boxShadow: loading ? "none" : "0 8px 24px rgba(108,99,255,0.3)"
      }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--border)", borderTopColor: "var(--accent)", animation: "spin 0.8s linear infinite" }} />
            Analyzing your response...
          </div>
        ) : "Analyze My Response →"}
      </button>
    </div>
  );
};

export default Practice;

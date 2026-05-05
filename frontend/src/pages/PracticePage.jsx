import React, { useState, useEffect } from 'react';
import { ModeSelector } from '../components/ModeSelector';
import { ResponseInput } from '../components/ResponseInput';
import { FeedbackCard } from '../components/FeedbackCard';
import { useAnalysis } from '../hooks/useAnalysis';
import { analysisApi } from '../utils/api';
import toast from 'react-hot-toast';

// Always-available fallback so the app works even when backend is offline
const FALLBACK_QUESTIONS = {
  hr: [
    'Tell me about yourself.',
    'What is your greatest weakness?',
    'Where do you see yourself in 5 years?',
    'Why do you want to work here?',
    'Describe a time you handled conflict at work.',
    'What motivates you?'
  ],
  technical: [
    'Explain the concept of RESTful APIs.',
    'What is the difference between SQL and NoSQL databases?',
    'How does garbage collection work in JavaScript?',
    'Explain Object-Oriented Programming principles.',
    'How would you optimize a slow database query?'
  ],
  group: [
    'Should social media platforms be regulated by governments?',
    'Is remote work more productive than office work?',
    'Discuss the pros and cons of four-day work weeks.',
    'How should companies approach AI ethics?'
  ],
  casual: [
    'What are your hobbies outside of work?',
    'How do you stay updated with industry trends?',
    'What is the most interesting project you have worked on?',
    'How do you prefer to receive feedback?'
  ]
};

export function PracticePage() {
  const [mode, setMode]                   = useState('hr');
  const [question, setQuestion]           = useState(FALLBACK_QUESTIONS.hr[0]);
  const [customQuestion, setCustomQuestion] = useState(false);
  const [response, setResponse]           = useState('');
  const [sampleQuestions, setSampleQuestions] = useState(FALLBACK_QUESTIONS.hr);
  const [showFeedback, setShowFeedback]   = useState(false);

  const { loading, error, feedback, attemptCount, improvement, usingDemo, submitResponse, reset } = useAnalysis();

  useEffect(() => { loadQuestions(mode); }, [mode]);

  async function loadQuestions(m) {
    const fallback = FALLBACK_QUESTIONS[m] || FALLBACK_QUESTIONS.hr;
    setSampleQuestions(fallback);
    if (!customQuestion) setQuestion(fallback[0]);
    try {
      const data = await analysisApi.getQuestions(m);
      if (data.questions?.length) {
        setSampleQuestions(data.questions);
        if (!customQuestion) setQuestion(data.questions[0]);
      }
    } catch { /* backend offline — fallback already set */ }
  }

  async function handleSubmit() {
    const q = question.trim();
    const r = response.trim();
    if (!q) { toast.error('Please select or type a question first.'); return; }
    if (!r || r.length < 5) { toast.error('Please type a response of at least 5 characters.'); return; }
    try {
      await submitResponse({ question: q, responseText: r, mode });
      setShowFeedback(true);
    } catch (err) {
      toast.error(err.message || 'Analysis failed. Please try again.');
    }
  }

  function handleRetry() { setResponse(''); setShowFeedback(false); }

  function handleNewQuestion() {
    reset();
    setResponse('');
    setShowFeedback(false);
    const qs = sampleQuestions.length ? sampleQuestions : FALLBACK_QUESTIONS[mode];
    setQuestion(qs[Math.floor(Math.random() * qs.length)]);
  }

  function handleModeChange(m) {
    setMode(m);
    setCustomQuestion(false);
    reset();
    setResponse('');
    setShowFeedback(false);
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 99,
          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
          marginBottom: 20
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#8b5cf6' }}>
            AI-POWERED COACHING
          </span>
        </div>
        <h1 style={{
          fontFamily: 'DM Serif Display', fontSize: 'clamp(32px, 5vw, 52px)',
          lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14,
          background: 'linear-gradient(135deg, #f0f0f8 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Speak with confidence.<br />Get better every time.
        </h1>
        <p style={{ fontSize: 16, color: '#8888aa', maxWidth: 480, margin: '0 auto' }}>
          Practice interview answers and get instant AI feedback on clarity, structure, and impact.
        </p>
      </div>

      {/* Demo mode notice */}
      {usingDemo && (
        <div style={{
          marginBottom: 20, padding: '10px 16px', borderRadius: 12,
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
          fontSize: 13, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 8
        }}>
          ⚡ <strong>Demo mode</strong> — Backend not connected. Showing local AI analysis. 
          Set <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>GROQ_API_KEY</code> and start the backend for full AI feedback.
        </div>
      )}

      {!showFeedback ? (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left: Mode + Question */}
          <div>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 20, padding: 24, marginBottom: 16
            }}>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#8888aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
                Interview Mode
              </h2>
              <ModeSelector selected={mode} onChange={handleModeChange} />
            </div>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 20, padding: 24
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: 12, fontWeight: 700, color: '#8888aa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Question
                </h2>
                <button
                  onClick={() => {
                    setCustomQuestion(!customQuestion);
                    if (customQuestion) setQuestion(sampleQuestions[0] || FALLBACK_QUESTIONS[mode][0]);
                  }}
                  style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 6,
                    background: customQuestion ? 'rgba(139,92,246,0.15)' : 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: customQuestion ? '#a78bfa' : '#555570',
                    cursor: 'pointer'
                  }}
                >
                  {customQuestion ? 'Use Sample' : 'Custom'}
                </button>
              </div>

              {customQuestion ? (
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Type your own question..."
                  rows={3}
                  style={{
                    width: '100%', padding: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10, color: '#f0f0f8', fontSize: 13, resize: 'vertical'
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sampleQuestions.slice(0, 6).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setQuestion(q)}
                      style={{
                        padding: '10px 14px', borderRadius: 10, textAlign: 'left',
                        background: question === q ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)',
                        border: question === q ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(255,255,255,0.06)',
                        color: question === q ? '#a78bfa' : '#8888aa',
                        fontSize: 12, cursor: 'pointer', lineHeight: 1.4,
                        transition: 'all 200ms ease'
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Response Input */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 28
          }}>
            <h2 style={{ fontSize: 12, fontWeight: 700, color: '#8888aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
              Your Response
            </h2>
            <ResponseInput
              value={response}
              onChange={setResponse}
              onSubmit={handleSubmit}
              loading={loading}
              question={question}
            />

            {/* Error display — shows backend validation details */}
            {error && (
              <div style={{
                marginTop: 12, padding: '12px 16px', borderRadius: 10,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                fontSize: 13, color: '#ef4444', display: 'flex', alignItems: 'flex-start', gap: 8
              }}>
                <span style={{ flexShrink: 0 }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24
          }}>
            <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 24, color: '#f0f0f8' }}>
              Your Feedback
            </h2>
            <button
              onClick={handleNewQuestion}
              style={{
                padding: '8px 18px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#8888aa', fontSize: 13, cursor: 'pointer'
              }}
            >
              ← New Question
            </button>
          </div>

          <FeedbackCard
            feedback={feedback}
            improvement={improvement}
            attemptCount={attemptCount}
            question={question}
            onRetry={handleRetry}
          />
        </div>
      )}
    </div>
  );
}

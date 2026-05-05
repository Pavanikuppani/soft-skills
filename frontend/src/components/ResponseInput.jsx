import React, { useState, useEffect } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';

export function ResponseInput({ value, onChange, onSubmit, loading, question }) {
  const [charCount, setCharCount] = useState(0);

  const { isRecording, isSupported, startRecording, stopRecording } = useSpeechToText((text) => {
    onChange(text);
  });

  useEffect(() => setCharCount(value.length), [value]);

  const handleTextChange = (e) => onChange(e.target.value);
  const canSubmit = value.trim().length >= 10 && !loading;

  return (
    <div>
      {question && (
        <div style={{
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 16
        }}>
          <div style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 700, marginBottom: 6, letterSpacing: '0.08em' }}>
            QUESTION
          </div>
          <p style={{ fontSize: 15, color: '#f0f0f8', lineHeight: 1.5, fontFamily: 'DM Serif Display' }}>
            {question}
          </p>
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: 12 }}>
        <textarea
          value={value}
          onChange={handleTextChange}
          placeholder="Type your answer here or use the microphone button to speak..."
          rows={5}
          style={{
            width: '100%', padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${isRecording ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 14, color: '#f0f0f8', fontSize: 14,
            resize: 'vertical', lineHeight: 1.6,
            transition: 'border-color 200ms ease',
            animation: isRecording ? 'pulse-glow 2s infinite' : 'none'
          }}
        />
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          fontSize: 11, color: '#555570'
        }}>
          {charCount} chars
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {/* Mic Button */}
        {isSupported && (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              padding: '14px 18px', borderRadius: 12,
              background: isRecording ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
              border: isRecording ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
              color: isRecording ? '#ef4444' : '#8888aa',
              fontSize: 16, cursor: 'pointer',
              transition: 'all 200ms ease',
              animation: isRecording ? 'recording-pulse 1.5s infinite' : 'none',
              flexShrink: 0
            }}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
        )}

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{
            flex: 1, padding: '14px 24px',
            background: canSubmit
              ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
              : 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: 12,
            color: canSubmit ? 'white' : '#555570',
            fontSize: 14, fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 200ms ease',
            boxShadow: canSubmit ? '0 4px 20px rgba(139,92,246,0.3)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
          onMouseEnter={e => canSubmit && (e.target.style.transform = 'translateY(-1px)')}
          onMouseLeave={e => (e.target.style.transform = 'translateY(0)')}
        >
          {loading ? (
            <>
              <div style={{
                width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              Analyzing...
            </>
          ) : (
            '✦ Analyze My Response'
          )}
        </button>
      </div>

      {isRecording && (
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', background: 'rgba(239,68,68,0.08)',
          borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)'
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#ef4444',
            animation: 'recording-pulse 1s infinite'
          }} />
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
            Recording... speak your answer clearly
          </span>
        </div>
      )}
    </div>
  );
}

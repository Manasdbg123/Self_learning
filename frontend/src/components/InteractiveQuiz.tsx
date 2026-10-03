'use client';
import React, { useState } from 'react';

interface QuizQuestion { question: string; options: string[]; correctIndex: number; explanation: string; }
interface InteractiveQuizProps { topicTitle: string; questions: QuizQuestion[]; }

export default function InteractiveQuiz({ topicTitle, questions }: InteractiveQuizProps) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  if (!questions?.length) return null;

  const totalDone = Object.keys(submitted).length;
  const correctCount = Object.entries(submitted).filter(([qi, done]) =>
    done && selected[+qi] === questions[+qi].correctIndex
  ).length;
  const allDone = totalDone === questions.length;
  const scorePct = allDone ? Math.round((correctCount / questions.length) * 100) : 0;

  const scoreColor = scorePct === 100 ? '#10b981' : scorePct >= 67 ? '#6366f1' : '#ef4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 99,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            color: 'var(--accent-light)', fontSize: 12, fontWeight: 600, marginBottom: 8,
          }}>🧠 Knowledge Check</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Quiz: {topicTitle}</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Select an option then click "Check Answer"</p>
        </div>
        {totalDone > 0 && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: scoreColor }}>{correctCount}/{questions.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {allDone ? (scorePct === 100 ? '🏆 Perfect!' : scorePct >= 67 ? '👍 Good job!' : '📚 Keep studying') : `${totalDone} answered`}
            </div>
          </div>
        )}
      </div>

      {/* Score progress */}
      {totalDone > 0 && (
        <div className="progress-track" style={{ height: 5 }}>
          <div style={{
            height: '100%', borderRadius: 99, width: `${scorePct}%`,
            background: scorePct === 100 ? '#10b981' : scorePct >= 67 ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : '#ef4444',
            transition: 'width 0.5s ease',
          }} />
        </div>
      )}

      {/* Questions */}
      {questions.map((q, qi) => {
        const isSubmitted = !!submitted[qi];
        const chosen = selected[qi];
        const isCorrect = isSubmitted && chosen === q.correctIndex;

        return (
          <div key={qi} style={{
            borderRadius: 14, overflow: 'hidden',
            border: `1px solid ${isSubmitted ? (isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)') : 'var(--border)'}`,
            background: isSubmitted ? (isCorrect ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)') : 'var(--bg-surface)',
            transition: 'border-color 0.3s, background 0.3s',
          }}>
            {/* Question */}
            <div style={{ padding: '18px 20px 14px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  background: isSubmitted ? (isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)') : 'rgba(99,102,241,0.12)',
                  color: isSubmitted ? (isCorrect ? '#34d399' : '#f87171') : 'var(--accent-light)',
                }}>
                  {isSubmitted ? (isCorrect ? '✓' : '✗') : `Q${qi + 1}`}
                </span>
                <p style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.55, flex: 1 }}>
                  {q.question}
                </p>
              </div>
            </div>

            {/* Options */}
            <div style={{ padding: '0 20px 16px 56px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oi) => {
                let cls = 'quiz-option';
                if (!isSubmitted && chosen === oi) cls += ' selected';
                if (isSubmitted) {
                  if (oi === q.correctIndex) cls += ' correct';
                  else if (chosen === oi) cls += ' wrong';
                  else cls += ' dimmed';
                }
                return (
                  <button
                    key={oi}
                    disabled={isSubmitted}
                    onClick={() => !isSubmitted && setSelected(s => ({ ...s, [qi]: oi }))}
                    className={cls}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
                    <span style={{ flex: 1, textAlign: 'left', lineHeight: 1.5 }}>{opt}</span>
                    {isSubmitted && oi === q.correctIndex && <span style={{ color: '#34d399', fontWeight: 700 }}>✓</span>}
                    {isSubmitted && chosen === oi && oi !== q.correctIndex && <span style={{ color: '#f87171', fontWeight: 700 }}>✗</span>}
                  </button>
                );
              })}
            </div>

            {/* Check / Explanation */}
            <div style={{ padding: '0 20px 18px 56px' }}>
              {!isSubmitted ? (
                <button
                  disabled={chosen === undefined}
                  onClick={() => chosen !== undefined && setSubmitted(s => ({ ...s, [qi]: true }))}
                  style={{
                    padding: '8px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    background: chosen !== undefined ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-muted)',
                    border: 'none', color: chosen !== undefined ? '#fff' : 'var(--text-muted)',
                    boxShadow: chosen !== undefined ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                    transition: 'all 0.15s', opacity: chosen === undefined ? 0.5 : 1,
                  }}
                >Check Answer →</button>
              ) : (
                <div style={{
                  padding: '12px 16px', borderRadius: 10, fontSize: 13, lineHeight: 1.7,
                  background: isCorrect ? 'rgba(16,185,129,0.06)' : 'var(--bg-elevated)',
                  border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                  color: isCorrect ? '#34d399' : 'var(--text-secondary)',
                }}>
                  <strong>{isCorrect ? '✅ Correct! ' : '💡 Explanation: '}</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* All done */}
      {allDone && (
        <div style={{
          textAlign: 'center', padding: '28px 20px', borderRadius: 16,
          background: scorePct === 100 ? 'rgba(16,185,129,0.06)' : scorePct >= 67 ? 'rgba(99,102,241,0.06)' : 'rgba(239,68,68,0.06)',
          border: `1px solid ${scorePct === 100 ? 'rgba(16,185,129,0.25)' : scorePct >= 67 ? 'rgba(99,102,241,0.25)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {scorePct === 100 ? '🏆' : scorePct >= 67 ? '🎯' : '📚'}
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: scoreColor, marginBottom: 6 }}>{scorePct}%</div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto' }}>
            {scorePct === 100
              ? "Perfect score! You've mastered this topic. Move to the next one."
              : scorePct >= 67
                ? 'Good understanding. Review wrong answers, then try again.'
                : 'Keep studying — re-read the Deep Dive tab before retrying.'}
          </p>
        </div>
      )}
    </div>
  );
}

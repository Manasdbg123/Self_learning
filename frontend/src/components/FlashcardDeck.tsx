'use client';
import React, { useState } from 'react';

interface Flashcard { question: string; answer: string; }
interface FlashcardDeckProps { cards: Flashcard[]; }

export default function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());

  if (!cards?.length) return null;

  const card = cards[idx];
  const isMastered = mastered.has(idx);

  const goTo = (i: number) => { setFlipped(false); setTimeout(() => setIdx(i), 220); };
  const goNext = () => goTo((idx + 1) % cards.length);
  const goPrev = () => goTo((idx - 1 + cards.length) % cards.length);

  const rate = (easy: boolean) => {
    if (easy) setMastered(s => { const n = new Set(s); n.add(idx); return n; });
    setTimeout(goNext, 350);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 99,
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
            color: '#c084fc', fontSize: 12, fontWeight: 600, marginBottom: 8,
          }}>🃏 Active Recall — Spaced Repetition</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Flashcard Deck</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Click the card to reveal the answer, then rate yourself</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
            {idx + 1} <span style={{ color: 'var(--text-muted)' }}>/ {cards.length}</span>
          </div>
          <div style={{ fontSize: 11, color: '#a855f7', marginTop: 2 }}>{mastered.size} mastered</div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: 5, borderRadius: 99, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              width: i === idx ? 24 : 12,
              background: i === idx ? '#a855f7' : mastered.has(i) ? '#10b981' : 'var(--bg-muted)',
            }}
          />
        ))}
      </div>

      {/* 3D flip card */}
      <div
        className="flashcard-scene"
        style={{ height: 230, position: 'relative' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flashcard-card ${flipped ? 'is-flipped' : ''}`} style={{ height: 230 }}>
          {/* Front */}
          <div className="flashcard-face" style={{
            background: 'linear-gradient(135deg,var(--bg-surface),var(--bg-elevated))',
            border: '1px solid rgba(168,85,247,0.3)',
            justifyContent: 'space-between', padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a855f7' }}>❓ Question</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tap to reveal ↩</span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.55, textAlign: 'center' }}>
                {card.question}
              </p>
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>Card {idx + 1} of {cards.length}</div>
          </div>

          {/* Back */}
          <div className="flashcard-face flashcard-back-face" style={{
            background: 'linear-gradient(135deg,#141a2e,#1a2038)',
            border: '1px solid rgba(99,102,241,0.35)',
            justifyContent: 'space-between', padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-light)' }}>💡 Answer</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tap to flip back ↩</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{card.answer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating / Controls */}
      {flipped ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={(e) => { e.stopPropagation(); rate(false); }}
            style={{
              padding: '11px 16px', borderRadius: 11, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.3)', color: '#f87171',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
          >😓 Hard — Review Again</button>
          <button
            onClick={(e) => { e.stopPropagation(); rate(true); }}
            style={{
              padding: '11px 16px', borderRadius: 11, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.3)', color: '#34d399',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(16,185,129,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(16,185,129,0.08)')}
          >✅ Got It — Next Card</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={goPrev}
            style={{
              padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >← Prev</button>
          <button
            onClick={(e) => { e.stopPropagation(); const n = new Set(mastered); n.has(idx) ? n.delete(idx) : n.add(idx); setMastered(n); }}
            style={{
              flex: 1, padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: isMastered ? 'rgba(16,185,129,0.08)' : 'var(--bg-elevated)',
              border: `1px solid ${isMastered ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
              color: isMastered ? '#34d399' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >{isMastered ? '⭐ Mastered' : 'Mark Mastered'}</button>
          <button
            onClick={goNext}
            style={{
              padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: 'linear-gradient(135deg,#7c3aed,#a855f7)', border: 'none', color: '#fff',
              boxShadow: '0 4px 14px rgba(168,85,247,0.3)', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >Next →</button>
        </div>
      )}

      {/* Mastery summary */}
      {mastered.size > 0 && (
        <div style={{
          padding: '10px 16px', borderRadius: 10, textAlign: 'center', fontSize: 12, fontWeight: 600,
          background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399',
        }}>
          🎉 {mastered.size} / {cards.length} mastered{mastered.size === cards.length ? ' — Deck complete!' : ''}
        </div>
      )}
    </div>
  );
}

'use client';
import React, { useState } from 'react';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export default function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [rating, setRating] = useState<Record<number, 'easy' | 'hard' | null>>({});

  if (!cards || cards.length === 0) return null;

  const current = cards[currentIndex];
  const isMastered = mastered.has(currentIndex);
  const masteredCount = mastered.size;

  const goNext = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % cards.length), 200);
  };

  const goPrev = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length), 200);
  };

  const toggleMastered = () => {
    setMastered((prev) => {
      const s = new Set(prev);
      s.has(currentIndex) ? s.delete(currentIndex) : s.add(currentIndex);
      return s;
    });
  };

  const handleRating = (r: 'easy' | 'hard') => {
    setRating(prev => ({ ...prev, [currentIndex]: r }));
    if (r === 'easy') {
      setMastered(prev => { const s = new Set(prev); s.add(currentIndex); return s; });
    }
    setTimeout(goNext, 350);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            🃏 Active Recall Flashcards
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-2">Spaced Repetition Cards</h3>
          <p className="text-xs text-slate-500 mt-0.5">Click the card to reveal the answer, then rate yourself</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-300">{currentIndex + 1} <span className="text-slate-600">/</span> {cards.length}</div>
          <div className="text-xs text-purple-400 font-medium mt-0.5">{masteredCount} mastered</div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 flex-wrap">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFlipped(false); setTimeout(() => setCurrentIndex(i), 150); }}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex ? 'w-6 bg-purple-400' :
              mastered.has(i) ? 'w-3 bg-emerald-500/60' :
              'w-3 bg-[#1e2438]'
            }`}
          />
        ))}
      </div>

      {/* 3D Flip Card */}
      <div
        className="flashcard-container w-full"
        style={{ height: '240px' }}
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`flashcard-inner w-full h-full cursor-pointer ${flipped ? 'flashcard-flipped' : ''}`}
          style={{ height: '240px' }}
        >
          {/* Front — Question */}
          <div className="flashcard-front w-full h-full p-6 flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #1a1f2e 0%, #1e2438 100%)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '14px',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-purple-400">
                ❓ Question
              </span>
              <span className="text-[10px] text-slate-600 flex items-center gap-1">
                Tap to reveal <span className="text-purple-400">↩</span>
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-base md:text-lg font-semibold text-slate-100 leading-relaxed text-center px-2">
                {current.question}
              </p>
            </div>
            <div className="text-center text-[10px] text-slate-600 mt-3">
              Card {currentIndex + 1} of {cards.length}
            </div>
          </div>

          {/* Back — Answer */}
          <div className="flashcard-back w-full h-full p-6 flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #1a2235 0%, #1e2840 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '14px',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">
                💡 Answer
              </span>
              <span className="text-[10px] text-slate-600 flex items-center gap-1">
                Tap to flip back <span className="text-indigo-400">↩</span>
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <p className="text-sm text-slate-300 leading-relaxed">
                {current.answer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons (shown after flip) */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); handleRating('hard'); }}
            className="py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm font-semibold hover:bg-rose-500/20 transition active:scale-95"
          >
            😓 Hard — Review Again
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleRating('easy'); }}
            className="py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition active:scale-95"
          >
            ✅ Got It — Next Card
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            className="px-5 py-2.5 rounded-xl bg-[#1a1f2e] border border-[#242840] text-slate-400 hover:text-white hover:border-[#2d3560] text-xs font-semibold transition"
          >
            ← Prev
          </button>
          <button
            onClick={toggleMastered}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition ${
              isMastered
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[#1a1f2e] border-[#242840] text-slate-500 hover:text-slate-300'
            }`}
          >
            {isMastered ? '⭐ Mastered' : 'Mark as Mastered'}
          </button>
          <button
            onClick={goNext}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-lg shadow-purple-600/20"
          >
            Next →
          </button>
        </div>
      )}

      {/* Summary bar */}
      {masteredCount > 0 && (
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 text-xs text-center font-medium">
          🎉 {masteredCount} of {cards.length} cards mastered
          {masteredCount === cards.length ? ' — Deck complete! Great job!' : ''}
        </div>
      )}
    </div>
  );
}

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
  const [mastered, setMastered] = useState<number[]>([]);

  if (!cards || cards.length === 0) return null;

  const current = cards[currentIndex];
  const isMastered = mastered.includes(currentIndex);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const toggleMastered = () => {
    setMastered((prev) =>
      prev.includes(currentIndex) ? prev.filter((i) => i !== currentIndex) : [...prev, currentIndex]
    );
  };

  return (
    <div className="card p-6 md:p-8 space-y-5 border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-zinc-950">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-1">
            🃏 Flashcard Mode
          </div>
          <h3 className="text-xl font-bold text-zinc-100">Active Recall Cards</h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-zinc-400">Card {currentIndex + 1} of {cards.length}</span>
          <div className="text-[11px] text-purple-400 font-medium">
            {mastered.length} / {cards.length} Mastered
          </div>
        </div>
      </div>

      {/* 3D Flip Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="w-full min-h-[220px] p-6 rounded-2xl bg-zinc-900 border border-zinc-700/60 hover:border-purple-500/40 cursor-pointer flex flex-col justify-between transition-all select-none shadow-xl hover:shadow-purple-500/5 group"
      >
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="uppercase tracking-wider font-semibold text-[10px] text-zinc-400">
            {flipped ? '💡 Answer (Click to Flip Back)' : '❓ Question (Click to Reveal)'}
          </span>
          <span className="text-purple-400 text-xs group-hover:scale-110 transition">🔄 Flip</span>
        </div>

        <div className="py-6 my-auto text-center">
          {!flipped ? (
            <p className="text-base md:text-lg font-semibold text-zinc-100 leading-relaxed px-4">
              {current.question}
            </p>
          ) : (
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed px-4 text-left">
              {current.answer}
            </p>
          )}
        </div>

        <div className="text-center text-[11px] text-zinc-600">
          Click anywhere on this card to flip
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-semibold transition"
        >
          ← Previous
        </button>

        <button
          onClick={toggleMastered}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
            isMastered
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {isMastered ? '✓ Mastered' : 'Mark as Mastered'}
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

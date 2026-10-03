'use client';
import React, { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface InteractiveQuizProps {
  topicTitle: string;
  questions: QuizQuestion[];
}

export default function InteractiveQuiz({ topicTitle, questions }: InteractiveQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  if (!questions || questions.length === 0) return null;

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted[qIdx]) return; // locked after submission
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheck = (qIdx: number) => {
    if (selectedAnswers[qIdx] === undefined) return;
    setSubmitted(prev => ({ ...prev, [qIdx]: true }));
  };

  const totalAnswered = Object.keys(submitted).length;
  const correctCount = Object.entries(submitted).filter(([qIdx, isSub]) => {
    return isSub && selectedAnswers[Number(qIdx)] === questions[Number(qIdx)].correctIndex;
  }).length;

  return (
    <div className="card p-6 md:p-8 space-y-6 border-indigo-500/20 bg-gradient-to-b from-indigo-950/20 to-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-1">
            🧠 Active Recall
          </div>
          <h3 className="text-xl font-bold text-zinc-100">Knowledge Check: {topicTitle}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Test your retention of the core principles before moving on</p>
        </div>
        {totalAnswered > 0 && (
          <div className="text-right">
            <span className="text-sm font-bold text-indigo-400">{correctCount} / {questions.length} Correct</span>
            <div className="text-[11px] text-zinc-500">
              {correctCount === questions.length ? '🎉 Mastered!' : 'Keep practicing!'}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const isSubmitted = submitted[qIdx];
          const chosen = selectedAnswers[qIdx];
          const isCorrect = isSubmitted && chosen === q.correctIndex;

          return (
            <div key={qIdx} className="space-y-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
              <p className="font-semibold text-zinc-200 text-sm flex gap-2">
                <span className="text-indigo-400 shrink-0">Q{qIdx + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = "border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-700";
                  if (chosen === optIdx && !isSubmitted) {
                    btnStyle = "border-indigo-500/50 bg-indigo-500/10 text-indigo-300";
                  }
                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-medium";
                    } else if (chosen === optIdx) {
                      btnStyle = "border-rose-500/60 bg-rose-500/10 text-rose-300 line-through opacity-80";
                    } else {
                      btnStyle = "border-zinc-800/40 bg-zinc-950/40 text-zinc-600";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left p-3 rounded-lg text-xs md:text-sm border transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && optIdx === q.correctIndex && (
                        <span className="text-emerald-400 font-bold ml-2">✓</span>
                      )}
                      {isSubmitted && chosen === optIdx && optIdx !== q.correctIndex && (
                        <span className="text-rose-400 font-bold ml-2">✕</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {!isSubmitted ? (
                <button
                  disabled={chosen === undefined}
                  onClick={() => handleCheck(qIdx)}
                  className="mt-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition"
                >
                  Check Answer
                </button>
              ) : (
                <div className={`mt-3 p-3 rounded-lg text-xs leading-relaxed border ${
                  isCorrect 
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/5 border-rose-500/20 text-zinc-300"
                }`}>
                  <span className="font-semibold">{isCorrect ? '✅ Correct! ' : '💡 Explanation: '}</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

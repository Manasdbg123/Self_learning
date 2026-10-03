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
  const [showAll, setShowAll] = useState(false);

  if (!questions || questions.length === 0) return null;

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted[qIdx]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheck = (qIdx: number) => {
    if (selectedAnswers[qIdx] === undefined) return;
    setSubmitted((prev) => ({ ...prev, [qIdx]: true }));
  };

  const totalAnswered = Object.keys(submitted).length;
  const correctCount = Object.entries(submitted).filter(([qIdx, isSub]) =>
    isSub && selectedAnswers[Number(qIdx)] === questions[Number(qIdx)].correctIndex
  ).length;

  const allDone = totalAnswered === questions.length;
  const scorePercent = allDone ? Math.round((correctCount / questions.length) * 100) : 0;

  const scoreColor =
    scorePercent === 100 ? 'text-emerald-400' :
    scorePercent >= 67  ? 'text-indigo-400' :
    'text-rose-400';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            🧠 Knowledge Check
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-2">Quiz: {topicTitle}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Select an answer, then click "Check" to see if you're right</p>
        </div>
        {totalAnswered > 0 && (
          <div className="text-right shrink-0">
            <div className={`text-2xl font-extrabold ${scoreColor}`}>
              {correctCount}/{questions.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {allDone
                ? scorePercent === 100 ? '🎉 Perfect score!' : scorePercent >= 67 ? '👍 Good job!' : '💪 Keep practicing'
                : `${totalAnswered} answered`}
            </div>
          </div>
        )}
      </div>

      {/* Score bar (shown when answers start coming in) */}
      {totalAnswered > 0 && (
        <div className="h-2 bg-[#1e2438] rounded-full overflow-hidden border border-[#242840]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              scorePercent === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
              scorePercent >= 67  ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
              'bg-gradient-to-r from-rose-500 to-orange-500'
            }`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const isSubmitted = submitted[qIdx];
          const chosen = selectedAnswers[qIdx];
          const isCorrect = isSubmitted && chosen === q.correctIndex;

          return (
            <div
              key={qIdx}
              className={`rounded-2xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-rose-500/5 border-rose-500/20'
                  : 'bg-[#161b27] border-[#1e2438]'
              }`}
            >
              {/* Question header */}
              <div className="p-5 pb-3">
                <div className="flex gap-3 items-start">
                  <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isSubmitted
                      ? isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      : 'bg-indigo-500/15 text-indigo-400'
                  }`}>
                    {isSubmitted ? (isCorrect ? '✓' : '✗') : `Q${qIdx + 1}`}
                  </span>
                  <p className="font-semibold text-slate-200 text-sm leading-relaxed">{q.question}</p>
                </div>
              </div>

              {/* Options */}
              <div className="px-5 pb-4 space-y-2 pl-[52px]">
                {q.options.map((opt, optIdx) => {
                  let style = 'border-[#242840] bg-[#1a1f2e] text-slate-400 hover:border-indigo-500/40 hover:text-slate-200 cursor-pointer';
                  let icon = null;

                  if (chosen === optIdx && !isSubmitted) {
                    style = 'border-indigo-500/50 bg-indigo-500/12 text-indigo-300 cursor-pointer';
                  }
                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      style = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 cursor-default';
                      icon = <span className="text-emerald-400 font-bold ml-auto text-sm">✓</span>;
                    } else if (chosen === optIdx) {
                      style = 'border-rose-500/40 bg-rose-500/8 text-rose-400 line-through opacity-70 cursor-default';
                      icon = <span className="text-rose-400 font-bold ml-auto text-sm">✗</span>;
                    } else {
                      style = 'border-[#1e2438] bg-[#12151f] text-slate-600 cursor-default opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left p-3 rounded-xl text-xs md:text-sm border transition-all flex items-start gap-2 group ${style}`}
                    >
                      <span className={`shrink-0 w-5 h-5 rounded-md border text-[10px] font-bold flex items-center justify-center mt-0.5 ${
                        chosen === optIdx && !isSubmitted ? 'border-indigo-400 bg-indigo-500/20 text-indigo-400' :
                        isSubmitted && optIdx === q.correctIndex ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400' :
                        'border-[#2d3560] text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Check / Explanation */}
              <div className="px-5 pb-5 pl-[52px]">
                {!isSubmitted ? (
                  <button
                    disabled={chosen === undefined}
                    onClick={() => handleCheck(qIdx)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold transition shadow-md shadow-indigo-600/20"
                  >
                    Check Answer →
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                      : 'bg-[#1a1f2e] border-[#242840] text-slate-300'
                  }`}>
                    <span className="font-bold block mb-1">{isCorrect ? '✅ Correct!' : '💡 Explanation:'}</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* All done banner */}
      {allDone && (
        <div className={`p-5 rounded-2xl border text-center ${
          scorePercent === 100
            ? 'bg-emerald-500/8 border-emerald-500/25'
            : scorePercent >= 67
              ? 'bg-indigo-500/8 border-indigo-500/25'
              : 'bg-rose-500/8 border-rose-500/25'
        }`}>
          <div className="text-3xl mb-2">
            {scorePercent === 100 ? '🏆' : scorePercent >= 67 ? '🎯' : '📚'}
          </div>
          <div className={`text-lg font-extrabold mb-1 ${scoreColor}`}>
            {scorePercent}% Score
          </div>
          <p className="text-xs text-slate-400">
            {scorePercent === 100
              ? 'Perfect! You\'ve mastered this topic. Move on to the next one.'
              : scorePercent >= 67
                ? 'Good understanding! Review the wrong answers and try again.'
                : 'Keep studying — re-read the Deep Dive tab before retrying.'}
          </p>
        </div>
      )}
    </div>
  );
}

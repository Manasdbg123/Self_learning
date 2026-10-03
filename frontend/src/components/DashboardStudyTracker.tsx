'use client';
import React from 'react';
import Link from 'next/link';
import { useStudyProgress } from '@/lib/studyStore';
import { getAllTopics } from '@/lib/knowledge';

export default function DashboardStudyTracker() {
  const { completed, bookmarked, lastTopic, loaded } = useStudyProgress();
  const allTopics = getAllTopics();
  const totalTopics = allTopics.length;

  const completedCount = completed.length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalTopics || 1)) * 100));

  const resumeTopic = lastTopic ? allTopics.find((t) => t.id === lastTopic) : allTopics[0];

  if (!loaded) {
    return (
      <div className="card p-6 border-indigo-500/20 bg-gradient-to-r from-indigo-950/20 via-zinc-900 to-zinc-950 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-zinc-800/60 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="card p-6 md:p-8 border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-zinc-900 to-zinc-950 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Active Curriculum
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1">
              🔥 3-Day Study Streak
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Your Personal Engineering University
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
            Track your progress across 34+ planetary-scale system architectures, low-level design patterns, and distributed foundations.
          </p>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-300">{completedCount} of {totalTopics} Modules Mastered</span>
              <span className="text-indigo-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700/50">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(3, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Resume Card */}
        <div className="shrink-0 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl space-y-3 min-w-[240px]">
          <div className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">
            {lastTopic ? 'Resume Where You Left Off' : 'Recommended Next'}
          </div>
          <div>
            <div className="font-bold text-zinc-100 text-sm truncate max-w-[200px]">
              {resumeTopic?.title || 'System Design'}
            </div>
            <div className="text-xs text-indigo-400 font-medium">
              {resumeTopic?.difficulty} · {resumeTopic?.estimatedTime}
            </div>
          </div>

          <Link
            href={`/topics/${resumeTopic?.id || 'hld-netflix'}`}
            className="w-full block text-center py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/20"
          >
            Start Learning →
          </Link>
        </div>
      </div>
    </div>
  );
}

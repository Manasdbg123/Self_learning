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

  const milestones = [
    { pct: 25, label: 'Rookie' },
    { pct: 50, label: 'Engineer' },
    { pct: 75, label: 'Senior' },
    { pct: 100, label: 'Expert' },
  ];
  const currentMilestone = milestones.find(m => progressPercent < m.pct) || milestones[milestones.length - 1];

  if (!loaded) {
    return (
      <div className="topic-hero p-6 md:p-8">
        <div className="skeleton h-7 w-48 mb-3" />
        <div className="skeleton h-4 w-80 mb-6" />
        <div className="skeleton h-3 w-full rounded-full" />
      </div>
    );
  }

  return (
    <div className="topic-hero p-6 md:p-8">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Left: title + progress */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Curriculum
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              🔥 Study Streak Active
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              🏅 {currentMilestone.label} Level
            </span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight leading-snug">
              Your Engineering Study Path
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed max-w-xl">
              {completedCount === 0
                ? 'Start your journey — pick a topic and begin mastering system design & engineering concepts.'
                : `You've mastered ${completedCount} module${completedCount > 1 ? 's' : ''}. Keep the momentum going!`}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2 max-w-xl">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">{completedCount} / {totalTopics} Modules Completed</span>
              <span className="text-indigo-400">{progressPercent}%</span>
            </div>
            <div className="relative w-full h-3 bg-[#1e2438] rounded-full overflow-hidden border border-[#242840]">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${Math.max(2, progressPercent)}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg" />
              </div>
            </div>
            {/* Milestone markers */}
            <div className="flex justify-between text-[10px] text-slate-600">
              {milestones.map(m => (
                <span
                  key={m.pct}
                  className={progressPercent >= m.pct ? 'text-indigo-400 font-semibold' : ''}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: quick resume card */}
        <div className="shrink-0 w-full md:w-64 rounded-2xl bg-[#1a1f2e] border border-[#242840] p-5 space-y-4 shadow-xl">
          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
            {lastTopic ? '📌 Resume where you left off' : '🚀 Start here'}
          </div>
          <div>
            <div className="font-bold text-slate-100 text-sm leading-tight">
              {resumeTopic?.title || 'Netflix System Design'}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`badge badge-${(resumeTopic?.difficulty || 'advanced').toLowerCase()}`}>
                {resumeTopic?.difficulty || 'Advanced'}
              </span>
              <span className="text-xs text-slate-500">⏱ {resumeTopic?.estimatedTime || '45 min'}</span>
            </div>
          </div>
          <Link
            href={`/topics/${resumeTopic?.id || 'hld-netflix'}`}
            className="w-full block text-center py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/30 active:scale-95"
          >
            {lastTopic ? 'Continue Learning →' : 'Start Learning →'}
          </Link>
          {bookmarked.length > 0 && (
            <div className="text-[11px] text-slate-500 text-center">
              ⭐ {bookmarked.length} bookmarked topic{bookmarked.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

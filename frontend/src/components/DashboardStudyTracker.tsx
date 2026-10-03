'use client';
import React from 'react';
import Link from 'next/link';
import { useStudyProgress } from '@/lib/studyStore';
import { getAllTopics } from '@/lib/knowledge';

const MILESTONES = [
  { pct: 0,   label: 'Just Started',  color: '#64748b' },
  { pct: 20,  label: 'Learner',       color: '#6366f1' },
  { pct: 40,  label: 'Practitioner',  color: '#8b5cf6' },
  { pct: 60,  label: 'Engineer',      color: '#a855f7' },
  { pct: 80,  label: 'Senior Eng.',   color: '#ec4899' },
  { pct: 100, label: 'Expert 🏆',     color: '#f59e0b' },
];

export default function DashboardStudyTracker() {
  const { completed, bookmarked, lastTopic, loaded } = useStudyProgress();
  const allTopics = getAllTopics();
  const total = allTopics.length;
  const done  = completed.length;
  const pct   = Math.min(100, Math.round((done / (total || 1)) * 100));
  const resume = lastTopic ? allTopics.find(t => t.id === lastTopic) : allTopics[0];
  const milestone = [...MILESTONES].reverse().find(m => pct >= m.pct) || MILESTONES[0];

  if (!loaded) return (
    <div style={{ borderRadius: 20, border: '1px solid var(--border-accent)', background: 'var(--bg-surface)', padding: '28px 28px 24px' }}>
      <div className="skeleton" style={{ height: 28, width: '40%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 14, width: '65%', marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 10, width: '100%' }} />
    </div>
  );

  return (
    <div style={{
      borderRadius: 20,
      border: '1px solid var(--border-accent)',
      background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
      padding: '28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 240, height: 240,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>

        {/* Top row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20 }}>
          {/* Left: greeting + progress */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 99,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                color: '#34d399', fontSize: 12, fontWeight: 600,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }} />
                Active Curriculum
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', borderRadius: 99,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                color: '#fbbf24', fontSize: 12, fontWeight: 600,
              }}>🔥 Study Streak Active</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', borderRadius: 99,
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                color: 'var(--accent-light)', fontSize: 12, fontWeight: 600,
              }}>🏅 {milestone.label}</span>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 8 }}>
              Your Engineering Learning Path
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 460 }}>
              {done === 0
                ? 'Choose a topic below to begin. Each module includes explanations, flashcards, quizzes, and interview prep.'
                : `${done} of ${total} modules completed. Keep going — you're building real-world engineering knowledge!`}
            </p>
          </div>

          {/* Right: resume card */}
          <div style={{
            flexShrink: 0, minWidth: 220, maxWidth: 260,
            background: 'var(--bg-base)', border: '1px solid var(--border-strong)',
            borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              {lastTopic ? '📌 Resume where you left off' : '🚀 Start here'}
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                {resume?.title || 'Netflix System Design'}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                <span className={`badge badge-${(resume?.difficulty || 'advanced').toLowerCase()}`}>
                  {resume?.difficulty || 'Advanced'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⏱ {resume?.estimatedTime || '45 min'}</span>
              </div>
            </div>
            <Link
              href={`/topics/${resume?.id || 'hld-netflix'}`}
              style={{
                display: 'block', textAlign: 'center',
                padding: '9px 16px', borderRadius: 10,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', fontWeight: 700, fontSize: 13,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {lastTopic ? 'Continue →' : 'Start Learning →'}
            </Link>
            {bookmarked.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                ⭐ {bookmarked.length} bookmarked
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 12, fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{done} / {total} modules completed</span>
            <span style={{ color: milestone.color }}>{pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.max(1, pct)}%` }} />
          </div>
          {/* Milestone markers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {MILESTONES.filter(m => m.pct > 0).map(m => (
              <span key={m.pct} style={{
                fontSize: 10, fontWeight: 600,
                color: pct >= m.pct ? m.color : 'var(--text-muted)',
                transition: 'color 0.3s',
              }}>
                {m.pct}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

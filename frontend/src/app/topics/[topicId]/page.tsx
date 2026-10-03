'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { topicsDb, Topic, getAllTopics } from '@/lib/knowledge';
import { useStudyProgress } from '@/lib/studyStore';
import InteractiveQuiz from '@/components/InteractiveQuiz';
import FlashcardDeck from '@/components/FlashcardDeck';
import CodeSnippetViewer from '@/components/CodeSnippetViewer';
import StudyNotesPad from '@/components/StudyNotesPad';

const TABS = [
  { id: 'overview',    label: 'Overview',       icon: '📌' },
  { id: 'deep-dive',   label: 'Deep Dive',      icon: '🔬' },
  { id: 'architecture',label: 'Architecture',   icon: '🏛️' },
  { id: 'code',        label: 'Code',           icon: '💻' },
  { id: 'practice',    label: 'Practice',       icon: '🧠' },
  { id: 'interview',   label: 'Interview Q&A',  icon: '🎯' },
  { id: 'resources',   label: 'Resources',      icon: '📚' },
];

const DIFF_CLASS: Record<string, string> = {
  Beginner: 'badge-beginner', Intermediate: 'badge-intermediate',
  Advanced: 'badge-advanced', Expert: 'badge-expert',
};

function MarkdownContent({ content }: { content: string }) {
  if (!content) return null;
  const html = content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '<br/><br/>');
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />;
}

function InfoBlock({ icon, label, content, accent }: { icon: string; label: string; content: string; accent?: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 22px', borderLeft: `3px solid ${accent || 'var(--accent)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: accent || 'var(--accent-light)' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
        {content}
      </div>
    </div>
  );
}

function BulletList({ icon, label, items, accent }: { icon: string; label: string; items: string[]; accent: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: `1px solid ${accent}35`,
      borderRadius: 14, padding: '18px 22px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: accent }}>
          {label}
        </span>
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <span style={{ color: accent, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
              {icon === '✅' ? '+' : '−'}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);
  const topic: Topic | undefined = topicsDb[topicId];
  const allTopics = getAllTopics();

  const { isCompleted, isBookmarked, toggleCompleted, toggleBookmarked, recordVisit } = useStudyProgress();

  useEffect(() => {
    if (topicId) recordVisit(topicId);
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScrollProgress((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [topicId]);

  if (!topic) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Topic not found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>This module isn't in the curriculum yet.</p>
      <Link href="/" style={{
        padding: '10px 24px', background: 'var(--accent)', color: '#fff',
        borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
      }}>← Back to Dashboard</Link>
    </div>
  );

  const completed = isCompleted(topic.id);
  const bookmarked = isBookmarked(topic.id);
  const idx = allTopics.findIndex(t => t.id === topic.id);
  const prev = idx > 0 ? allTopics[idx - 1] : null;
  const next = idx < allTopics.length - 1 ? allTopics[idx + 1] : null;

  const quizQuestions = [
    {
      question: `What is the core engineering goal of ${topic.title.replace(/^System \d+:\s*/, '')}?`,
      options: [
        topic.what.split('.')[0] + '.',
        'To eliminate the need for horizontal network scaling.',
        'To replace memory caches with synchronous database locks.',
        'To enforce single-threaded batch file processing.',
      ],
      correctIndex: 0,
      explanation: topic.what.slice(0, 220) + '...',
    },
    {
      question: 'When is it recommended NOT to use this architectural pattern?',
      options: [
        'When building large distributed multi-region systems.',
        (topic.whenNotToUse.slice(0, 140) + '...'),
        'When low latency is a key business priority.',
        'When scaling reads independently of writes.',
      ],
      correctIndex: 1,
      explanation: topic.whenNotToUse,
    },
    {
      question: 'What is a common operational mistake when deploying this system?',
      options: [
        topic.commonMistakes?.[0] || 'Failing to implement proper monitoring and rate limits.',
        'Using caching in front of high-traffic database queries.',
        'Profiling application throughput with load testing tools.',
        'Configuring automated health checks at the load balancer.',
      ],
      correctIndex: 0,
      explanation: topic.commonMistakes?.[0] || 'Anticipate failure modes early.',
    },
  ];

  const flashcards = topic.interviewQuestions?.map(iq => ({ question: iq.q, answer: iq.a })) || [
    { question: `What is the core concept of ${topic.title}?`, answer: topic.what },
    { question: 'What is the key trade-off?', answer: topic.tradeoffs },
  ];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: 80, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Reading progress */}
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>Home</Link>
        <span>/</span>
        <Link href={`/subjects/${topic.subject.toLowerCase().replace(/ /g, '-')}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          {topic.subject}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{topic.category}</span>
      </div>

      {/* ── Hero Header ── */}
      <div className="topic-hero">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
          {/* Badges row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span className={`badge ${DIFF_CLASS[topic.difficulty] || 'badge-advanced'}`}>{topic.difficulty}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>⏱ {topic.estimatedTime}</span>
            {completed && <span className="badge badge-beginner">✓ Mastered</span>}
          </div>

          {/* Title + actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: 'clamp(20px,4vw,32px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, flex: 1, minWidth: 200 }}>
              {topic.title}
            </h1>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center' }}>
              <button
                onClick={() => toggleBookmarked(topic.id)}
                style={{
                  padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', border: '1px solid',
                  borderColor: bookmarked ? 'rgba(245,158,11,0.4)' : 'var(--border)',
                  background: bookmarked ? 'rgba(245,158,11,0.1)' : 'var(--bg-elevated)',
                  color: bookmarked ? '#fbbf24' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
                }}
              >
                <span>{bookmarked ? '⭐' : '☆'}</span>
                <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
              <button
                onClick={() => toggleCompleted(topic.id)}
                style={{
                  padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', border: 'none',
                  background: completed
                    ? 'linear-gradient(135deg,#10b981,#059669)'
                    : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: completed ? '0 4px 14px rgba(16,185,129,0.35)' : '0 4px 14px rgba(99,102,241,0.35)',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <span>{completed ? '✓' : '○'}</span>
                <span>{completed ? 'Mastered!' : 'Mark Complete'}</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {topic.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 99,
                background: 'var(--bg-muted)', border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}>#{tag}</span>
            ))}
          </div>

          {/* 60-sec summary */}
          <div className="callout callout-summary">
            <span className="callout-icon">⚡</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
                60-Second Summary
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.7 }}>{topic.what.slice(0, 260)}...</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Study Tabs ── */}
      <div className="study-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          TAB CONTENT
          ══════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-up">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InfoBlock icon="📌" label="What is it?" content={topic.what} />
            <InfoBlock icon="💡" label="Why do we need it?" content={topic.why} accent="#10b981" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
              <BulletList icon="✅" label="Advantages" items={topic.advantages} accent="#10b981" />
              <BulletList icon="⚠️" label="Disadvantages" items={topic.disadvantages} accent="#ef4444" />
            </div>

            <div className="callout callout-tradeoff">
              <span className="callout-icon">⚖️</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                  Architectural Trade-offs
                </div>
                <div style={{ fontSize: 13.5, lineHeight: 1.75, whiteSpace: 'pre-line' }}>{topic.tradeoffs}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
              <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#10b981', marginBottom: 10 }}>
                  🎯 When to Use
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{topic.whenToUse}</p>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#ef4444', marginBottom: 10 }}>
                  🚫 When NOT to Use
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{topic.whenNotToUse}</p>
              </div>
            </div>

            {topic.commonMistakes?.length > 0 && (
              <div className="callout callout-warning">
                <span className="callout-icon">⚠️</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    Common Pitfalls
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {topic.commonMistakes.map((m, i) => (
                      <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, lineHeight: 1.65 }}>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {topic.realWorld && (
              <InfoBlock icon="🌍" label="Real-World Deployment" content={topic.realWorld} accent="#6366f1" />
            )}
          </div>
        )}

        {/* DEEP DIVE */}
        {activeTab === 'deep-dive' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                🔬 How It Works: Step-by-Step
              </h2>
              <MarkdownContent content={topic.how} />
            </div>
            {topic.internals && (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⚙️ Internal Mechanics & Math
                </h2>
                <MarkdownContent content={topic.internals} />
              </div>
            )}
          </div>
        )}

        {/* ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div>
            {topic.architecture ? (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>System Architecture Blueprint</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>Component topology, data flow, cache layers and scaling approach</p>
                <CodeSnippetViewer code={topic.architecture} language="text" title="SYSTEM ARCHITECTURE DIAGRAM" />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
                <h3 style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 8 }}>Programmatic Topic</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>This topic focuses on code-level design. Architecture diagrams are in the HLD section.</p>
              </div>
            )}
          </div>
        )}

        {/* CODE */}
        {activeTab === 'code' && (
          <div>
            {topic.codeExample ? (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Production Implementation</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>Thread-safe OOP implementation with design patterns applied</p>
                <CodeSnippetViewer code={topic.codeExample} language="java" title="JAVA IMPLEMENTATION" />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>💻</div>
                <h3 style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 8 }}>Conceptual Topic</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>This is an architectural blueprint topic. Working code is in the LLD problems section.</p>
              </div>
            )}
          </div>
        )}

        {/* PRACTICE */}
        {activeTab === 'practice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <FlashcardDeck cards={flashcards} />
            <InteractiveQuiz topicTitle={topic.title} questions={quizQuestions} />
          </div>
        )}

        {/* INTERVIEW Q&A */}
        {activeTab === 'interview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="callout callout-summary" style={{ marginBottom: 6 }}>
              <span className="callout-icon">🎯</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Staff & Senior Engineer Perspectives</div>
                <p style={{ fontSize: 13, lineHeight: 1.65 }}>Questions asked by FAANG/top companies to evaluate architectural depth and real-world experience.</p>
              </div>
            </div>

            {topic.interviewQuestions?.map((iq, i) => (
              <details key={i} className="qa-card">
                <summary>
                  <span style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(99,102,241,0.12)', color: 'var(--accent-light)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                  }}>Q{i+1}</span>
                  <span style={{ flex: 1 }}>{iq.q}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, flexShrink: 0 }}>▼</span>
                </summary>
                <div className="qa-answer">{iq.a}</div>
              </details>
            ))}
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === 'resources' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Curated Resources</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
              {topic.resources?.map((r, i) => {
                const typeIcon = { video: '▶', article: '📄', docs: '📚', book: '📖' }[r.type] || '🔗';
                const typeColor = { video: '#ef4444', article: '#3b82f6', docs: '#10b981', book: '#f59e0b' }[r.type] || '#6366f1';
                return (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="card-hover" style={{
                    padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start', color: 'inherit', textDecoration: 'none',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: `${typeColor}15`, border: `1px solid ${typeColor}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>{typeIcon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 4 }}>{r.title}</div>
                      {r.author && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>by {r.author}</div>}
                      <span style={{
                        display: 'inline-block', marginTop: 6, fontSize: 10, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.05em', padding: '2px 8px',
                        borderRadius: 5, background: `${typeColor}15`, color: typeColor,
                      }}>{r.type}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 14, flexShrink: 0 }}>↗</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Study Notes ── */}
      <StudyNotesPad topicId={topic.id} />

      {/* ── Prev / Next Navigation ── */}
      <div className="topic-nav">
        {prev ? (
          <Link href={`/topics/${prev.id}`} className="card-hover" style={{ padding: '14px 18px', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20, color: 'var(--text-muted)' }}>←</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 4 }}>Previous</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {prev.title}
              </div>
            </div>
          </Link>
        ) : <div />}

        {next ? (
          <Link href={`/topics/${next.id}`} className="card-hover" style={{ padding: '14px 18px', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 4 }}>Next</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {next.title}
              </div>
            </div>
            <span style={{ fontSize: 20, color: 'var(--text-muted)' }}>→</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}

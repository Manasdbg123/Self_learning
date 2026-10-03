'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { topicsDb, Topic, getAllTopics } from '@/lib/knowledge';
import { useStudyProgress } from '@/lib/studyStore';
import InteractiveQuiz from '@/components/InteractiveQuiz';
import FlashcardDeck from '@/components/FlashcardDeck';
import CodeSnippetViewer from '@/components/CodeSnippetViewer';
import StudyNotesPad from '@/components/StudyNotesPad';

const TABS = ['Overview', 'Deep Dive', 'Architecture', 'Code & Patterns', 'Practice & Quiz', 'Interview Q&A', 'Resources'];

const difficultyBadge: Record<string, string> = {
  Beginner: 'badge-beginner',
  Intermediate: 'badge-intermediate',
  Advanced: 'badge-advanced',
  Expert: 'badge-expert',
};

function MarkdownContent({ content }: { content: string }) {
  if (!content) return null;
  const formatted = content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="block">$2</code></pre>')
    .replace(/```([\s\S]*?)```/g, '<pre><code class="block">$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>• $1</li>')
    .replace(/\n\n/g, '<br/><br/>');

  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: formatted }} />;
}

export default function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);
  const [activeTab, setActiveTab] = useState('Overview');
  const [scrollProgress, setScrollProgress] = useState(0);
  const topic: Topic | undefined = topicsDb[topicId];
  const allTopics = getAllTopics();

  const { isCompleted, isBookmarked, toggleCompleted, toggleBookmarked, recordVisit } = useStudyProgress();

  useEffect(() => {
    if (topicId) recordVisit(topicId);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [topicId]);

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Topic not found</h2>
        <p className="text-zinc-500 mb-6 text-sm">This module is not currently available in the engineering curriculum.</p>
        <Link href="/" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition text-sm font-semibold shadow-lg shadow-indigo-500/20">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const completed = isCompleted(topic.id);
  const bookmarked = isBookmarked(topic.id);

  // Find previous and next topics in same category or overall
  const currentIndex = allTopics.findIndex(t => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  // Generate dynamic quiz questions from topic data
  const quizQuestions = [
    {
      question: `What is the primary architectural purpose of ${topic.title.replace(/^System \d+:\s*/, '')}?`,
      options: [
        topic.what.split('.')[0] + '.',
        'To reduce disk storage without caching.',
        'To replace standard relational schemas with XML files.',
        'To ensure synchronous locking across multi-cloud regions.'
      ].sort(() => 0.5 - Math.random()),
      correctIndex: 0,
      explanation: topic.what.slice(0, 180) + '...'
    },
    {
      question: `When should engineers NOT use this system or design pattern?`,
      options: [
        topic.whenNotToUse.slice(0, 120),
        'When low latency is strictly required.',
        'When high throughput is necessary.',
        'When deploying to cloud environments.'
      ].sort(() => 0.5 - Math.random()),
      correctIndex: 0,
      explanation: topic.whenNotToUse
    },
    {
      question: `Which architectural trade-off is central to this design?`,
      options: [
        topic.tradeoffs.slice(0, 120),
        'Memory usage is completely decoupled from read latency.',
        'CP systems guarantee 100% availability during network splits.',
        'Horizontal scaling eliminates network communication cost.'
      ].sort(() => 0.5 - Math.random()),
      correctIndex: 0,
      explanation: topic.tradeoffs.slice(0, 200) + '...'
    }
  ];

  // Adjust correct indices after random sort
  const normalizedQuiz = [
    {
      question: `What is the core engineering goal of ${topic.title.replace(/^System \d+:\s*/, '')}?`,
      options: [
        topic.what.split('.')[0] + '.',
        'To eliminate the need for horizontal network scaling.',
        'To replace memory caches with synchronous relational database locks.',
        'To enforce single-threaded batch file processing.'
      ],
      correctIndex: 0,
      explanation: topic.what.slice(0, 220) + '...'
    },
    {
      question: `When is it recommended NOT to use this architectural pattern?`,
      options: [
        'When building large distributed multi-region systems.',
        topic.whenNotToUse.slice(0, 140) + '...',
        'When low latency is a key business priority.',
        'When scaling reads independently of writes.'
      ],
      correctIndex: 1,
      explanation: topic.whenNotToUse
    },
    {
      question: `What is a common operational mistake when deploying this system?`,
      options: [
        topic.commonMistakes?.[0] || 'Failing to implement proper monitoring and rate limits.',
        'Using caching in front of high-traffic database queries.',
        'Profiling application throughput with load testing tools.',
        'Configuring automated health checks at the load balancer.'
      ],
      correctIndex: 0,
      explanation: topic.commonMistakes?.[0] || 'Failing to anticipate failure modes.'
    }
  ];

  // Format flashcards from interview questions
  const flashcards = topic.interviewQuestions?.map(iq => ({
    question: iq.q,
    answer: iq.a
  })) || [
    { question: `What is the core concept behind ${topic.title}?`, answer: topic.what },
    { question: `What is the key trade-off?`, answer: topic.tradeoffs }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Scroll Reading Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <Link href="/" className="hover:text-zinc-300 transition">Home</Link>
          <span>/</span>
          <Link href={`/subjects/${topic.subject.toLowerCase().replace(/ /g, '-')}`} className="hover:text-zinc-300 transition">{topic.subject}</Link>
          <span>/</span>
          <span className="text-zinc-400 font-medium truncate">{topic.category}</span>
        </div>

        <div className="text-[11px] text-zinc-500 hidden sm:block">
          Interactive Study Mode
        </div>
      </div>

      {/* Header Card */}
      <div className="card p-6 md:p-8 space-y-4 bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950 border-zinc-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between relative z-10">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${difficultyBadge[topic.difficulty] || 'badge-advanced'}`}>{topic.difficulty}</span>
              <span className="text-zinc-400 text-xs flex items-center gap-1 font-mono">⏱ {topic.estimatedTime} study</span>
              {completed && (
                <span className="badge badge-beginner">✓ Completed</span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-zinc-100 tracking-tight leading-tight">
              {topic.title}
            </h1>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {topic.tags.map((tag) => (
                <span key={tag} className="text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Study Controls */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
            <button
              onClick={() => toggleBookmarked(topic.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-sm ${
                bookmarked
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              title={bookmarked ? 'Bookmarked' : 'Add to bookmarks'}
            >
              <span>{bookmarked ? '⭐' : '☆'}</span>
              <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button
              onClick={() => toggleCompleted(topic.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                completed
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              <span>{completed ? '✓' : '○'}</span>
              <span>{completed ? 'Mastered!' : 'Mark Completed'}</span>
            </button>
          </div>
        </div>

        {/* 60-Second Executive Summary Callout */}
        <div className="callout callout-summary mt-4 flex items-start gap-3">
          <span className="text-lg shrink-0 mt-0.5">⚡</span>
          <div>
            <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider mb-1">60-Second Executive Summary</h4>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
              {topic.what.slice(0, 260)}...
            </p>
          </div>
        </div>
      </div>

      {/* Study Navigation Tabs */}
      <div className="flex gap-1.5 p-1 bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn whitespace-nowrap text-xs md:text-sm py-2 px-3.5 rounded-lg ${
              activeTab === tab ? 'active' : ''
            }`}
          >
            {tab === 'Overview' && '📌 '}
            {tab === 'Deep Dive' && '🔬 '}
            {tab === 'Architecture' && '🏛️ '}
            {tab === 'Code & Patterns' && '💻 '}
            {tab === 'Practice & Quiz' && '🧠 '}
            {tab === 'Interview Q&A' && '🎯 '}
            {tab === 'Resources' && '📚 '}
            {tab}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="space-y-6 pt-2">
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <section className="card p-6 md:p-7 space-y-3">
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-indigo-400">📌</span> What is it?
              </h2>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {topic.what}
              </div>
            </section>

            <section className="card p-6 md:p-7 space-y-3">
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-emerald-400">💡</span> Why do we need it?
              </h2>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {topic.why}
              </div>
            </section>

            {/* Pros & Cons Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="card p-6 border-emerald-500/20 bg-emerald-950/10 space-y-3">
                <h3 className="font-bold text-emerald-400 text-sm md:text-base flex items-center gap-1.5">
                  <span>✅</span> Core Advantages
                </h3>
                <ul className="space-y-2">
                  {topic.advantages.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-zinc-300">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">+</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="card p-6 border-rose-500/20 bg-rose-950/10 space-y-3">
                <h3 className="font-bold text-rose-400 text-sm md:text-base flex items-center gap-1.5">
                  <span>⚠️</span> Disadvantages & Constraints
                </h3>
                <ul className="space-y-2">
                  {topic.disadvantages.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-zinc-300">
                      <span className="text-rose-500 font-bold shrink-0 mt-0.5">-</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Trade-offs */}
            <div className="callout callout-tradeoff space-y-2">
              <h3 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                <span>⚖️</span> Architectural Trade-offs
              </h3>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {topic.tradeoffs}
              </p>
            </div>

            {/* When to Use vs Not Use */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <span>🎯</span> When to Use
                </h4>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">{topic.whenToUse}</p>
              </div>

              <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <span>🚫</span> When NOT to Use
                </h4>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">{topic.whenNotToUse}</p>
              </div>
            </div>

            {/* Common Mistakes */}
            {topic.commonMistakes && topic.commonMistakes.length > 0 && (
              <div className="callout callout-warning space-y-2">
                <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span>⚠️</span> Common Pitfalls & Mistakes
                </h3>
                <ul className="space-y-1.5 pt-1">
                  {topic.commonMistakes.map((m, i) => (
                    <li key={i} className="text-xs md:text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Real World Usage */}
            {topic.realWorld && (
              <section className="card p-6 space-y-2 border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <span>🌍</span> Real-World Industry Deployment
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                  {topic.realWorld}
                </p>
              </section>
            )}
          </div>
        )}

        {/* DEEP DIVE TAB */}
        {activeTab === 'Deep Dive' && (
          <div className="space-y-6">
            <section className="card p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <span>🔬</span> How It Works: Step-by-Step Execution
              </h2>
              <MarkdownContent content={topic.how} />

              {topic.internals && (
                <>
                  <div className="my-6 border-t border-zinc-800/80" />
                  <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <span>⚙️</span> Deep Dive Internals & Math
                  </h2>
                  <MarkdownContent content={topic.internals} />
                </>
              )}
            </section>
          </div>
        )}

        {/* ARCHITECTURE TAB */}
        {activeTab === 'Architecture' && (
          <div className="space-y-6">
            {topic.architecture ? (
              <section className="card p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100">System Architecture Blueprint</h2>
                    <p className="text-xs text-zinc-400 mt-1">Component topology, network ingress, cache layer, and persistence flow</p>
                  </div>
                </div>

                <CodeSnippetViewer
                  code={topic.architecture}
                  language="text"
                  title="SYSTEM ARCHITECTURE DIAGRAM"
                />
              </section>
            ) : (
              <div className="card p-12 text-center text-zinc-500">
                <div className="text-4xl mb-3">🏛️</div>
                <h3 className="text-lg font-semibold text-zinc-300">Architecture Diagram</h3>
                <p className="text-xs text-zinc-500 mt-1">This topic focuses on programmatic and low-level object modeling.</p>
              </div>
            )}
          </div>
        )}

        {/* CODE & PATTERNS TAB */}
        {activeTab === 'Code & Patterns' && (
          <div className="space-y-6">
            {topic.codeExample ? (
              <section className="card p-6 md:p-8 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">Production Code Implementation</h2>
                  <p className="text-xs text-zinc-400 mt-1">Thread-safe, object-oriented implementation with applied design patterns</p>
                </div>

                <CodeSnippetViewer
                  code={topic.codeExample}
                  language="java"
                  title="JAVA / OOP SOLUTION"
                />
              </section>
            ) : (
              <div className="card p-12 text-center text-zinc-500">
                <div className="text-4xl mb-3">💻</div>
                <h3 className="text-lg font-semibold text-zinc-300">Conceptual Topic</h3>
                <p className="text-xs text-zinc-500 mt-1">This module is an architectural high-level blueprint. Code implementations are available in the LLD problems.</p>
              </div>
            )}
          </div>
        )}

        {/* PRACTICE & QUIZ TAB (ACTIVE RECALL) */}
        {activeTab === 'Practice & Quiz' && (
          <div className="space-y-8">
            {/* Interactive Flashcard Mode */}
            <FlashcardDeck cards={flashcards} />

            {/* Self-Grading Quiz */}
            <InteractiveQuiz topicTitle={topic.title} questions={normalizedQuiz} />
          </div>
        )}

        {/* INTERVIEW Q&A TAB */}
        {activeTab === 'Interview Q&A' && (
          <div className="space-y-4">
            <div className="callout callout-summary">
              <h3 className="font-bold text-indigo-300 text-sm">🎯 Staff & Senior Interview Perspectives</h3>
              <p className="text-xs text-zinc-400 mt-1">Questions commonly asked by FAANG / tier-1 companies to evaluate architectural depth.</p>
            </div>

            {topic.interviewQuestions?.map((iq, i) => (
              <details key={i} className="card p-5 group open:bg-zinc-900/90 transition-all cursor-pointer">
                <summary className="font-semibold text-zinc-200 text-sm md:text-base flex items-center gap-3 select-none">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                    Q{i + 1}
                  </span>
                  <span className="flex-1">{iq.q}</span>
                  <span className="text-zinc-500 text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-zinc-800/80 text-zinc-300 text-xs md:text-sm leading-relaxed pl-9">
                  {iq.a}
                </div>
              </details>
            ))}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'Resources' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-100">Curated Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topic.resources?.map((r, i) => {
                const typeIcon = { video: '▶', article: '📄', docs: '📚', book: '📖' }[r.type] || '🔗';
                return (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card p-5 flex items-start gap-4 hover:border-indigo-500/40 transition group"
                  >
                    <span className="text-2xl mt-0.5">{typeIcon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-zinc-200 text-sm group-hover:text-indigo-300 transition truncate">
                        {r.title}
                      </div>
                      {r.author && <div className="text-zinc-500 text-xs mt-0.5">by {r.author}</div>}
                      <span className="text-[10px] uppercase font-bold text-zinc-500 mt-2 block tracking-wider">
                        {r.type}
                      </span>
                    </div>
                    <span className="text-zinc-600 group-hover:text-zinc-400 transition text-sm">↗</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Personal Study Notepad (Persistent across visits) */}
      <StudyNotesPad topicId={topic.id} />

      {/* Curriculum Navigation (Previous / Next) */}
      <div className="border-t border-zinc-800/80 pt-8 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevTopic ? (
          <Link
            href={`/topics/${prevTopic.id}`}
            className="card p-4 hover:border-zinc-700 transition flex items-center gap-3 group text-left"
          >
            <span className="text-lg text-zinc-500 group-hover:text-white transition">←</span>
            <div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Previous Module</div>
              <div className="text-xs md:text-sm font-semibold text-zinc-200 group-hover:text-indigo-400 transition truncate max-w-[260px]">
                {prevTopic.title}
              </div>
            </div>
          </Link>
        ) : <div />}

        {nextTopic ? (
          <Link
            href={`/topics/${nextTopic.id}`}
            className="card p-4 hover:border-zinc-700 transition flex items-center justify-between group text-right sm:ml-auto w-full"
          >
            <div className="text-right w-full">
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Next Module</div>
              <div className="text-xs md:text-sm font-semibold text-zinc-200 group-hover:text-indigo-400 transition truncate">
                {nextTopic.title}
              </div>
            </div>
            <span className="text-lg text-zinc-500 group-hover:text-white transition ml-3">→</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}

'use client';
import React, { useState, use } from 'react';
import Link from 'next/link';
import { topicsDb, Topic } from '@/lib/knowledge';

const TABS = ['Overview', 'Deep Dive', 'Architecture', 'Code', 'Interview', 'Resources', 'Related'];

const difficultyBadge: Record<string, string> = {
  Beginner: 'badge-beginner',
  Intermediate: 'badge-intermediate',
  Advanced: 'badge-advanced',
  Expert: 'badge-expert',
};

function MarkdownContent({ content }: { content: string }) {
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
  const topic: Topic | undefined = topicsDb[topicId];

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-semibold text-zinc-300 mb-2">Topic not found</h2>
        <p className="text-zinc-500 mb-6">This topic is not yet available in the knowledge base.</p>
        <Link href="/" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-0 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-5">
        <Link href="/" className="hover:text-zinc-300">Home</Link>
        <span>/</span>
        <Link href={`/subjects/${topic.subject.toLowerCase().replace(/ /g, '-')}`} className="hover:text-zinc-300">{topic.subject}</Link>
        <span>/</span>
        <span className="text-zinc-300">{topic.title}</span>
      </div>

      {/* Header */}
      <div className="pb-6 border-b border-zinc-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-zinc-100 tracking-tight mb-3">{topic.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${difficultyBadge[topic.difficulty]}`}>{topic.difficulty}</span>
              <span className="text-zinc-600 text-xs">⏱ {topic.estimatedTime}</span>
              {topic.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:border-zinc-600 transition">🔖 Bookmark</button>
            <button className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition">✓ Complete</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 pt-4 pb-0 overflow-x-auto border-b border-zinc-800">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn whitespace-nowrap ${activeTab === tab ? 'active' : ''}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pt-6 space-y-6">
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2"><span className="text-indigo-400">📌</span> What is it?</h2>
              <div className="text-zinc-400 leading-relaxed whitespace-pre-line text-sm">{topic.what}</div>
            </section>
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2"><span className="text-green-400">💡</span> Why do we need it?</h2>
              <div className="text-zinc-400 leading-relaxed whitespace-pre-line text-sm">{topic.why}</div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="card p-6">
                <h2 className="text-lg font-semibold text-zinc-200 mb-3">✅ Advantages</h2>
                <ul className="space-y-2">{topic.advantages.map((a, i) => <li key={i} className="flex gap-2 text-sm text-zinc-400"><span className="text-green-500 mt-0.5 shrink-0">+</span>{a}</li>)}</ul>
              </section>
              <section className="card p-6">
                <h2 className="text-lg font-semibold text-zinc-200 mb-3">⚠️ Disadvantages</h2>
                <ul className="space-y-2">{topic.disadvantages.map((d, i) => <li key={i} className="flex gap-2 text-sm text-zinc-400"><span className="text-red-500 mt-0.5 shrink-0">-</span>{d}</li>)}</ul>
              </section>
            </div>
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-zinc-200 mb-3">⚖️ Trade-offs</h2>
              <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{topic.tradeoffs}</div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="card p-6 border-green-500/10 bg-green-500/5">
                <h2 className="text-sm font-semibold text-green-400 mb-2">✅ When to Use</h2>
                <p className="text-zinc-400 text-sm">{topic.whenToUse}</p>
              </section>
              <section className="card p-6 border-red-500/10 bg-red-500/5">
                <h2 className="text-sm font-semibold text-red-400 mb-2">❌ When NOT to Use</h2>
                <p className="text-zinc-400 text-sm">{topic.whenNotToUse}</p>
              </section>
            </div>
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-zinc-200 mb-3">🚫 Common Mistakes</h2>
              <ul className="space-y-2">{topic.commonMistakes.map((m, i) => <li key={i} className="flex gap-2 text-sm text-zinc-400"><span className="text-orange-500 mt-0.5 shrink-0">•</span>{m}</li>)}</ul>
            </section>
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-zinc-200 mb-3">🌍 Real World Usage</h2>
              <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{topic.realWorld}</div>
            </section>
          </div>
        )}

        {activeTab === 'Deep Dive' && (
          <section className="card p-6">
            <h2 className="text-lg font-semibold text-zinc-200 mb-4">How Does It Work?</h2>
            <MarkdownContent content={topic.how} />
            {topic.internals && (
              <>
                <h2 className="text-lg font-semibold text-zinc-200 mt-8 mb-4">Internals</h2>
                <MarkdownContent content={topic.internals} />
              </>
            )}
          </section>
        )}

        {activeTab === 'Architecture' && (
          <section className="space-y-6">
            {topic.architecture ? (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-zinc-200 mb-4">Architecture Diagram</h2>
                <pre className="text-green-400 text-sm leading-relaxed overflow-x-auto">{topic.architecture}</pre>
              </div>
            ) : (
              <div className="card p-12 text-center text-zinc-600">Architecture diagram coming soon for this topic</div>
            )}
          </section>
        )}

        {activeTab === 'Code' && (
          <section className="card p-6">
            <h2 className="text-lg font-semibold text-zinc-200 mb-4">Code Examples</h2>
            <MarkdownContent content={topic.codeExample ? `\`\`\`java\n${topic.codeExample}\n\`\`\`` : (topic.example ?? '*No code example available yet.*')} />
          </section>
        )}

        {activeTab === 'Interview' && (
          <div className="space-y-4">
            <div className="card p-5 bg-yellow-500/5 border-yellow-500/20">
              <h2 className="text-lg font-semibold text-zinc-200 mb-1">🎯 Interview Perspective</h2>
              <p className="text-zinc-500 text-sm">Common questions interviewers ask about {topic.title}</p>
            </div>
            {topic.interviewQuestions.map((iq, i) => (
              <details key={i} className="card p-5 group">
                <summary className="cursor-pointer font-medium text-zinc-200 flex items-center gap-2">
                  <span className="text-indigo-400 font-bold text-sm shrink-0">Q{i + 1}</span>
                  {iq.q}
                  <span className="ml-auto text-zinc-600 text-xs">▼</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-zinc-800 text-zinc-400 text-sm leading-relaxed">{iq.a}</div>
              </details>
            ))}
          </div>
        )}

        {activeTab === 'Resources' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">Learning Resources</h2>
            {topic.resources.map((r, i) => {
              const typeIcon = { video: '▶', article: '📄', docs: '📚', book: '📖' }[r.type];
              const typeColor = { video: 'text-red-400', article: 'text-blue-400', docs: 'text-green-400', book: 'text-purple-400' }[r.type];
              return (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="card p-5 flex items-start gap-4 hover:border-zinc-600 transition group">
                  <span className={`text-2xl ${typeColor}`}>{typeIcon}</span>
                  <div>
                    <div className="font-medium text-zinc-200 group-hover:text-white transition">{r.title}</div>
                    {r.author && <div className="text-zinc-500 text-sm mt-0.5">by {r.author}</div>}
                    <span className={`text-xs font-medium mt-1 block ${typeColor}`}>{r.type.toUpperCase()}</span>
                  </div>
                  <span className="ml-auto text-zinc-600 group-hover:text-zinc-400 transition">↗</span>
                </a>
              );
            })}
          </div>
        )}

        {activeTab === 'Related' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">Related Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topic.relatedTopics.map((id) => {
                const related = topicsDb[id];
                return related ? (
                  <Link key={id} href={`/topics/${id}`} className="card p-4 hover:border-zinc-600 transition group flex items-center gap-3">
                    <div>
                      <div className="font-medium text-zinc-200 group-hover:text-white transition">{related.title}</div>
                      <div className="text-zinc-500 text-xs">{related.subject} · {related.category}</div>
                    </div>
                    <span className="ml-auto text-zinc-600 group-hover:text-zinc-400 transition">→</span>
                  </Link>
                ) : (
                  <div key={id} className="card p-4 text-zinc-600 text-sm">{id}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

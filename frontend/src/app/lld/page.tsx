import Link from 'next/link';
import { topicsDb } from '@/lib/knowledge';

const lldIcons: Record<string, string> = {
  'lld-bookmyshow': '🎬',
  'lld-lru-cache': '⚡',
  'lld-elevator': '🏢',
  'lld-pubsub': '📡',
  'lld-parking-lot': '🅿️',
  'lld-snake-ladder': '🎲',
  'lld-chess': '♟️',
};

const upcoming = [
  'ATM System', 'Vending Machine', 'Car Rental System', 'Hotel Booking', 'Chess Game Engine', 'Splitwise / Bill Split',
];

const diffColor: Record<string, string> = {
  Expert: 'badge-expert',
  Advanced: 'badge-advanced',
  Intermediate: 'badge-intermediate',
  Beginner: 'badge-beginner',
};

export default function LLDPage() {
  const lldTopics = Object.values(topicsDb).filter(t => t.category === 'LLD');

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-300 transition">Home</Link>
        <span>/</span>
        <span className="text-slate-300">Low Level Design</span>
      </div>

      {/* Page header */}
      <div className="topic-hero p-6 md:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
          🎨 LLD Track
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
          Low-Level Design
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
          Fully solved OOP design problems with SOLID analysis, class diagrams, concurrency handling, and working Java implementations.
        </p>
        <div className="callout callout-summary">
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            📋 <strong>Each problem covers:</strong> Requirements → Class diagram → SOLID analysis → Java implementation → Concurrency design → Interview Q&A
          </p>
        </div>
      </div>

      {/* Available problems */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e2438] pb-3">
          <h2 className="text-base font-bold text-slate-100">
            Available Problems <span className="text-slate-500 font-normal text-sm ml-1">({lldTopics.length})</span>
          </h2>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lldTopics.map((topic) => (
            <Link key={topic.id} href={`/topics/${topic.id}`} className="card-interactive p-5 flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl shrink-0">
                {lldIcons[topic.id] || '🎨'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-100 group-hover:text-purple-300 transition text-sm md:text-base leading-snug">
                  {topic.title.replace(' - Low Level Design', '').replace('LLD: ', '')}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`badge ${diffColor[topic.difficulty] || 'badge-advanced'}`}>{topic.difficulty}</span>
                  <span className="text-slate-500 text-xs">⏱ {topic.estimatedTime}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {topic.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] bg-[#1a1f2e] border border-[#242840] text-slate-500 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-slate-600 group-hover:text-slate-300 text-base transition self-center shrink-0">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-400 border-b border-[#1e2438] pb-3">
          Coming Soon <span className="text-slate-600 font-normal text-sm ml-1">({upcoming.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {upcoming.map((name) => (
            <div key={name} className="rounded-2xl border border-[#1a2035] bg-[#0f1117]/60 p-4 opacity-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1e2438] flex items-center justify-center text-lg">🔒</div>
              <div>
                <div className="font-semibold text-slate-400 text-sm">{name}</div>
                <div className="text-xs text-slate-600 mt-0.5">Coming soon</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

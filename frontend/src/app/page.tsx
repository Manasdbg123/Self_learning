import Link from 'next/link';
import { subjects, getAllTopics, topicsDb } from '@/lib/knowledge';
import DashboardStudyTracker from '@/components/DashboardStudyTracker';

const stats = [
  { label: 'System Blueprints', value: '34+', sub: 'Solved end-to-end', icon: '📐', color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/20' },
  { label: 'HLD Architectures', value: '9', sub: 'Production scale', icon: '🏛️', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20' },
  { label: 'LLD Solutions', value: '7', sub: 'Thread-safe & patterns', icon: '🎨', color: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/20' },
  { label: 'Interview Questions', value: '120+', sub: 'With deep trade-offs', icon: '🎯', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20' },
];

const hldFeatured = [
  { id: 'hld-netflix', title: 'Netflix', tag: 'CDN & Streaming', diff: 'Expert', desc: '45 Tbps Open Connect edge & Cassandra playback state at scale', icon: '📺' },
  { id: 'hld-uber', title: 'Uber / Grab', tag: 'Geospatial H3', diff: 'Expert', desc: 'Hexagonal spatial partitioning & real-time driver dispatch matching', icon: '🚗' },
  { id: 'hld-whatsapp', title: 'WhatsApp', tag: 'E2EE Messaging', diff: 'Expert', desc: 'Signal Protocol (X3DH & Double Ratchet) with Netty WebSockets', icon: '💬' },
  { id: 'hld-twitter', title: 'Twitter / X', tag: 'Hybrid Fanout', diff: 'Advanced', desc: 'Push fanout for normal users & pull for celebrity accounts', icon: '🐦' },
  { id: 'hld-food-delivery', title: 'Food Delivery', tag: 'Saga Pattern', diff: 'Expert', desc: '3-sided marketplace & distributed compensating transactions', icon: '🍕' },
  { id: 'hld-rate-limiter', title: 'Rate Limiter', tag: 'API Defense', diff: 'Advanced', desc: 'Redis Token Bucket vs Sliding Window with atomic Lua scripts', icon: '🛡️' },
];

const lldFeatured = [
  { id: 'lld-bookmyshow', title: 'Movie Ticket Booking', tag: 'Concurrency Lock', diff: 'Expert', pattern: 'Two-Phase Lock', desc: 'Seat hold with 10-min TTL & deadlock-free sorting', icon: '🎬' },
  { id: 'lld-lru-cache', title: 'LRU Cache with TTL', tag: 'Data Structure', diff: 'Advanced', pattern: 'Doubly Linked List', desc: 'O(1) lookups & ReentrantReadWriteLock for concurrent reads', icon: '⚡' },
  { id: 'lld-elevator', title: 'Multi-Elevator Dispatcher', tag: 'State & Strategy', diff: 'Expert', pattern: 'LOOK Algorithm', desc: 'Directional sweep scheduling to eliminate passenger starvation', icon: '🏢' },
  { id: 'lld-pubsub', title: 'Pub/Sub Messaging', tag: 'Observer Pattern', diff: 'Advanced', pattern: 'Thread Isolation', desc: 'Lock-free CopyOnWriteArrayList & isolated subscriber thread pools', icon: '📡' },
];

const diffColor: Record<string, string> = {
  Expert: 'text-rose-400',
  Advanced: 'text-purple-400',
  Intermediate: 'text-blue-400',
};

export default function Dashboard() {
  return (
    <div className="space-y-10 pb-16">
      {/* ── Study Progress Hero ── */}
      <DashboardStudyTracker />

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border ${s.border} bg-gradient-to-br ${s.color} p-5 space-y-2`}
          >
            <div className="text-2xl">{s.icon}</div>
            <div className="text-3xl font-extrabold gradient-text tracking-tight">{s.value}</div>
            <div className="text-slate-200 font-semibold text-xs md:text-sm">{s.label}</div>
            <div className="text-slate-500 text-[11px]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── HLD Track ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e2438]">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              🏛️ High-Level Design Architectures
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Requirements → Capacity → API → Data model → Trade-offs</p>
          </div>
          <Link href="/hld" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition whitespace-nowrap">
            View All 9 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {hldFeatured.map((item) => (
            <Link
              key={item.id}
              href={`/topics/${item.id}`}
              className="card-interactive p-5 flex flex-col gap-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg">
                  {item.icon}
                </div>
                <span className={`text-xs font-bold ${diffColor[item.diff] || 'text-slate-400'}`}>
                  {item.diff}
                </span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">{item.tag}</div>
                <h3 className="font-bold text-slate-100 group-hover:text-indigo-300 transition text-sm md:text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5 line-clamp-2">{item.desc}</p>
              </div>
              <div className="pt-2 border-t border-[#1e2438] flex items-center justify-between text-xs">
                <span className="text-slate-600 group-hover:text-slate-400 transition">Study Architecture</span>
                <span className="text-indigo-500 group-hover:text-indigo-300 transition">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LLD Track ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e2438]">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              🎨 Low-Level Design & OOP Solutions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Class diagrams, concurrency locks, and working Java code</p>
          </div>
          <Link href="/lld" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition whitespace-nowrap">
            View All 7 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lldFeatured.map((item) => (
            <Link
              key={item.id}
              href={`/topics/${item.id}`}
              className="card-interactive p-5 flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {item.pattern}
                  </span>
                  <span className={`text-xs font-semibold ${diffColor[item.diff] || 'text-slate-400'}`}>
                    {item.diff}
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 group-hover:text-purple-300 transition text-sm md:text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">{item.desc}</p>
              </div>
              <span className="text-slate-600 group-hover:text-slate-300 text-base transition self-center shrink-0">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── All Subjects ── */}
      <section className="space-y-4">
        <div className="pb-3 border-b border-[#1e2438]">
          <h2 className="text-lg font-bold text-slate-100">📚 All Curriculum Tracks</h2>
          <p className="text-xs text-slate-500 mt-0.5">Structured study paths from fundamentals to Staff Engineer concepts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {subjects.map((sub) => {
            const topicCount = sub.categories.reduce((acc, c) => acc + c.topicIds.length, 0);
            return (
              <Link
                key={sub.id}
                href={`/subjects/${sub.id}`}
                className="card-interactive p-5 flex flex-col justify-between gap-4 group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sub.color} flex items-center justify-center text-2xl mb-3 shadow-lg`}>
                    {sub.icon}
                  </div>
                  <h3 className="font-bold text-slate-100 group-hover:text-white transition text-sm md:text-base">
                    {sub.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                    {sub.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#1e2438]">
                  <span className="text-slate-500 font-medium">{topicCount} modules</span>
                  <span className="text-indigo-400 group-hover:translate-x-1 transition-transform font-semibold">
                    Start →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

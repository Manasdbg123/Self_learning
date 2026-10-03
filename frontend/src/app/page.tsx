import Link from 'next/link';
import { subjects, getAllTopics, topicsDb } from '@/lib/knowledge';
import DashboardStudyTracker from '@/components/DashboardStudyTracker';

const stats = [
  { label: 'Engineering Modules', value: '34+', sub: 'comprehensively solved', icon: '📚' },
  { label: 'HLD System Blueprints', value: '9', sub: 'production architectures', icon: '🏛️' },
  { label: 'LLD Java Solutions', value: '7', sub: 'thread-safe & patterns', icon: '🎨' },
  { label: 'Interview Questions', value: '120+', sub: 'with detailed trade-offs', icon: '🎯' },
];

const hldFeatured = [
  { id: 'hld-netflix', title: 'Netflix', tag: 'Streaming CDN', diff: 'Expert', desc: '45 Tbps Open Connect edge architecture & Cassandra playback state' },
  { id: 'hld-uber', title: 'Uber / Grab', tag: 'Geospatial H3', diff: 'Expert', desc: 'Hexagonal spatial partitioning & real-time driver dispatch matching' },
  { id: 'hld-food-delivery', title: 'Food Delivery', tag: 'Saga Pattern', diff: 'Expert', desc: '3-sided marketplace & distributed compensating refund transactions' },
  { id: 'hld-whatsapp', title: 'WhatsApp', tag: 'E2EE Chat', diff: 'Expert', desc: 'Signal Protocol (X3DH & Double Ratchet) and Netty WebSockets' },
  { id: 'hld-twitter', title: 'Twitter / X', tag: 'Hybrid Fanout', diff: 'Advanced', desc: 'Push fanout for normal users & pull fanout for celebrity accounts' },
  { id: 'hld-rate-limiter', title: 'Rate Limiter', tag: 'API Defense', diff: 'Advanced', desc: 'Redis Token Bucket vs Sliding Window Log atomic Lua scripts' },
];

const lldFeatured = [
  { id: 'lld-bookmyshow', title: 'Movie Ticket Booking', tag: 'Concurrency Lock', diff: 'Expert', pattern: 'Two-Phase Lock', desc: 'Temporary seat hold with 10-min TTL & deadlock-free sorting' },
  { id: 'lld-lru-cache', title: 'LRU Cache with TTL', tag: 'Data Structure', diff: 'Advanced', pattern: 'Doubly Linked List', desc: 'O(1) lookups & ReentrantReadWriteLock for high concurrent reads' },
  { id: 'lld-elevator', title: 'Multi-Elevator Dispatcher', tag: 'State & Strategy', diff: 'Expert', pattern: 'LOOK Algorithm', desc: 'Directional sweep scheduling to eliminate passenger starvation' },
  { id: 'lld-pubsub', title: 'Pub/Sub Messaging', tag: 'Observer Pattern', diff: 'Advanced', pattern: 'Thread Isolation', desc: 'Lock-free CopyOnWriteArrayList & isolated subscriber thread pools' },
];

export default function Dashboard() {
  const allTopics = getAllTopics();

  return (
    <div className="space-y-12 pb-16">
      {/* Interactive Study Tracker Header */}
      <DashboardStudyTracker />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5 space-y-1 hover:border-zinc-700 transition">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-3xl font-extrabold gradient-text tracking-tight">{s.value}</div>
            <div className="text-zinc-200 font-semibold text-xs md:text-sm">{s.label}</div>
            <div className="text-zinc-500 text-[11px]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* High Level Design Track */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <span>🏛️</span> High-Level Design (HLD) Architectures
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">End-to-end planetary systems with requirements, capacity math, and diagrams</p>
          </div>
          <Link href="/hld" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition">
            View All 9 Systems →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hldFeatured.map((item) => (
            <Link
              key={item.id}
              href={`/topics/${item.id}`}
              className="card p-5 hover:border-indigo-500/40 transition group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {item.tag}
                  </span>
                  <span className="text-xs text-indigo-400 font-mono font-semibold">{item.diff}</span>
                </div>
                <h3 className="font-bold text-zinc-100 group-hover:text-indigo-300 transition text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1.5 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 group-hover:text-zinc-300">
                <span>Explore Architecture</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Low Level Design & OOP Track */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <span>🎨</span> Low-Level Design (LLD) & OOP Solutions
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">Fully solved problems with class diagrams, concurrency locks, and working Java code</p>
          </div>
          <Link href="/lld" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition">
            View All 7 Solutions →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lldFeatured.map((item) => (
            <Link
              key={item.id}
              href={`/topics/${item.id}`}
              className="card p-5 hover:border-purple-500/40 transition group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xl shrink-0">
                🎨
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-purple-300 border border-zinc-700">
                    {item.pattern}
                  </span>
                  <span className="text-xs text-zinc-500">· {item.diff}</span>
                </div>
                <h3 className="font-bold text-zinc-100 group-hover:text-purple-300 transition text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>
              <span className="text-zinc-600 group-hover:text-zinc-300 text-lg transition self-center">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* All Engineering Subjects */}
      <section className="space-y-4">
        <div className="border-b border-zinc-800/80 pb-3">
          <h2 className="text-xl font-bold text-zinc-100">All Curriculum Tracks</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Structured study pathways from fundamentals to Staff Engineer concepts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((sub) => {
            const topicCount = sub.categories.reduce((acc, c) => acc + c.topicIds.length, 0);
            return (
              <Link
                key={sub.id}
                href={`/subjects/${sub.id}`}
                className="card p-5 hover:border-zinc-700 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`text-2xl mb-3 w-11 h-11 rounded-xl bg-gradient-to-br ${sub.color} flex items-center justify-center shadow-lg`}>
                    {sub.icon}
                  </div>
                  <h3 className="font-bold text-zinc-100 group-hover:text-white transition text-base">
                    {sub.name}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-medium text-zinc-400">{topicCount} modules</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">Start →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import { topicsDb } from '@/lib/knowledge';

const allHLD = [
  { title: 'Netflix — Global Video Streaming', difficulty: 'Expert', id: 'hld-netflix', available: true, icon: '📺', desc: '45 Tbps CDN, Open Connect, Cassandra state' },
  { title: 'Uber / Grab — Ride Dispatch', difficulty: 'Expert', id: 'hld-uber', available: true, icon: '🚗', desc: 'H3 hexagonal spatial partitioning & matching' },
  { title: 'Food Delivery (DoorDash / Saga)', difficulty: 'Expert', id: 'hld-food-delivery', available: true, icon: '🍕', desc: '3-sided marketplace & compensating transactions' },
  { title: 'WhatsApp — E2EE Messaging', difficulty: 'Expert', id: 'hld-whatsapp', available: true, icon: '💬', desc: 'Signal X3DH & Double Ratchet, Netty WS' },
  { title: 'Twitter / X — Timeline Fanout', difficulty: 'Advanced', id: 'hld-twitter', available: true, icon: '🐦', desc: 'Push for regular users, pull for celebrities' },
  { title: 'YouTube / TikTok — Video Platform', difficulty: 'Expert', id: 'hld-youtube', available: true, icon: '🎥', desc: 'Transcoding pipeline, adaptive streaming, recs' },
  { title: 'Distributed Web Crawler', difficulty: 'Expert', id: 'hld-web-crawler', available: true, icon: '🕷️', desc: 'Politeness, dedup, frontier queue at search scale' },
  { title: 'Rate Limiter — Token / Sliding Window', difficulty: 'Advanced', id: 'hld-rate-limiter', available: true, icon: '🛡️', desc: 'Redis atomic Lua scripts, multi-tier defense' },
  { title: 'URL Shortener (TinyURL)', difficulty: 'Intermediate', id: 'hld-url-shortener', available: true, icon: '🔗', desc: 'Base62 encoding, consistent hashing, caching' },
  { title: 'Instagram — Photo Sharing', difficulty: 'Advanced', id: 'hld-instagram', available: false, icon: '📸', desc: 'Coming soon' },
  { title: 'Amazon E-Commerce', difficulty: 'Expert', id: 'hld-amazon', available: false, icon: '🛒', desc: 'Coming soon' },
  { title: 'Distributed File Storage', difficulty: 'Expert', id: 'hld-distributed-storage', available: false, icon: '💾', desc: 'Coming soon' },
  { title: 'Notification System', difficulty: 'Intermediate', id: 'hld-notification', available: false, icon: '🔔', desc: 'Coming soon' },
];

const diffColor: Record<string, string> = {
  Expert: 'badge-expert',
  Advanced: 'badge-advanced',
  Intermediate: 'badge-intermediate',
};

export default function HLDPage() {
  const available = allHLD.filter(h => h.available);
  const upcoming  = allHLD.filter(h => !h.available);

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-300 transition">Home</Link>
        <span>/</span>
        <span className="text-slate-300">High Level Design</span>
      </div>

      {/* Page header */}
      <div className="topic-hero p-6 md:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          🏛️ HLD Track
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
          High-Level Design
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
          End-to-end system architecture — from requirements to production-scale designs.
          Each problem follows the <strong className="text-slate-200">V1 → V2 → V3 evolution</strong> approach.
        </p>
        <div className="callout callout-summary mt-2">
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            📋 <strong>How to approach each system:</strong> Requirements → Capacity estimation → API design → Data model → Component architecture → Caching → Scaling → Trade-offs
          </p>
        </div>
      </div>

      {/* Available problems */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e2438] pb-3">
          <h2 className="text-base font-bold text-slate-100">
            Available Systems <span className="text-slate-500 font-normal text-sm ml-1">({available.length})</span>
          </h2>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {available.map((item) => (
            <Link
              key={item.id}
              href={`/topics/${item.id}`}
              className="card-interactive p-5 flex flex-col gap-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/18 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <span className={`badge ${diffColor[item.difficulty] || 'badge-advanced'}`}>
                  {item.difficulty}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-100 group-hover:text-indigo-300 transition text-sm leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5 line-clamp-2">{item.desc}</p>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-[#1e2438] pt-3">
                <span className="text-slate-600 group-hover:text-slate-400 transition">Study System</span>
                <span className="text-indigo-500 group-hover:text-indigo-300 transition font-semibold">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-400 border-b border-[#1e2438] pb-3">
          Coming Soon <span className="text-slate-600 font-normal text-sm ml-1">({upcoming.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {upcoming.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#1a2035] bg-[#0f1117]/60 p-5 opacity-50 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#1e2438] flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div>
                <div className="font-semibold text-slate-400 text-sm">{item.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge ${diffColor[item.difficulty] || 'badge-advanced'}`}>{item.difficulty}</span>
                  <span className="text-xs text-slate-600 font-medium">Coming soon</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

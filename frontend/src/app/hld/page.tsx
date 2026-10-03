import Link from 'next/link';

const HLD_LIST = [
  { id: 'hld-netflix',      title: 'Netflix — Video Streaming',          diff: 'Expert',       icon: '📺', color: '#ef4444', desc: '45 Tbps Open Connect CDN, Cassandra state, adaptive bitrate' },
  { id: 'hld-uber',         title: 'Uber — Geospatial Ride Dispatch',    diff: 'Expert',       icon: '🚗', color: '#f97316', desc: 'H3 hexagonal partitioning, real-time matching, surge pricing' },
  { id: 'hld-food-delivery',title: 'Food Delivery (DoorDash / Saga)',    diff: 'Expert',       icon: '🍕', color: '#f59e0b', desc: '3-sided marketplace, saga pattern, compensating transactions' },
  { id: 'hld-whatsapp',     title: 'WhatsApp — E2EE Messaging',         diff: 'Expert',       icon: '💬', color: '#22c55e', desc: 'Signal X3DH & Double Ratchet protocol, Netty WebSockets' },
  { id: 'hld-twitter',      title: 'Twitter / X — Timeline Fanout',     diff: 'Advanced',     icon: '🐦', color: '#3b82f6', desc: 'Hybrid push/pull fanout for 500M users, VIP accounts' },
  { id: 'hld-youtube',      title: 'YouTube / TikTok — Video Platform', diff: 'Expert',       icon: '🎥', color: '#dc2626', desc: 'Transcoding pipeline, adaptive streaming, recommendation engine' },
  { id: 'hld-web-crawler',  title: 'Distributed Web Crawler',           diff: 'Expert',       icon: '🕷️', color: '#8b5cf6', desc: 'Politeness, URL dedup with Bloom filter, frontier queue' },
  { id: 'hld-rate-limiter', title: 'Rate Limiter — Token Bucket',       diff: 'Advanced',     icon: '🛡️', color: '#6366f1', desc: 'Redis Token Bucket vs Sliding Window Log, atomic Lua scripts' },
  { id: 'hld-url-shortener',title: 'URL Shortener (TinyURL)',           diff: 'Intermediate', icon: '🔗', color: '#10b981', desc: 'Base62 encoding, consistent hashing, global cache layer' },
];

const COMING_SOON = ['Instagram', 'Amazon E-Commerce', 'Distributed File Storage', 'Notification System'];

const DIFF_CLASS: Record<string, string> = {
  Expert: 'badge-expert', Advanced: 'badge-advanced', Intermediate: 'badge-intermediate',
};

export default function HLDPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>High Level Design</span>
      </div>

      {/* Hero */}
      <div className="topic-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 14px', borderRadius: 99, marginBottom: 14,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            color: 'var(--accent-light)', fontSize: 12, fontWeight: 600,
          }}>🏛️ HLD Track • 9 Systems Available</div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>
            High-Level Design Systems
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, marginBottom: 20 }}>
            End-to-end system architectures — from requirements to production scale. Each system uses the <strong style={{ color: 'var(--text-primary)' }}>V1 → V2 → V3 evolution</strong> approach with real trade-offs.
          </p>
          <div className="callout callout-summary" style={{ maxWidth: 600 }}>
            <span className="callout-icon">📋</span>
            <div style={{ fontSize: 13 }}>
              <strong>Each system covers:</strong> Requirements → Capacity Estimation → API Design → Data Model → Architecture → Caching → Scaling → Trade-offs
            </div>
          </div>
        </div>
      </div>

      {/* Available systems */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Available Systems</h2>
          <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            {HLD_LIST.length} Available
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 12 }}>
          {HLD_LIST.map((item) => (
            <Link key={item.id} href={`/topics/${item.id}`} className="card-hover" style={{ padding: 20, color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${item.color}15`, border: `1px solid ${item.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>{item.icon}</div>
                <span className={`badge ${DIFF_CLASS[item.diff]}`}>{item.diff}</span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 7 }}>{item.title}</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{item.desc}</p>
              <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Study system</span>
                <span style={{ fontSize: 12, color: 'var(--accent-light)', fontWeight: 700 }}>Open →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          Coming Soon ({COMING_SOON.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
          {COMING_SOON.map(name => (
            <div key={name} style={{
              padding: '14px 16px', borderRadius: 12, opacity: 0.45,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>🔒</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Coming soon</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

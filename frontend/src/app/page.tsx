import Link from 'next/link';
import { subjects, getAllTopics, topicsDb } from '@/lib/knowledge';
import DashboardStudyTracker from '@/components/DashboardStudyTracker';

const hldFeatured = [
  { id: 'hld-netflix',      title: 'Netflix Streaming',      tag: 'CDN · Cassandra',       diff: 'Expert',   icon: '📺', color: '#ef4444' },
  { id: 'hld-uber',         title: 'Uber Ride Dispatch',     tag: 'Geospatial · H3',       diff: 'Expert',   icon: '🚗', color: '#f97316' },
  { id: 'hld-whatsapp',     title: 'WhatsApp Messaging',     tag: 'E2EE · Signal Protocol', diff: 'Expert',   icon: '💬', color: '#22c55e' },
  { id: 'hld-twitter',      title: 'Twitter Timeline',       tag: 'Hybrid Fanout',         diff: 'Advanced', icon: '🐦', color: '#3b82f6' },
  { id: 'hld-food-delivery',title: 'Food Delivery Platform', tag: 'Saga Pattern',          diff: 'Expert',   icon: '🍕', color: '#f59e0b' },
  { id: 'hld-rate-limiter', title: 'Rate Limiter',           tag: 'Token Bucket · Redis',  diff: 'Advanced', icon: '🛡️', color: '#8b5cf6' },
];

const lldFeatured = [
  { id: 'lld-bookmyshow', title: 'Movie Ticket Booking', pattern: 'Two-Phase Lock',   diff: 'Expert',   icon: '🎬' },
  { id: 'lld-lru-cache',  title: 'LRU Cache with TTL',  pattern: 'LinkedHashMap',    diff: 'Advanced', icon: '⚡' },
  { id: 'lld-elevator',   title: 'Elevator Dispatcher', pattern: 'LOOK Algorithm',   diff: 'Expert',   icon: '🏢' },
  { id: 'lld-pubsub',     title: 'Pub/Sub System',      pattern: 'Observer Pattern', diff: 'Advanced', icon: '📡' },
];

export default function Dashboard() {
  const subjectList = subjects;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingBottom: 60 }}>

      {/* ── Study Progress Header ── */}
      <DashboardStudyTracker />

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 12 }}>
        {[
          { icon: '📐', value: '34+', label: 'Study Modules',    sub: 'topics covered',         bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.2)'  },
          { icon: '🏛️', value: '9',   label: 'HLD Blueprints',   sub: 'production systems',     bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)' },
          { icon: '🎨', value: '7',   label: 'LLD Solutions',    sub: 'Java implementations',   bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)' },
          { icon: '🎯', value: '120+',label: 'Interview Qs',     sub: 'with deep explanations', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)'  },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ background: s.bg, borderColor: s.border }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div className="gradient-text" style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px' }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── HLD Track ── */}
      <section>
        <div className="section-header">
          <h2 className="section-title">🏛️ High-Level Design Systems</h2>
          <Link href="/hld" style={{ fontSize: 13, color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 600 }}>
            View All 9 →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 12 }}>
          {hldFeatured.map((item) => (
            <Link key={item.id} href={`/topics/${item.id}`} className="card-hover" style={{ padding: 20, color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>{item.icon}</div>
                <span className={`badge badge-${item.diff.toLowerCase()}`}>{item.diff}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                {item.tag}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{item.title}</h3>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Study system →</span>
                <span style={{ fontSize: 12, color: 'var(--accent-light)', fontWeight: 600 }}>Open</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LLD Track ── */}
      <section>
        <div className="section-header">
          <h2 className="section-title">🎨 Low-Level Design Problems</h2>
          <Link href="/lld" style={{ fontSize: 13, color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 600 }}>
            View All 7 →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 12 }}>
          {lldFeatured.map((item) => (
            <Link key={item.id} href={`/topics/${item.id}`} className="card-hover" style={{ padding: 18, color: 'inherit', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>{item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '2px 8px', borderRadius: 5, background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
                    {item.pattern}
                  </span>
                  <span className={`badge badge-${item.diff.toLowerCase()}`}>{item.diff}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 16, flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── All Subject Tracks ── */}
      <section>
        <div className="section-header">
          <h2 className="section-title">📚 All Study Tracks</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 12 }}>
          {subjectList.map((sub) => {
            const count = sub.categories.reduce((a, c) => a + c.topicIds.length, 0);
            return (
              <Link key={sub.id} href={`/subjects/${sub.id}`} className="card-hover" style={{ padding: 20, color: 'inherit' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{sub.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{sub.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {sub.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{count} modules</span>
                  <span style={{ fontSize: 12, color: 'var(--accent-light)', fontWeight: 700 }}>Start →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

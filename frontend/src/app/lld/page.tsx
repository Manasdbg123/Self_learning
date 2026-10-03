import Link from 'next/link';
import { topicsDb } from '@/lib/knowledge';

const LLD_ICONS: Record<string, string> = {
  'lld-bookmyshow': '🎬',
  'lld-lru-cache':  '⚡',
  'lld-elevator':   '🏢',
  'lld-pubsub':     '📡',
  'lld-parking-lot':'🅿️',
  'lld-chess':      '♟️',
};

const COMING_SOON = ['ATM System', 'Vending Machine', 'Car Rental', 'Hotel Booking', 'Chess Engine', 'Splitwise', 'Logging Framework', 'Notification System'];

const DIFF_CLASS: Record<string, string> = {
  Beginner: 'badge-beginner', Intermediate: 'badge-intermediate',
  Advanced: 'badge-advanced', Expert: 'badge-expert',
};

export default function LLDPage() {
  const lldTopics = Object.values(topicsDb).filter(t => t.category === 'LLD');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>Low Level Design</span>
      </div>

      {/* Hero */}
      <div className="topic-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 14px', borderRadius: 99, marginBottom: 14,
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
            color: '#c084fc', fontSize: 12, fontWeight: 600,
          }}>🎨 LLD Track • {lldTopics.length} Problems Available</div>
          <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>
            Low-Level Design Problems
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, marginBottom: 20 }}>
            Fully solved OOP design problems with SOLID analysis, concurrency handling, and production-quality Java implementations.
          </p>
          <div className="callout callout-tradeoff" style={{ maxWidth: 600 }}>
            <span className="callout-icon">📋</span>
            <div style={{ fontSize: 13 }}>
              <strong>Each problem covers:</strong> Requirements → Class Diagram → SOLID Analysis → Java Implementation → Concurrency Design → Interview Q&A
            </div>
          </div>
        </div>
      </div>

      {/* Problems */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Available Problems</h2>
          <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            {lldTopics.length} Available
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
          {lldTopics.map((topic) => (
            <Link key={topic.id} href={`/topics/${topic.id}`} className="card-hover" style={{ padding: 18, color: 'inherit', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              }}>{LLD_ICONS[topic.id] || '🎨'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 7 }}>
                  {topic.title.replace(' - Low Level Design', '').replace('LLD: ', '')}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                  <span className={`badge ${DIFF_CLASS[topic.difficulty]}`}>{topic.difficulty}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⏱ {topic.estimatedTime}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {topic.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 5,
                      background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-muted)',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, fontSize: 16, marginTop: 4 }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          Coming Soon ({COMING_SOON.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
          {COMING_SOON.map(name => (
            <div key={name} style={{
              padding: '12px 14px', borderRadius: 10, opacity: 0.45,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Coming soon</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

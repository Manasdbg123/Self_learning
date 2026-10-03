import Link from 'next/link';
import { subjects, getTopicsBySubject } from '@/lib/knowledge';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return subjects.map((s) => ({ subjectId: s.id }));
}

const DIFF_CLASS: Record<string, string> = {
  Beginner: 'badge-beginner', Intermediate: 'badge-intermediate',
  Advanced: 'badge-advanced', Expert: 'badge-expert',
};

export default async function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) notFound();

  const topics = getTopicsBySubject(subjectId);
  const totalTopics = subject.categories.reduce((a, c) => a + c.topicIds.length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{subject.name}</span>
      </div>

      {/* Header */}
      <div className="topic-hero">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            background: `linear-gradient(135deg, var(--bg-elevated), var(--bg-muted))`,
            border: '1px solid var(--border-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
          }}>{subject.icon}</div>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,4vw,30px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 8 }}>
              {subject.name}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 520 }}>
              {subject.description}
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                📚 {totalTopics} modules
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                🎯 Interview-ready content
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                ✅ Quizzes & flashcards included
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Topics */}
      {subject.categories.map((cat) => {
        const catTopics = cat.topicIds
          .map(id => topics.find(t => t.id === id))
          .filter(Boolean) as typeof topics;

        return (
          <section key={cat.id}>
            <div className="section-header">
              <h2 className="section-title">{cat.name}</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{catTopics.length} topics</span>
            </div>

            {catTopics.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                {catTopics.map((topic) => (
                  <Link key={topic.id} href={`/topics/${topic.id}`} className="card-hover" style={{ padding: '18px 20px', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, flex: 1, paddingRight: 12 }}>
                        {topic.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {topic.what.slice(0, 100)}...
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span className={`badge ${DIFF_CLASS[topic.difficulty]}`}>{topic.difficulty}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⏱ {topic.estimatedTime}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '32px 20px',
                background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12,
                color: 'var(--text-muted)', fontSize: 13,
              }}>
                📚 More topics coming soon in {cat.name}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

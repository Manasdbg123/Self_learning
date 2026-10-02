import Link from 'next/link';
import { subjects, getTopicsBySubject } from '@/lib/knowledge';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return subjects.map((s) => ({ subjectId: s.id }));
}

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const subject = subjects.find((s) => s.id === params.subjectId);
  if (!subject) notFound();

  const topics = getTopicsBySubject(params.subjectId);

  const difficultyColor = {
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
    Expert: 'badge-expert',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-5">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-3xl`}>
          {subject.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <span>/</span>
            <span className="text-zinc-300">{subject.name}</span>
          </div>
          <h1 className="text-4xl font-bold text-zinc-100">{subject.name}</h1>
          <p className="text-zinc-400 mt-2">{subject.description}</p>
        </div>
      </div>

      {/* Categories and Topics */}
      {subject.categories.map((cat) => {
        const catTopics = cat.topicIds.map(id => topics.find(t => t.id === id)).filter(Boolean);
        return (
          <div key={cat.id}>
            <h2 className="text-lg font-semibold text-zinc-200 mb-3">{cat.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {catTopics.map((topic) => topic && (
                <Link key={topic.id} href={`/topics/${topic.id}`} className="card p-5 group hover:border-zinc-600 transition-all flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-zinc-100 group-hover:text-white transition truncate">{topic.title}</h3>
                    </div>
                    <p className="text-zinc-500 text-sm line-clamp-2">{topic.what.slice(0, 100)}...</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`badge ${difficultyColor[topic.difficulty]}`}>{topic.difficulty}</span>
                      <span className="text-zinc-600 text-xs">⏱ {topic.estimatedTime}</span>
                    </div>
                  </div>
                  <div className="text-zinc-600 group-hover:text-zinc-400 transition text-xl shrink-0">→</div>
                </Link>
              ))}
              {catTopics.length === 0 && (
                <div className="col-span-2 card p-6 text-center text-zinc-600">
                  More topics coming soon in {cat.name}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {topics.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">{subject.icon}</div>
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">Content Being Added</h3>
          <p className="text-zinc-500">We're populating this subject. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

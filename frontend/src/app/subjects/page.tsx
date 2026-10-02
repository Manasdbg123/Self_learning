import Link from 'next/link';
import { subjects } from '@/lib/knowledge';

export default function SubjectsIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
          <Link href="/" className="hover:text-zinc-300">Home</Link> / <span>Subjects</span>
        </div>
        <h1 className="text-4xl font-bold text-zinc-100">All Subjects</h1>
        <p className="text-zinc-400 mt-2">Choose a subject to start learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subjects.map((subject) => (
          <Link key={subject.id} href={`/subjects/${subject.id}`} className="card p-6 group hover:border-zinc-600 transition-all flex gap-5">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl shrink-0`}>
              {subject.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition">{subject.name}</h2>
              <p className="text-zinc-500 text-sm mt-1">{subject.description}</p>
              <div className="text-xs text-zinc-600 mt-3">
                {subject.categories.length} categories · {subject.categories.reduce((acc, c) => acc + c.topicIds.length, 0)} topics
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

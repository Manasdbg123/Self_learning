import Link from 'next/link';
import { topicsDb } from '@/lib/knowledge';

export default function LLDPage() {
  const lldTopics = Object.values(topicsDb).filter(t => t.category === 'LLD');

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
          <Link href="/" className="hover:text-zinc-300">Home</Link> / <span>LLD Problems</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-zinc-100">Low Level Design</h1>
        <p className="text-zinc-400 mt-2">Fully solved LLD problems with SOLID analysis, class diagrams, Java implementation, and interview questions</p>
      </div>

      <div className="card p-5 bg-blue-500/5 border-blue-500/20">
        <h3 className="font-semibold text-blue-400 mb-1">🎨 How to use LLD section</h3>
        <p className="text-zinc-400 text-sm">Every problem has: Problem statement → Requirements → Class diagram → SOLID analysis → Java implementation → Concurrency concerns → Interview questions. Study each problem end-to-end before your interview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lldTopics.map((topic) => (
          <Link key={topic.id} href={`/topics/${topic.id}`} className="card p-6 group hover:border-zinc-600 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-zinc-100 group-hover:text-white transition text-lg">{topic.title.replace(' - Low Level Design', '')}</h3>
                <div className="flex gap-2 mt-2">
                  <span className="badge badge-intermediate">{topic.difficulty}</span>
                  <span className="text-zinc-600 text-xs">⏱ {topic.estimatedTime}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {topic.tags.map(tag => (
                    <span key={tag} className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <span className="text-3xl">🎨</span>
            </div>
          </Link>
        ))}

        {/* Placeholder cards for upcoming content */}
        {['ATM System', 'Vending Machine', 'Car Rental (Zoomcar)', 'Hotel Booking', 'Chess Game Engine', 'Notification System', 'Logging Framework', 'Splitwise Expense Sharing'].map((name) => (
          <div key={name} className="card p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-zinc-300">{name}</h3>
                <span className="text-xs text-zinc-600 mt-2 block">Coming Soon</span>
              </div>
              <span className="text-3xl">🔒</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

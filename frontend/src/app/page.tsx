import Link from 'next/link';
import { subjects, getAllTopics } from '@/lib/knowledge';

const stats = [
  { label: 'Topics', value: '6+', sub: 'and growing' },
  { label: 'LLD Problems', value: '15', sub: 'fully solved' },
  { label: 'HLD Systems', value: '15', sub: 'architecture ready' },
  { label: 'Interview Qs', value: '100+', sub: 'with answers' },
];

const quickAccess = [
  { title: 'URL Shortener', sub: 'HLD · Intermediate', href: '/topics/hld-url-shortener', badge: 'Popular', color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20' },
  { title: 'Parking Lot', sub: 'LLD · Intermediate', href: '/topics/lld-parking-lot', badge: 'Interview Fav', color: 'from-purple-500/10 to-violet-500/10 border-purple-500/20' },
  { title: 'JVM Architecture', sub: 'Java · Advanced', href: '/topics/jvm-architecture', badge: 'Core', color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20' },
  { title: 'RAG Architecture', sub: 'AI · Advanced', href: '/topics/rag', badge: 'Trending', color: 'from-green-500/10 to-emerald-500/10 border-green-500/20' },
  { title: 'Apache Kafka', sub: 'Backend · Advanced', href: '/topics/kafka', badge: 'Core', color: 'from-rose-500/10 to-pink-500/10 border-rose-500/20' },
  { title: 'SOLID Principles', sub: 'OOP · Intermediate', href: '/topics/solid-principles', badge: 'Fundamental', color: 'from-cyan-500/10 to-sky-500/10 border-cyan-500/20' },
];

export default function Dashboard() {
  const allTopics = getAllTopics();

  return (
    <div className="space-y-10">

      {/* Hero */}
      <section>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          AI-Powered Learning Platform
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-100 leading-tight">
          Your Personal<br />
          <span className="gradient-text">Engineering University</span>
        </h1>
        <p className="text-zinc-400 text-base md:text-lg mt-4 max-w-2xl">
          Master Software Engineering, System Design, Backend, and AI — with structured learning paths, AI tutoring, and real-world examples.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/subjects/system-design" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition text-sm">
            Start with System Design →
          </Link>
          <Link href="/chat" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg font-medium transition text-sm border border-zinc-700">
            Ask AI Tutor
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-3xl font-bold gradient-text">{s.value}</div>
            <div className="text-zinc-300 font-medium text-sm mt-1">{s.label}</div>
            <div className="text-zinc-600 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-zinc-100">Start Learning</h2>
          <Link href="/search" className="text-sm text-indigo-400 hover:text-indigo-300">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccess.map((item) => (
            <Link key={item.href} href={item.href} className={`card p-5 border hover:scale-[1.01] transition-all bg-gradient-to-br ${item.color}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">{item.badge}</span>
              </div>
              <h3 className="font-semibold text-zinc-100">{item.title}</h3>
              <p className="text-zinc-500 text-xs mt-1">{item.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section>
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">All Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <Link key={sub.id} href={`/subjects/${sub.id}`} className="card p-5 hover:border-zinc-600 transition-all group">
              <div className={`text-3xl mb-3 w-12 h-12 rounded-xl bg-gradient-to-br ${sub.color} flex items-center justify-center`}>
                {sub.icon}
              </div>
              <h3 className="font-semibold text-zinc-100 group-hover:text-white transition">{sub.name}</h3>
              <p className="text-zinc-500 text-sm mt-1">{sub.description}</p>
              <div className="mt-3 text-xs text-zinc-600">
                {sub.categories.reduce((acc, c) => acc + c.topicIds.length, 0)} topics available
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

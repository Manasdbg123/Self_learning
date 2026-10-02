import React from 'react';

export default async function TopicPage({ params }: { params: { id: string } }) {
  // In a real app, this fetches from http://localhost:8080/api/topics/${params.id}
  // Hardcoded fallback for UI demonstration of the requirements
  const topic = {
    title: "URL Shortener",
    subject: "System Design",
    difficulty: "Intermediate",
    time: "45 mins",
    overview: "A service that creates an alias for a long URL.",
    architecture: "Client -> Load Balancer -> API Gateway -> Redis -> PostgreSQL",
    deepDive: "Uses Base62 encoding. Pre-generates keys via ZooKeeper to avoid DB collisions at scale.",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <p className="text-zinc-500 text-sm mb-2">{topic.subject} / HLD / {topic.title}</p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">{topic.title}</h1>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">{topic.difficulty}</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300">{topic.time} read</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition">Bookmark</button>
          <button className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition">Mark Completed</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-zinc-800 text-sm">
        <button className="py-2 border-b-2 border-indigo-500 text-indigo-400">Overview</button>
        <button className="py-2 text-zinc-400 hover:text-zinc-200">Deep Dive</button>
        <button className="py-2 text-zinc-400 hover:text-zinc-200">Architecture</button>
        <button className="py-2 text-zinc-400 hover:text-zinc-200">Interview</button>
        <button className="py-2 text-zinc-400 hover:text-zinc-200">AI Tutor</button>
      </div>

      {/* Content Area */}
      <div className="prose prose-invert max-w-none mt-8">
        <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-200">Overview</h2>
          <p className="text-zinc-400 leading-relaxed">{topic.overview}</p>
        </section>

        <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-200">Architecture & Data Flow</h2>
          <pre className="bg-black p-4 rounded-lg text-green-400">
            <code>{topic.architecture}</code>
          </pre>
        </section>

        <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-200">Deep Dive</h2>
          <p className="text-zinc-400 leading-relaxed">{topic.deepDive}</p>
        </section>
      </div>
    </div>
  );
}

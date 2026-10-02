import React from 'react';
import Link from 'next/link';

export default function SubjectsPage() {
  const subjects = [
    { name: 'System Design', topics: ['URL Shortener', 'Parking Lot', 'Rate Limiter'] },
    { name: 'Programming', topics: ['Java', 'JVM Architecture', 'Garbage Collection'] },
    { name: 'Backend Engineering', topics: ['Spring Boot', 'Kafka', 'Redis'] }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Subjects</h1>
        <p className="text-zinc-400 mt-2">Explore the engineering knowledge base.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition">
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">{sub.name}</h2>
            <ul className="space-y-2">
              {sub.topics.map((topic, j) => (
                <li key={j}>
                  <Link href={`/topics/${topic.toLowerCase().replace(/ /g, '-')}`} className="text-indigo-400 hover:text-indigo-300 transition">
                    {topic}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

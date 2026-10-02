import Link from 'next/link';
import { topicsDb } from '@/lib/knowledge';

export default function HLDPage() {
  const hldTopics = Object.values(topicsDb).filter(t => t.category === 'HLD');

  const allHLD = [
    { title: 'URL Shortener', difficulty: 'Intermediate', id: 'hld-url-shortener', available: true },
    { title: 'YouTube', difficulty: 'Expert', id: 'hld-youtube', available: false },
    { title: 'Netflix', difficulty: 'Expert', id: 'hld-netflix', available: false },
    { title: 'WhatsApp', difficulty: 'Expert', id: 'hld-whatsapp', available: false },
    { title: 'Uber', difficulty: 'Expert', id: 'hld-uber', available: false },
    { title: 'Instagram', difficulty: 'Advanced', id: 'hld-instagram', available: false },
    { title: 'Twitter/X', difficulty: 'Advanced', id: 'hld-twitter', available: false },
    { title: 'Amazon', difficulty: 'Expert', id: 'hld-amazon', available: false },
    { title: 'Food Delivery (Swiggy/Zomato)', difficulty: 'Advanced', id: 'hld-food-delivery', available: false },
    { title: 'Ride Sharing', difficulty: 'Advanced', id: 'hld-ride-sharing', available: false },
    { title: 'Ticket Booking (BookMyShow)', difficulty: 'Advanced', id: 'hld-ticket-booking', available: false },
    { title: 'Distributed File Storage', difficulty: 'Expert', id: 'hld-distributed-storage', available: false },
    { title: 'Notification System', difficulty: 'Intermediate', id: 'hld-notification', available: false },
    { title: 'Search Engine', difficulty: 'Expert', id: 'hld-search-engine', available: false },
    { title: 'Rate Limiter', difficulty: 'Advanced', id: 'hld-rate-limiter', available: false },
  ];

  const diffBadge: Record<string, string> = {
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
    Expert: 'badge-expert',
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
          <Link href="/" className="hover:text-zinc-300">Home</Link> / <span>HLD Problems</span>
        </div>
        <h1 className="text-4xl font-bold text-zinc-100">High Level Design</h1>
        <p className="text-zinc-400 mt-2">End-to-end system architecture — from requirements to production-scale designs with V1 → V2 → V3 evolution</p>
      </div>

      <div className="card p-5 bg-purple-500/5 border-purple-500/20">
        <h3 className="font-semibold text-purple-400 mb-1">🏛️ How to use HLD section</h3>
        <p className="text-zinc-400 text-sm">Every system includes: Requirements → Capacity estimation → API design → Data model → Component architecture → Caching → Scaling → Trade-offs. Master the evolution from simple to production-scale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allHLD.map((item) => (
          item.available ? (
            <Link key={item.id} href={`/topics/${item.id}`} className="card p-5 group hover:border-zinc-600 transition-all">
              <div className="text-2xl mb-3">🏛️</div>
              <h3 className="font-semibold text-zinc-100 group-hover:text-white">{item.title}</h3>
              <div className="flex gap-2 mt-2">
                <span className={`badge ${diffBadge[item.difficulty] || 'badge-advanced'}`}>{item.difficulty}</span>
                <span className="text-xs text-green-500 font-medium">● Available</span>
              </div>
            </Link>
          ) : (
            <div key={item.id} className="card p-5 opacity-50">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="font-semibold text-zinc-400">{item.title}</h3>
              <div className="flex gap-2 mt-2">
                <span className={`badge ${diffBadge[item.difficulty] || 'badge-advanced'}`}>{item.difficulty}</span>
                <span className="text-xs text-zinc-600 font-medium">Coming Soon</span>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

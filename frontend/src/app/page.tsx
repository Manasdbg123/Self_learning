export default function Home() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Welcome back. Continue your engineering journey.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium">Continue Learning</h3>
            <p className="text-sm text-zinc-400 mt-1">System Design: Rate Limiting</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium">Interview Readiness</h3>
            <p className="text-sm text-zinc-400 mt-1">78% - Strong in Backend</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium">Recently Added</h3>
            <p className="text-sm text-zinc-400 mt-1">Gaurav Sen: Load Balancing</p>
        </div>
      </div>
    </div>
  )
}

import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Engineering Knowledge Platform',
  description: 'Your personal AI-powered engineering knowledge system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 flex h-screen`}>
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">EngKnowledge</h1>
          <nav className="flex flex-col gap-2 mt-4">
            <Link href="/" className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition">Dashboard</Link>
            <Link href="/subjects" className="px-3 py-2 rounded hover:bg-zinc-800 transition">Subjects</Link>
            <Link href="/chat" className="px-3 py-2 rounded hover:bg-zinc-800 transition">AI Tutor</Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-8">
            {children}
        </main>
      </body>
    </html>
  )
}

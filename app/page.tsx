import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      <header className="card">
        <p className="text-xs uppercase tracking-wider text-emerald-300">Jen Carpenter Productions</p>
        <h1 className="text-2xl font-bold mt-1">Powerflex French Quarter Scavenger Hunt</h1>
        <p className="text-slate-300 mt-2">Start: NOPSI Hotel · Finish: Mulate&apos;s · 75 minutes</p>
      </header>
      <Link href="/participant" className="btn block bg-emerald-500 text-slate-950 text-center">Join as Team</Link>
      <Link href="/admin" className="btn block bg-indigo-500 text-white text-center">Host Dashboard</Link>
    </main>
  )
}

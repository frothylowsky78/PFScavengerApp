import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      <header className="card">
        <Image src="/Powerflex-Logo-2025-2-Color.png" alt="Powerflex logo" width={600} height={130} className="w-full h-auto bg-white rounded-xl p-2" priority />
        <p className="text-xs uppercase tracking-wider text-emerald-300 mt-3">Jen Carpenter Productions</p>
        <h1 className="text-2xl font-bold mt-1">Powerflex French Quarter Scavenger Hunt</h1>
        <p className="text-slate-300 mt-2">Start: NOPSI Hotel · Duration: 75 minutes</p>
      </header>
      <Link href="/participant" className="btn block bg-emerald-500 text-slate-950 text-center">Join as Team</Link>
      <Link href="/admin" className="btn block bg-indigo-500 text-white text-center">Host Dashboard</Link>
    </main>
  )
}

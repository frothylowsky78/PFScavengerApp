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

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Team Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-200">
          <li>Select <strong>Join as Team</strong> and enter your team code.</li>
          <li>Complete your team’s <strong>Kickoff Challenge (Step 0)</strong> at NOPSI and upload proof.</li>
          <li>After kickoff is complete, solve each clue and submit proof at every checkpoint.</li>
          <li>Use <strong>QR token or answer entry</strong> to unlock the next checkpoint.</li>
          <li>GPS hints are optional: use warmer/colder + distance/direction if your team gets stuck.</li>
          <li>Uploads can be photos or short videos, depending on the checkpoint instructions.</li>
          <li>Keep moving—host verification may happen during play, but your team should continue the route.</li>
          <li>Finish at the final checkpoint and await host final reveal instructions.</li>
        </ol>
        <p className="text-xs text-slate-400">Tip: Assign roles (navigator, clue reader, photographer, uploader) so your team moves faster.</p>
      </section>

      <Link href="/participant" className="btn block bg-emerald-500 text-slate-950 text-center">Join as Team</Link>
      <Link href="/admin" className="btn block bg-indigo-500 text-white text-center">Host Dashboard</Link>
    </main>
  )
}

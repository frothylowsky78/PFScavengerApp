import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      <header className="card">
        <Image src="/TrailSignLogo.png" alt="WorkMoney Park City" width={600} height={300} className="w-full h-auto bg-white rounded-xl p-2" priority />
        <p className="text-xs uppercase tracking-wider text-emerald-300 mt-3">Hosted by Jen Carpenter Productions</p>
        <h1 className="text-2xl font-bold mt-1">WorkMoney Park City Scavenger Hunt</h1>
        <p className="text-slate-300 mt-2">Solve the clues to reveal your final stop</p>
      </header>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Team Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-200">
          <li>Tap <strong>Join as Team</strong> and open your team color.</li>
          <li>Confirm your <strong>bus start</strong> and <strong>route</strong> on the team screen.</li>
          <li>Complete your <strong>Kickoff Challenge (Step 0)</strong> and submit proof.</li>
          <li>After kickoff, solve each clue and submit proof at every checkpoint to unlock the next clue.</li>
          <li>All proofs are <strong>photo or text only</strong>. No video — cell data in town can be slow.</li>
          <li>Use the optional <strong>GPS warmer/colder</strong> hint if your team gets stuck.</li>
          <li>Finish at the final checkpoint once it’s revealed. A WorkMoney host will meet you at the door.</li>
        </ol>
        <p className="text-xs text-slate-400">Tip: Assign roles (navigator, clue reader, photographer, uploader) so your team moves faster.</p>
      </section>

      <section className="card space-y-1">
        <p className="text-xs uppercase text-slate-400">Need help?</p>
        <p className="text-sm text-slate-200"><strong>Carl Moczydlowsky</strong></p>
        <a href="tel:+16192049010" className="text-sm text-emerald-300 underline underline-offset-2">619.204.9010</a>
      </section>

      <Link href="/participant" className="btn block bg-emerald-500 text-slate-950 text-center">Join as Team</Link>
      <Link href="/admin" className="btn block bg-indigo-500 text-white text-center">Host Dashboard</Link>
    </main>
  )
}

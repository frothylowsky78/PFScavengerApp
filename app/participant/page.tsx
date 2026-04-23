import Link from 'next/link'
import { TEAM_META } from '@/lib/team-meta'

export default function ParticipantLandingPage() {
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Select your team</h1>
      <p className="text-slate-300">Tap your color to open your team hunt screen.</p>

      <details className="card text-sm text-slate-300">
        <summary className="cursor-pointer font-semibold">One phone per team — how it works</summary>
        <div className="mt-2 space-y-2">
          <p>Only the phone that claimed this team can submit. Your claim is stored on that phone only — if you clear your browser, use private/incognito mode, or switch devices, you&apos;ll need to tap <strong>Take over this device</strong> on the team screen to regain submission rights.</p>
          <p>If a teammate&apos;s phone dies or they&apos;re out of range, tap <strong>Take over this device</strong> from a working phone to transfer the claim. The previous phone will be locked out until it takes over again.</p>
        </div>
      </details>

      <div className="space-y-3">
        {TEAM_META.map((team) => (
          <Link key={team.code} href={`/participant/${team.code}`} className="btn block text-center" style={{ backgroundColor: team.hex, color: team.text }}>
            {team.name}
          </Link>
        ))}
      </div>
    </main>
  )
}

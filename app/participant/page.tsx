import Link from 'next/link'
import { TEAM_META } from '@/lib/team-meta'

export default function ParticipantLandingPage() {
  return (
    <main className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Select your team</h1>
      <p className="text-slate-300">Tap your color to open your team hunt screen.</p>
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

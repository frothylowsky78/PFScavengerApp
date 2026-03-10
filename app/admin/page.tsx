export const dynamic = 'force-dynamic'

import { getSupabaseServer } from '@/lib/supabase-server'

async function verify(progressId: string, approved: boolean) {
  'use server'
  const supabase = getSupabaseServer()
  await supabase.from('team_progress').update({
    status: approved ? 'verified' : 'rejected',
    points_awarded: approved ? 100 : 0,
    verified_at: new Date().toISOString()
  }).eq('id', progressId)
}

export default async function AdminPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <main className="min-h-screen p-4 max-w-3xl mx-auto">
        <section className="card">
          <h1 className="text-2xl font-bold">Host Dashboard</h1>
          <p className="mt-2 text-slate-300">Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel project settings.</p>
        </section>
      </main>
    )
  }

  const supabase = getSupabaseServer()
  const [{ data: leaderboard }, { data: submissions }] = await Promise.all([
    supabase.from('leaderboard_view').select('*').order('total_points', { ascending: false }),
    supabase.from('pending_submissions_view').select('*').limit(50)
  ])

  return (
    <main className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Host Dashboard</h1>
      <section className="card overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Live Leaderboard</h2>
        <table className="w-full text-sm">
          <thead><tr><th className="text-left">Team</th><th>Route</th><th className="text-right">Points</th></tr></thead>
          <tbody>
            {leaderboard?.map((row) => (
              <tr key={row.team_code}>
                <td>{row.team_name}</td><td className="text-center">{row.route_code}</td><td className="text-right">{row.total_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">Verification Queue</h2>
        {submissions?.map((s) => (
          <div key={s.progress_id} className="rounded-lg border border-slate-700 p-3 space-y-2">
            <p><strong>{s.team_name}</strong> · {s.checkpoint_title}</p>
            <p className="text-sm">Answer: {s.answer_text || '—'}</p>
            <a href={s.proof_url || '#'} target="_blank" className="text-blue-300">Open proof</a>
            <div className="flex gap-2">
              <form action={verify.bind(null, s.progress_id, true)}><button className="btn bg-emerald-600">Approve +100</button></form>
              <form action={verify.bind(null, s.progress_id, false)}><button className="btn bg-rose-600">Reject</button></form>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

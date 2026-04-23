export const dynamic = 'force-dynamic'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase-server'
import { TEAM_META } from '@/lib/team-meta'

type TeamMeta = (typeof TEAM_META)[number]
const TEAM_BY_CODE = new Map<string, TeamMeta>(TEAM_META.map((t) => [t.code as string, t]))

const HOST_ADMIN_PASSWORD = 'JCP1234!'
const HOST_ADMIN_COOKIE = 'pf_host_admin_auth'

type ReviewedProof = {
  id: string
  submission_type: 'kickoff' | 'checkpoint'
  team_name: string
  checkpoint_title: string
  status: 'verified' | 'rejected'
  proof_url: string | null
  updated_at: string
}

async function verify(progressId: string, approved: boolean, submissionType: 'kickoff' | 'checkpoint') {
  'use server'
  const supabase = getSupabaseServer()

  if (submissionType === 'kickoff') {
    const { data: current } = await supabase
      .from('kickoff_progress')
      .select('status')
      .eq('id', progressId)
      .single()
    if (current?.status !== 'submitted') {
      revalidatePath('/admin')
      return
    }

    await supabase
      .from('kickoff_progress')
      .update({ status: approved ? 'verified' : 'rejected', points_awarded: approved ? 10 : 0, completed_at: new Date().toISOString() })
      .eq('id', progressId)

    revalidatePath('/admin')
    return
  }

  const { data: currentRow } = await supabase
    .from('team_progress')
    .select('status, checkpoint_id, checkpoints(points)')
    .eq('id', progressId)
    .single()
  if (currentRow?.status !== 'submitted') {
    revalidatePath('/admin')
    return
  }

  const awarded = approved
    ? (currentRow.checkpoints as { points?: number } | null)?.points ?? 10
    : 0

  await supabase
    .from('team_progress')
    .update({ status: approved ? 'verified' : 'rejected', points_awarded: awarded, verified_at: new Date().toISOString() })
    .eq('id', progressId)

  revalidatePath('/admin')
}

async function authenticateHost(formData: FormData) {
  'use server'
  const password = String(formData.get('password') ?? '')

  if (password !== HOST_ADMIN_PASSWORD) {
    redirect('/admin?error=1')
  }

  const cookieStore = await cookies()
  cookieStore.set(HOST_ADMIN_COOKIE, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  })

  redirect('/admin')
}

async function logoutHost() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.delete(HOST_ADMIN_COOKIE)
  redirect('/admin')
}

export default async function AdminPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  const params = searchParams ? await searchParams : undefined
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get(HOST_ADMIN_COOKIE)?.value === 'ok'

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen p-4 max-w-md mx-auto">
        <section className="card space-y-3">
          <h1 className="text-2xl font-bold">WorkMoney Park City · Host Login</h1>
          <p className="text-sm text-slate-300">Enter the host password to access admin controls.</p>
          {params?.error ? <p className="text-sm text-rose-300">Incorrect password. Please try again.</p> : null}
          <form action={authenticateHost} className="space-y-3">
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              placeholder="Host password"
            />
            <button className="btn w-full">Enter Host Dashboard</button>
          </form>
        </section>
      </main>
    )
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <main className="min-h-screen p-4 max-w-3xl mx-auto">
        <section className="card">
          <h1 className="text-2xl font-bold">WorkMoney Park City · Host Dashboard</h1>
          <p className="mt-2 text-slate-300">Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel project settings.</p>
        </section>
      </main>
    )
  }

  const supabase = getSupabaseServer()
  const [{ data: leaderboard }, { data: submissions }, { data: checkpointReviewed }, { data: kickoffReviewed }] = await Promise.all([
    supabase.from('leaderboard_view').select('*').order('total_points', { ascending: false }),
    supabase.from('pending_submissions_view').select('*').limit(100),
    supabase
      .from('team_progress')
      .select('id,status,proof_url,updated_at,teams(name),checkpoints(internal_location_name)')
      .in('status', ['verified', 'rejected'])
      .not('proof_url', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(100),
    supabase
      .from('kickoff_progress')
      .select('id,status,proof_url,updated_at,teams(name)')
      .in('status', ['verified', 'rejected'])
      .not('proof_url', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(100)
  ])

  const reviewedProofs: ReviewedProof[] = [
    ...((checkpointReviewed ?? []).map((row) => ({
      id: row.id as string,
      submission_type: 'checkpoint' as const,
      team_name: (row.teams as { name?: string } | null)?.name ?? 'Unknown team',
      checkpoint_title: (row.checkpoints as { internal_location_name?: string } | null)?.internal_location_name ?? 'Checkpoint',
      status: row.status as 'verified' | 'rejected',
      proof_url: row.proof_url as string | null,
      updated_at: row.updated_at as string
    }))),
    ...((kickoffReviewed ?? []).map((row) => ({
      id: row.id as string,
      submission_type: 'kickoff' as const,
      team_name: (row.teams as { name?: string } | null)?.name ?? 'Unknown team',
      checkpoint_title: 'Kickoff Challenge',
      status: row.status as 'verified' | 'rejected',
      proof_url: row.proof_url as string | null,
      updated_at: row.updated_at as string
    })))
  ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  return (
    <main className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">WorkMoney Park City · Host</h1>
        <form action={logoutHost}><button className="btn bg-slate-700">Log out</button></form>
      </div>
      <section className="card overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Live Leaderboard</h2>
        <table className="w-full text-sm">
          <thead><tr><th className="text-left">Team</th><th>Bus</th><th>Route</th><th className="text-right">Points</th></tr></thead>
          <tbody>
            {leaderboard?.map((row) => {
              const meta = TEAM_BY_CODE.get(row.team_code as string)
              return (
                <tr key={row.team_code}>
                  <td>
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full border border-slate-600" style={{ backgroundColor: meta?.hex ?? '#64748b' }} aria-hidden />
                      {row.team_name}
                    </span>
                  </td>
                  <td className="text-center">{meta?.busStart ?? '—'}</td>
                  <td className="text-center">{row.route_code}</td>
                  <td className="text-right">{row.total_points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">Verification Queue</h2>
        {submissions?.map((s) => (
          <div key={s.progress_id} className="rounded-lg border border-slate-700 p-3 space-y-2">
            <p><strong>{s.team_name}</strong> · {s.checkpoint_title} <span className="text-xs uppercase text-slate-400">({s.submission_type})</span></p>
            <p className="text-sm">Submitted note: {s.answer_text || '—'}</p>
            <p className="text-sm text-amber-200">Host check: {s.host_verification_task_text || 'Verify against checkpoint criteria.'}</p>
            <a href={s.proof_url || '#'} target="_blank" className="text-blue-300">Open proof</a>
            <div className="flex gap-2">
              <form action={verify.bind(null, s.progress_id, true, s.submission_type)}><button className="btn bg-emerald-600">Approve</button></form>
              <form action={verify.bind(null, s.progress_id, false, s.submission_type)}><button className="btn bg-rose-600">Reject</button></form>
            </div>
          </div>
        ))}
      </section>

      <section className="card space-y-1">
        <p className="text-xs uppercase text-slate-400">Need help?</p>
        <p className="text-sm text-slate-200"><strong>Carl Moczydlowsky</strong></p>
        <a href="tel:+16192049010" className="text-sm text-emerald-300 underline underline-offset-2">619.204.9010</a>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">Reviewed Proof Downloads</h2>
        <p className="text-sm text-slate-300">Download proof files that were already approved or rejected.</p>
        {reviewedProofs.length === 0 ? (
          <p className="text-sm text-slate-400">No reviewed proof files yet.</p>
        ) : (
          <div className="space-y-2">
            {reviewedProofs.map((proof) => (
              <div key={`${proof.submission_type}-${proof.id}`} className="rounded-lg border border-slate-700 p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{proof.team_name} · {proof.checkpoint_title}</p>
                  <p className="text-xs text-slate-400 uppercase">{proof.submission_type} · {proof.status}</p>
                </div>
                {proof.proof_url ? (
                  <a
                    href={proof.proof_url}
                    target="_blank"
                    download
                    className="btn bg-blue-600 whitespace-nowrap"
                  >
                    Download
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

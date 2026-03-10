import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const team = request.nextUrl.searchParams.get('team')
  const supabase = getSupabaseServer()

  if (team) {
    const { data: teamRow } = await supabase
      .from('teams')
      .select('id, route_id, kickoff_challenge, name, code, routes(code)')
      .eq('code', team)
      .single()

    if (!teamRow) return NextResponse.json({ checkpoints: [], progress: [] })

    const [{ data: checkpoints }, { data: progress }, { data: kickoff }] = await Promise.all([
      supabase.from('checkpoints').select('*').eq('route_id', teamRow.route_id).order('order_index'),
      supabase.from('team_progress').select('checkpoint_id,status,points_awarded').eq('team_id', teamRow.id),
      supabase.from('kickoff_progress').select('*').eq('team_id', teamRow.id).maybeSingle()
    ])

    return NextResponse.json({
      team: {
        id: teamRow.id,
        code: teamRow.code,
        name: teamRow.name,
        routeCode: (teamRow.routes as { code: string } | null)?.code ?? null,
        kickoffChallenge: teamRow.kickoff_challenge
      },
      kickoff,
      checkpoints,
      progress
    })
  }

  const { data } = await supabase.from('leaderboard_view').select('*').order('total_points', { ascending: false })
  return NextResponse.json(data)
}

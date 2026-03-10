import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const team = request.nextUrl.searchParams.get('team')
  const supabase = getSupabaseServer()

  if (team) {
    const { data: teamRow } = await supabase.from('teams').select('id, route_id').eq('code', team).single()
    if (!teamRow) return NextResponse.json({ checkpoints: [], progress: [] })
    const [{ data: checkpoints }, { data: progress }] = await Promise.all([
      supabase.from('checkpoints').select('*').eq('route_id', teamRow.route_id).order('order_index'),
      supabase.from('team_progress').select('checkpoint_id,status,points_awarded').eq('team_id', teamRow.id)
    ])
    return NextResponse.json({ checkpoints, progress })
  }

  const { data } = await supabase.from('leaderboard_view').select('*').order('total_points', { ascending: false })
  return NextResponse.json(data)
}

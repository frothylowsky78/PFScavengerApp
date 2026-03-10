import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

type TeamCheckpointRow = {
  id: string
  order_index: number
  public_checkpoint_label: string | null
  participant_clue_text: string | null
  participant_task_text_pre_solve: string | null
  participant_success_text_post_solve: string | null
  internal_location_name: string | null
  host_verification_task_text: string | null
  proof_type: 'photo' | 'video'
  enable_gps: boolean
  latitude: number | null
  longitude: number | null
}

type TeamProgressRow = {
  checkpoint_id: string
  status: 'pending' | 'submitted' | 'verified' | 'rejected'
  points_awarded: number
}

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
      supabase
        .from('checkpoints')
        .select('id,order_index,public_checkpoint_label,participant_clue_text,participant_task_text_pre_solve,participant_success_text_post_solve,internal_location_name,host_verification_task_text,proof_type,enable_gps,latitude,longitude')
        .eq('route_id', teamRow.route_id)
        .order('order_index'),
      supabase.from('team_progress').select('checkpoint_id,status,points_awarded').eq('team_id', teamRow.id),
      supabase.from('kickoff_progress').select('*').eq('team_id', teamRow.id).maybeSingle()
    ])

    const progressByCheckpoint = new Map((progress as TeamProgressRow[] | null)?.map((p) => [p.checkpoint_id, p]) ?? [])

    const safeCheckpoints = ((checkpoints as TeamCheckpointRow[] | null) ?? []).map((checkpoint) => {
      const checkpointProgress = progressByCheckpoint.get(checkpoint.id)
      const solved = checkpointProgress?.status === 'verified'
      const postSolveStatus = checkpointProgress?.status && checkpointProgress.status !== 'pending'

      return {
        id: checkpoint.id,
        order_index: checkpoint.order_index,
        public_checkpoint_label: checkpoint.public_checkpoint_label ?? `Checkpoint ${checkpoint.order_index}`,
        participant_clue_text: checkpoint.participant_clue_text ?? '',
        participant_task_text_pre_solve: checkpoint.participant_task_text_pre_solve ?? '',
        participant_success_text_post_solve: checkpoint.participant_success_text_post_solve ?? '',
        proof_type: checkpoint.proof_type,
        enable_gps: checkpoint.enable_gps,
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude,
        solved,
        status: checkpointProgress?.status ?? 'pending',
        points_awarded: checkpointProgress?.points_awarded ?? 0,
        reveal: postSolveStatus
          ? {
              internal_location_name: checkpoint.internal_location_name,
              host_verification_task_text: checkpoint.host_verification_task_text
            }
          : null
      }
    })

    const routeRelation = teamRow.routes as { code: string } | { code: string }[] | null
    const routeCode = Array.isArray(routeRelation) ? (routeRelation[0]?.code ?? null) : (routeRelation?.code ?? null)

    return NextResponse.json({
      team: {
        id: teamRow.id,
        code: teamRow.code,
        name: teamRow.name,
        routeCode,
        kickoffChallenge: teamRow.kickoff_challenge
      },
      kickoff,
      checkpoints: safeCheckpoints,
      progress
    })
  }

  const { data } = await supabase.from('leaderboard_view').select('*').order('total_points', { ascending: false })
  return NextResponse.json(data)
}

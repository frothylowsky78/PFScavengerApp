import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { teamCode, checkpointId, unlockValue } = body
  const supabase = getSupabaseServer()

  const { data: team } = await supabase.from('teams').select('id').eq('code', teamCode).single()
  if (!team) return NextResponse.json({ message: 'Team not found.' }, { status: 404 })

  const { data: kickoff } = await supabase.from('kickoff_progress').select('status').eq('team_id', team.id).maybeSingle()
  if (!kickoff || !['submitted', 'verified'].includes(kickoff.status)) {
    return NextResponse.json({ message: 'Complete kickoff challenge before unlocking route clues.' }, { status: 400 })
  }

  const { data: cp } = await supabase.from('checkpoints').select('unlock_answer,unlock_qr').eq('id', checkpointId).single()
  if (!cp) return NextResponse.json({ message: 'Checkpoint not found' }, { status: 404 })

  const normalized = String(unlockValue || '').trim().toLowerCase()
  const matched = [cp.unlock_answer, cp.unlock_qr]
    .filter(Boolean)
    .some((value) => String(value).trim().toLowerCase() === normalized)

  if (!matched) return NextResponse.json({ message: 'Unlock code not valid yet.' }, { status: 400 })

  const { data: existing } = await supabase.from('team_progress').select('id').eq('team_id', team.id).eq('checkpoint_id', checkpointId).maybeSingle()
  if (existing) {
    await supabase.from('team_progress').update({ status: 'submitted' }).eq('id', existing.id)
  } else {
    await supabase.from('team_progress').insert({ team_id: team.id, checkpoint_id: checkpointId, status: 'submitted' })
  }

  return NextResponse.json({ message: 'Checkpoint unlocked. Upload proof for scoring.' })
}

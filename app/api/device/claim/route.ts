import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

type ClaimBody = {
  teamCode?: string
  deviceId?: string
  takeover?: boolean
}

export async function POST(request: NextRequest) {
  const { teamCode, deviceId, takeover }: ClaimBody = await request.json().catch(() => ({}))
  if (!teamCode || !deviceId) {
    return NextResponse.json({ message: 'teamCode and deviceId required' }, { status: 400 })
  }

  const supabase = getSupabaseServer()
  const { data: team } = await supabase
    .from('teams')
    .select('id, active_device_id, active_device_claimed_at')
    .eq('code', teamCode)
    .single()
  if (!team) return NextResponse.json({ message: 'Team not found' }, { status: 404 })

  const userAgent = request.headers.get('user-agent')
  const now = new Date().toISOString()

  const currentOwner = team.active_device_id
  const isOwner = currentOwner === deviceId
  const isUnclaimed = !currentOwner

  if (isUnclaimed || isOwner || takeover) {
    if (!isOwner) {
      if (currentOwner) {
        await supabase
          .from('team_devices')
          .update({ released_at: now })
          .eq('team_id', team.id)
          .eq('device_id', currentOwner)
          .is('released_at', null)
      }
      await supabase
        .from('teams')
        .update({ active_device_id: deviceId, active_device_claimed_at: now })
        .eq('id', team.id)
      await supabase.from('team_devices').insert({
        team_id: team.id,
        device_id: deviceId,
        claimed_at: now,
        last_seen_at: now,
        user_agent: userAgent
      })
    } else {
      await supabase
        .from('team_devices')
        .update({ last_seen_at: now })
        .eq('team_id', team.id)
        .eq('device_id', deviceId)
        .is('released_at', null)
    }

    return NextResponse.json({ owner: true, claimedAt: isOwner ? team.active_device_claimed_at : now })
  }

  return NextResponse.json({
    owner: false,
    activeSince: team.active_device_claimed_at
  })
}

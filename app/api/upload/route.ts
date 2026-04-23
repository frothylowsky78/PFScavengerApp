import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

const MAX_FILE_BYTES = 12 * 1024 * 1024
const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const teamCode = String(formData.get('teamCode') || '')
  const checkpointId = String(formData.get('checkpointId') || '')
  const answer = String(formData.get('answer') || '')
  const isKickoff = String(formData.get('isKickoff') || '') === 'true'
  const deviceId = String(formData.get('deviceId') || '')

  if (!deviceId) {
    return NextResponse.json({ message: 'Device not registered. Reload the page to claim this team.' }, { status: 400 })
  }

  const supabase = getSupabaseServer()
  const { data: team } = await supabase
    .from('teams')
    .select('id, active_device_id')
    .eq('code', teamCode)
    .single()
  if (!team) return NextResponse.json({ message: 'Team not found' }, { status: 404 })

  if (team.active_device_id && team.active_device_id !== deviceId) {
    return NextResponse.json(
      { message: 'Another phone is currently active for this team. Take over on your device to submit.' },
      { status: 409 }
    )
  }

  let proofUrl: string | null = null
  if (file && file.size > 0) {
    const ext = MIME_EXT[file.type]
    if (!ext) {
      return NextResponse.json(
        { message: 'Only JPG, PNG, WEBP, or GIF photos are allowed.' },
        { status: 400 }
      )
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { message: 'Photo is too large. Max 12 MB — try again with a smaller photo.' },
        { status: 400 }
      )
    }
    const bytes = new Uint8Array(await file.arrayBuffer())
    const prefix = isKickoff ? 'kickoff' : checkpointId
    const path = `proofs/${teamCode}/${prefix}-${Date.now()}.${ext}`
    const upload = await supabase.storage.from('hunt-proofs').upload(path, bytes, { contentType: file.type, upsert: false })
    if (upload.error) {
      return NextResponse.json(
        { message: 'Upload failed. Check your connection and retry.' },
        { status: 502 }
      )
    }
    const pub = supabase.storage.from('hunt-proofs').getPublicUrl(path)
    proofUrl = pub.data.publicUrl
  }

  if (isKickoff) {
    const answerText = answer.trim() || null
    if (!proofUrl && !answerText) {
      return NextResponse.json({ message: 'Submit a photo or enter your text answer to complete kickoff.' }, { status: 400 })
    }
    const { data: existing } = await supabase
      .from('kickoff_progress')
      .select('id, status')
      .eq('team_id', team.id)
      .maybeSingle()
    if (existing?.status === 'verified') {
      return NextResponse.json(
        { message: 'This checkpoint is already verified by the host.' },
        { status: 409 }
      )
    }
    const { error: upsertError } = await supabase.from('kickoff_progress').upsert(
      {
        team_id: team.id,
        proof_url: proofUrl,
        answer_text: answerText,
        status: 'submitted',
        completed_at: new Date().toISOString(),
        points_awarded: 0
      },
      { onConflict: 'team_id' }
    )
    if (upsertError) {
      return NextResponse.json({ message: 'Could not save submission. Try again.' }, { status: 500 })
    }
    return NextResponse.json({ message: 'Kickoff submitted. Route unlocked!' })
  }

  const answerText = answer.trim() || null
  if (!proofUrl && !answerText) {
    return NextResponse.json(
      { message: 'Submit a photo or enter your text answer for this checkpoint.' },
      { status: 400 }
    )
  }

  const { data: existing } = await supabase
    .from('team_progress')
    .select('id, status')
    .eq('team_id', team.id)
    .eq('checkpoint_id', checkpointId)
    .maybeSingle()
  if (existing?.status === 'verified') {
    return NextResponse.json(
      { message: 'This checkpoint is already verified by the host.' },
      { status: 409 }
    )
  }

  const { error: upsertError } = await supabase.from('team_progress').upsert(
    {
      team_id: team.id,
      checkpoint_id: checkpointId,
      answer_text: answerText,
      proof_url: proofUrl,
      status: 'submitted',
      points_awarded: 0,
      verified_at: null
    },
    { onConflict: 'team_id,checkpoint_id' }
  )
  if (upsertError) {
    return NextResponse.json({ message: 'Could not save submission. Try again.' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Proof uploaded. Next clue unlocked while host verification runs.' })
}

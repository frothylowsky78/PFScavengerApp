'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { TEAM_META } from '@/lib/team-meta'

type Checkpoint = {
  id: string
  order_index: number
  public_checkpoint_label: string
  participant_clue_text: string
  participant_task_text_pre_solve: string
  participant_success_text_post_solve: string
  proof_type: 'photo' | 'video'
  enable_gps: boolean
  latitude: number | null
  longitude: number | null
  solved: boolean
  status: 'pending' | 'submitted' | 'verified' | 'rejected'
  points_awarded: number
  reveal: {
    internal_location_name: string | null
    host_verification_task_text: string | null
  } | null
}

type ProgressRow = {
  checkpoint_id: string
  status: 'pending' | 'submitted' | 'verified' | 'rejected'
  points_awarded: number
}

type KickoffState = {
  status: 'pending' | 'submitted' | 'verified' | 'rejected'
  completed_at: string | null
  points_awarded: number
}

export default function TeamPage() {
  const params = useParams<{ teamCode: string }>()
  const team = TEAM_META.find((t) => t.code === params.teamCode)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [kickoffChallenge, setKickoffChallenge] = useState('')
  const [kickoffState, setKickoffState] = useState<KickoffState | null>(null)
  const [answer, setAnswer] = useState('')
  const [unlock, setUnlock] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [hint, setHint] = useState('')
  const [distanceFeet, setDistanceFeet] = useState<number | null>(null)

  const kickoffComplete = kickoffState?.status === 'submitted' || kickoffState?.status === 'verified'

  const activeIndex = useMemo(() => {
    const verifiedCount = progress.filter((p) => p.status === 'verified').length
    return Math.min(verifiedCount, Math.max(0, checkpoints.length - 1))
  }, [progress, checkpoints.length])

  useEffect(() => {
    if (!team) return
    fetch(`/api/leaderboard?team=${team.code}`).then(async (res) => {
      const data = await res.json()
      setCheckpoints(data.checkpoints ?? [])
      setProgress(data.progress ?? [])
      setKickoffChallenge(data.team?.kickoffChallenge ?? '')
      setKickoffState(data.kickoff ?? { status: 'pending', completed_at: null, points_awarded: 10 })
    })
  }, [team])

  if (!team) return <main className="p-4">Invalid team.</main>
  const activeCheckpoint = checkpoints[activeIndex]

  async function handleSubmitProof(isKickoff = false) {
    if (!team || (!isKickoff && !activeCheckpoint)) return
    const formData = new FormData()
    if (file) formData.append('file', file)
    formData.append('teamCode', team.code)
    formData.append('checkpointId', isKickoff ? 'kickoff' : activeCheckpoint!.id)
    formData.append('answer', answer)
    formData.append('isKickoff', String(isKickoff))

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setMessage(data.message)
    window.location.reload()
  }

  async function handleUnlock() {
    if (!team || !activeCheckpoint) return
    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamCode: team.code, checkpointId: activeCheckpoint.id, unlockValue: unlock })
    })
    const data = await res.json()
    setMessage(data.message)
  }

  function computeHint() {
    if (!activeCheckpoint?.enable_gps || !activeCheckpoint?.latitude || !activeCheckpoint?.longitude || !navigator.geolocation) {
      setHint('GPS hint unavailable for this checkpoint.')
      return
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const lat1 = position.coords.latitude
      const lon1 = position.coords.longitude
      const lat2 = activeCheckpoint.latitude!
      const lon2 = activeCheckpoint.longitude!
      const distance = getDistanceMeters(lat1, lon1, lat2, lon2)
      const feet = Math.round(distance * 3.28084)
      setDistanceFeet(feet)
      const direction = getCardinalDirection(lat1, lon1, lat2, lon2)

      if (distance < 60) setHint(`🔥 Very hot — about ${feet} ft away (${direction}).`)
      else if (distance < 160) setHint(`🙂 Warm — about ${feet} ft away (${direction}).`)
      else setHint(`🧊 Cold — about ${feet} ft away (${direction}).`)
    })
  }

  const checkpointScore = progress.reduce((acc, p) => acc + p.points_awarded, 0)
  const totalPoints = checkpointScore + (kickoffState?.points_awarded ?? 0)
  const elapsedMinutes = kickoffState?.completed_at ? Math.floor((Date.now() - new Date(kickoffState.completed_at).getTime()) / 60000) : 0

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      <header className="card" style={{ borderColor: team.hex }}>
        <h1 className="text-2xl font-bold" style={{ color: team.hex }}>{team.name}</h1>
        <p>Route {team.routeCode} · Score: {totalPoints}</p>
        <p className="text-sm text-slate-300">Kickoff: {kickoffComplete ? 'Complete' : 'Not complete'} · Elapsed: {elapsedMinutes} min</p>
      </header>

      <section className="card space-y-2">
        <p className="text-xs uppercase text-slate-400">Route progress</p>
        <ul className="space-y-1 text-sm">
          <li>Step 0 · Kickoff {kickoffComplete ? '✅' : '⏳'}</li>
          {checkpoints.map((checkpoint) => {
            const defaultLabel = checkpoint.order_index === checkpoints.length ? 'Final checkpoint' : `Checkpoint ${checkpoint.order_index}`
            const label = checkpoint.public_checkpoint_label || defaultLabel
            const solvedName = checkpoint.solved ? ` — ${checkpoint.reveal?.internal_location_name ?? ''}` : ''
            return (
              <li key={checkpoint.id}>
                {checkpoint.status === 'verified' ? '✅' : checkpoint.status === 'submitted' ? '🕓' : '🔒'} {label}{solvedName}
              </li>
            )
          })}
        </ul>
      </section>

      {!kickoffComplete ? (
        <section className="card space-y-3">
          <p className="text-xs uppercase text-slate-400">Step 0 · NOPSI Kickoff Challenge</p>
          <h2 className="text-xl font-semibold">Complete this before route clues unlock</h2>
          <p>{kickoffChallenge}</p>
          <p className="text-sm text-slate-300">Upload kickoff proof (photo or short video).</p>
          <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <button className="btn w-full bg-emerald-500 text-black" onClick={() => handleSubmitProof(true)}>Upload kickoff proof</button>
          {message ? <p className="font-semibold">{message}</p> : null}
        </section>
      ) : activeCheckpoint ? (
        <section className="card space-y-3">
          <p className="text-xs uppercase text-slate-400">{activeCheckpoint.public_checkpoint_label} · Route {team.routeCode}</p>
          <h2 className="text-xl font-semibold">Solve the clue to find your next stop</h2>
          <p className="text-slate-200">{activeCheckpoint.participant_clue_text}</p>
          <p className="text-sm text-amber-200">Task: {activeCheckpoint.participant_task_text_pre_solve}</p>
          <p className="text-sm">Proof required: {activeCheckpoint.proof_type}</p>

          {activeCheckpoint.status !== 'pending' ? (
            <div className="rounded-lg border border-emerald-600/40 bg-emerald-950/40 p-3 text-sm text-emerald-200">
              <p>{activeCheckpoint.participant_success_text_post_solve || 'Checkpoint solved. Await host scoring update if needed.'}</p>
              {activeCheckpoint.reveal?.internal_location_name ? (
                <p className="mt-1 text-emerald-100">Solved location: {activeCheckpoint.reveal.internal_location_name}</p>
              ) : null}
            </div>
          ) : null}

          <input className="w-full rounded-lg p-3 text-black" placeholder="Optional note for host verification" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <button className="btn w-full bg-emerald-500 text-black" onClick={() => handleSubmitProof(false)}>Upload proof</button>

          <input className="w-full rounded-lg p-3 text-black" placeholder="Enter QR token or your solve answer" value={unlock} onChange={(e) => setUnlock(e.target.value)} />
          <button className="btn w-full bg-indigo-500" onClick={handleUnlock}>Unlock next clue</button>

          <section className="rounded-lg border border-slate-700 p-3 space-y-2">
            <p className="text-sm font-semibold">GPS warmer/colder assist (optional)</p>
            <button className="btn w-full bg-amber-400 text-black" onClick={computeHint}>Refresh GPS hint</button>
            {hint ? <p>{hint}</p> : null}
            {distanceFeet ? <p className="text-sm text-slate-300">Approx distance: {distanceFeet} feet</p> : null}
          </section>

          {message ? <p className="font-semibold">{message}</p> : null}
        </section>
      ) : (
        <section className="card">No active checkpoint. Final reveal mode is waiting for host confirmation.</section>
      )}
    </main>
  )
}

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3
  const p1 = (lat1 * Math.PI) / 180
  const p2 = (lat2 * Math.PI) / 180
  const dP = ((lat2 - lat1) * Math.PI) / 180
  const dL = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dP / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dL / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function getCardinalDirection(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  const ns = toLat > fromLat ? 'north' : 'south'
  const ew = toLon > fromLon ? 'east' : 'west'
  return `${ns}-${ew}`
}

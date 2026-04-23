'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { TEAM_META, BUS_STARTS, type BusStartCode } from '@/lib/team-meta'

const SAFE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

async function normalizeImage(file: File): Promise<File> {
  if (SAFE_MIME.has(file.type)) return file
  const name = file.name.toLowerCase()
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
                 name.endsWith('.heic') || name.endsWith('.heif')
  if (!isHeic) return file
  const heic2any = (await import('heic2any')).default
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 })
  const out = Array.isArray(blob) ? blob[0] : blob
  const newName = file.name.replace(/\.(heic|heif)$/i, '') + '.jpg'
  return new File([out], newName, { type: 'image/jpeg' })
}

type DeviceClaim =
  | { status: 'checking' }
  | { status: 'owner'; claimedAt: string | null }
  | { status: 'locked'; activeSince: string | null }
  | { status: 'error'; message: string }

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'workmoney-scavenger-device-id'
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const fresh =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`
  window.localStorage.setItem(key, fresh)
  return fresh
}

type Checkpoint = {
  id: string
  order_index: number
  public_checkpoint_label: string
  participant_clue_text: string
  participant_task_text_pre_solve: string
  participant_success_text_post_solve: string
  proof_type: 'photo' | 'text'
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

type TeamApi = {
  kickoffChallenge: string
  kickoffProofType: 'photo' | 'text'
  busStart: BusStartCode | null
}

export default function TeamPage() {
  const params = useParams<{ teamCode: string }>()
  const team = TEAM_META.find((t) => t.code === params.teamCode)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [teamApi, setTeamApi] = useState<TeamApi>({ kickoffChallenge: '', kickoffProofType: 'photo', busStart: null })
  const [kickoffState, setKickoffState] = useState<KickoffState | null>(null)
  const [answer, setAnswer] = useState('')
  const [kickoffAnswer, setKickoffAnswer] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [kickoffFile, setKickoffFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [hint, setHint] = useState('')
  const [distanceFeet, setDistanceFeet] = useState<number | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('')
  const [deviceId, setDeviceId] = useState<string>('')
  const [claim, setClaim] = useState<DeviceClaim>({ status: 'checking' })
  const [takingOver, setTakingOver] = useState(false)

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId())
  }, [])

  const claimDevice = useCallback(
    async (takeover = false) => {
      if (!team || !deviceId) return
      try {
        const res = await fetch('/api/device/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamCode: team.code, deviceId, takeover })
        })
        const data = await res.json()
        if (!res.ok) {
          setClaim({ status: 'error', message: data.message || 'Unable to claim device.' })
          return
        }
        if (data.owner) {
          setClaim({ status: 'owner', claimedAt: data.claimedAt ?? null })
        } else {
          setClaim({ status: 'locked', activeSince: data.activeSince ?? null })
        }
      } catch {
        setClaim({ status: 'error', message: 'Network error claiming device.' })
      }
    },
    [team, deviceId]
  )

  useEffect(() => {
    if (!team || !deviceId) return
    claimDevice(false)
    const timer = window.setInterval(() => {
      claimDevice(false)
    }, 30000)
    return () => window.clearInterval(timer)
  }, [team, deviceId, claimDevice])

  const kickoffComplete = kickoffState?.status === 'submitted' || kickoffState?.status === 'verified'

  const activeIndex = useMemo(() => {
    if (checkpoints.length === 0) return 0
    const progressByCheckpoint = new Map(progress.map((p) => [p.checkpoint_id, p.status]))
    const firstBlockedIndex = checkpoints.findIndex((checkpoint) => {
      const status = progressByCheckpoint.get(checkpoint.id)
      return status !== 'submitted' && status !== 'verified'
    })
    if (firstBlockedIndex >= 0) return firstBlockedIndex
    return checkpoints.length - 1
  }, [progress, checkpoints])

  const refreshTeamState = useCallback(async () => {
    if (!team) return
    const res = await fetch(`/api/leaderboard?team=${team.code}`, { cache: 'no-store' })
    const data = await res.json()
    setCheckpoints(data.checkpoints ?? [])
    setProgress(data.progress ?? [])
    setTeamApi({
      kickoffChallenge: data.team?.kickoffChallenge ?? '',
      kickoffProofType: data.team?.kickoffProofType ?? 'photo',
      busStart: data.team?.busStart ?? null
    })
    setKickoffState(data.kickoff ?? { status: 'pending', completed_at: null, points_awarded: 10 })
    setLastSyncedAt(new Date().toLocaleTimeString())
  }, [team])

  useEffect(() => {
    if (!team) return
    refreshTeamState()
    const timer = window.setInterval(() => {
      refreshTeamState()
    }, 15000)
    return () => window.clearInterval(timer)
  }, [team, refreshTeamState])

  if (!team) return <main className="p-4">Invalid team.</main>
  const activeCheckpoint = checkpoints[activeIndex]
  const allCheckpointsDone =
    checkpoints.length > 0 &&
    checkpoints.every((c) => {
      const row = progress.find((p) => p.checkpoint_id === c.id)
      return row?.status === 'submitted' || row?.status === 'verified'
    })

  async function handleTakeover() {
    setTakingOver(true)
    await claimDevice(true)
    setTakingOver(false)
    await refreshTeamState()
  }

  async function handleSubmitKickoff() {
    if (!team) return
    const formData = new FormData()
    if (kickoffFile) formData.append('file', kickoffFile)
    formData.append('teamCode', team.code)
    formData.append('checkpointId', 'kickoff')
    formData.append('answer', kickoffAnswer)
    formData.append('isKickoff', 'true')
    formData.append('deviceId', deviceId)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setMessage(data.message)
    if (res.status === 409) {
      await claimDevice(false)
      return
    }
    await refreshTeamState()
  }

  async function handleSubmitCheckpoint() {
    if (!team || !activeCheckpoint) return
    const formData = new FormData()
    if (file) formData.append('file', file)
    formData.append('teamCode', team.code)
    formData.append('checkpointId', activeCheckpoint.id)
    formData.append('answer', answer)
    formData.append('isKickoff', 'false')
    formData.append('deviceId', deviceId)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setMessage(data.message)
    if (res.status === 409) {
      await claimDevice(false)
      return
    }
    await refreshTeamState()
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
      if (distance < 60) setHint(`Very hot — about ${feet} ft away (${direction}).`)
      else if (distance < 160) setHint(`Warm — about ${feet} ft away (${direction}).`)
      else setHint(`Cold — about ${feet} ft away (${direction}).`)
    })
  }

  const checkpointScore = progress.reduce((acc, p) => acc + p.points_awarded, 0)
  const totalPoints = checkpointScore + (kickoffState?.points_awarded ?? 0)
  const elapsedMinutes = kickoffState?.completed_at ? Math.floor((Date.now() - new Date(kickoffState.completed_at).getTime()) / 60000) : 0
  const busStart = teamApi.busStart ?? team.busStart
  const busInfo = busStart ? BUS_STARTS[busStart] : null

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      <header className="card" style={{ borderColor: team.hex }}>
        <div className="flex items-center gap-3">
          <span className="inline-block h-6 w-6 rounded-full border border-slate-700" style={{ backgroundColor: team.hex }} aria-hidden />
          <h1 className="text-2xl font-bold" style={{ color: team.hex }}>{team.name}</h1>
        </div>
        <p className="mt-1">Route {team.routeCode} · Score: {totalPoints}</p>
        {busInfo ? (
          <p className="text-sm text-slate-300">{busInfo.name}</p>
        ) : null}
        <p className="text-sm text-slate-300">Kickoff: {kickoffComplete ? 'Complete' : 'Not complete'} · Elapsed: {elapsedMinutes} min</p>
        <p className="text-xs text-slate-400">Auto-refresh: every 15s{lastSyncedAt ? ` · Last synced ${lastSyncedAt}` : ''}</p>
      </header>

      <section className="card space-y-2">
        <p className="text-xs uppercase text-slate-400">Route progress</p>
        <ul className="space-y-1 text-sm">
          <li>Step 0 · Kickoff {kickoffComplete ? '✅' : '⏳'}</li>
          {checkpoints.map((checkpoint) => {
            const isFinal = checkpoint.order_index === checkpoints.length
            const label = isFinal ? 'Final checkpoint' : `Checkpoint ${checkpoint.order_index}`
            const icon = checkpoint.status === 'verified' ? '✅' : checkpoint.status === 'submitted' ? '🕓' : checkpoint.status === 'rejected' ? '❌' : '🔒'
            return (
              <li key={checkpoint.id}>{icon} {label}</li>
            )
          })}
        </ul>
      </section>

      {claim.status === 'locked' ? (
        <section className="card border border-rose-600/50 bg-rose-950/30 space-y-3">
          <h2 className="text-lg font-semibold text-rose-200">Another phone is active for this team</h2>
          <p className="text-sm text-rose-100">
            Only one phone per team can submit at a time. You can watch progress here, but submissions are locked on this device
            {claim.activeSince ? ` (active phone claimed at ${new Date(claim.activeSince).toLocaleTimeString()})` : ''}.
          </p>
          <p className="text-sm text-rose-100">
            If the other phone is out of reach or the battery died, take over from this device. The previous phone will be locked out until it takes over again.
          </p>
          <button className="btn w-full bg-rose-500 text-white" disabled={takingOver} onClick={handleTakeover}>
            {takingOver ? 'Taking over…' : 'Take over this device'}
          </button>
        </section>
      ) : null}

      {claim.status === 'error' ? (
        <section className="card border border-amber-500/50 bg-amber-950/30">
          <p className="text-sm text-amber-100">{claim.message} Retrying automatically…</p>
        </section>
      ) : null}

      {claim.status !== 'owner' ? null : !kickoffComplete ? (
        <section className="card space-y-3">
          <p className="text-xs uppercase text-slate-400">Step 0 · Kickoff Challenge</p>
          <h2 className="text-xl font-semibold">Complete this before route clues unlock</h2>
          <p>{teamApi.kickoffChallenge}</p>
          {teamApi.kickoffProofType === 'text' ? (
            <>
              <p className="text-sm text-slate-300">Enter your team&apos;s answer below.</p>
              <textarea
                className="w-full rounded-lg p-3 text-black"
                rows={3}
                placeholder="Type your answer here"
                value={kickoffAnswer}
                onChange={(e) => setKickoffAnswer(e.target.value)}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-slate-300">Upload your kickoff photo.</p>
              <input type="file" accept="image/*" onChange={async (e) => {
                const picked = e.target.files?.[0] ?? null
                if (!picked) { setKickoffFile(null); return }
                try {
                  setMessage('Converting photo…')
                  const normalized = await normalizeImage(picked)
                  setKickoffFile(normalized)
                  setMessage('')
                } catch {
                  setKickoffFile(null)
                  setMessage('Could not convert HEIC photo. On your iPhone, open Settings → Camera → Formats → Most Compatible and re-take the photo.')
                }
              }} />
            </>
          )}
          <button className="btn w-full bg-emerald-500 text-black" onClick={handleSubmitKickoff}>Submit kickoff</button>
          {message ? <p className="font-semibold">{message}</p> : null}
        </section>
      ) : allCheckpointsDone ? (
        <section className="card border border-emerald-600/50 bg-emerald-950/30 space-y-2">
          <p className="text-xs uppercase text-emerald-300">Finish line</p>
          <h2 className="text-2xl font-bold text-emerald-100">You made it to The Cabin!</h2>
          <p className="text-sm text-emerald-100">
            All checkpoints submitted. Find a WorkMoney host inside for the wrap-up and final reveal.
          </p>
          <p className="text-xs text-emerald-200">Total elapsed since kickoff: {elapsedMinutes} min · Score so far: {totalPoints}</p>
        </section>
      ) : activeCheckpoint ? (
        <section className="card space-y-3">
          <p className="text-xs uppercase text-slate-400">{activeCheckpoint.order_index === checkpoints.length ? 'Final checkpoint' : `Checkpoint ${activeCheckpoint.order_index}`} · Route {team.routeCode}</p>
          <h2 className="text-xl font-semibold">Solve the clue to find your next stop</h2>
          <p className="text-slate-200">{activeCheckpoint.participant_clue_text}</p>
          <p className="text-sm text-amber-200">Task: {activeCheckpoint.participant_task_text_pre_solve}</p>
          <p className="text-sm">Proof required: {activeCheckpoint.proof_type === 'text' ? 'Text answer' : 'Photo'}</p>

          {activeCheckpoint.status === 'rejected' ? (
            <div className="rounded-lg border border-rose-600/40 bg-rose-950/40 p-3 text-sm text-rose-200">
              <p>This proof was rejected by the host. Please submit a clearer proof for this checkpoint to continue.</p>
            </div>
          ) : activeCheckpoint.status !== 'pending' ? (
            <div className="rounded-lg border border-emerald-600/40 bg-emerald-950/40 p-3 text-sm text-emerald-200">
              <p>{activeCheckpoint.participant_success_text_post_solve || 'Checkpoint solved. Await host scoring update if needed.'}</p>
              {activeCheckpoint.reveal?.internal_location_name ? (
                <p className="mt-1 text-emerald-100">Solved location: {activeCheckpoint.reveal.internal_location_name}</p>
              ) : null}
            </div>
          ) : null}

          <input className="w-full rounded-lg p-3 text-black" placeholder="Optional note or answer text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          {activeCheckpoint.proof_type === 'photo' ? (
            <input type="file" accept="image/*" onChange={async (e) => {
              const picked = e.target.files?.[0] ?? null
              if (!picked) { setFile(null); return }
              try {
                setMessage('Converting photo…')
                const normalized = await normalizeImage(picked)
                setFile(normalized)
                setMessage('')
              } catch {
                setFile(null)
                setMessage('Could not convert HEIC photo. On your iPhone, open Settings → Camera → Formats → Most Compatible and re-take the photo.')
              }
            }} />
          ) : null}
          <button className="btn w-full bg-emerald-500 text-black" onClick={handleSubmitCheckpoint}>Submit (auto-advances next clue)</button>

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

      <section className="card space-y-1">
        <p className="text-xs uppercase text-slate-400">Need help?</p>
        <p className="text-sm text-slate-200"><strong>Carl Moczydlowsky</strong></p>
        <a href="tel:+16192049010" className="text-sm text-emerald-300 underline underline-offset-2">619.204.9010</a>
      </section>
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

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { TEAM_META } from '@/lib/team-meta'

type Checkpoint = {
  id: string
  title: string
  clue_text: string
  unlock_answer: string | null
  unlock_qr: string | null
  latitude: number | null
  longitude: number | null
  order_index: number
}

type ProgressRow = {
  checkpoint_id: string
  status: 'pending' | 'submitted' | 'verified' | 'rejected'
  points_awarded: number
}

export default function TeamPage() {
  const params = useParams<{ teamCode: string }>()
  const team = TEAM_META.find((t) => t.code === params.teamCode)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [answer, setAnswer] = useState('')
  const [unlock, setUnlock] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [hint, setHint] = useState('')

  const activeIndex = useMemo(() => {
    const verifiedCount = progress.filter((p) => p.status === 'verified').length
    return Math.min(verifiedCount, checkpoints.length - 1)
  }, [progress, checkpoints.length])

  useEffect(() => {
    if (!team) return
    fetch(`/api/leaderboard?team=${team.code}`).then(async (res) => {
      const data = await res.json()
      setCheckpoints(data.checkpoints ?? [])
      setProgress(data.progress ?? [])
    })
  }, [team])

  if (!team) return <main className="p-4">Invalid team.</main>
  const activeCheckpoint = checkpoints[activeIndex]

  async function handleSubmitProof() {
    if (!team || !activeCheckpoint) return
    const formData = new FormData()
    if (file) formData.append('file', file)
    formData.append('teamCode', team.code)
    formData.append('checkpointId', activeCheckpoint.id)
    formData.append('answer', answer)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setMessage(data.message)
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
    if (!activeCheckpoint?.latitude || !activeCheckpoint?.longitude || !navigator.geolocation) {
      setHint('GPS hint unavailable for this clue.')
      return
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const distance = getDistanceMeters(
        position.coords.latitude,
        position.coords.longitude,
        activeCheckpoint.latitude!,
        activeCheckpoint.longitude!
      )
      if (distance < 60) setHint('🔥 You are very hot!')
      else if (distance < 160) setHint('🙂 Warm. Keep going.')
      else setHint('🧊 Cold. Re-check your direction.')
    })
  }

  const totalPoints = progress.reduce((acc, p) => acc + p.points_awarded, 0)

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto space-y-4">
      <header className="card" style={{ borderColor: team.hex }}>
        <h1 className="text-2xl font-bold" style={{ color: team.hex }}>{team.name}</h1>
        <p>Route {team.routeCode} · Score: {totalPoints}</p>
      </header>

      {activeCheckpoint ? (
        <section className="card space-y-3">
          <p className="text-xs uppercase text-slate-400">Current checkpoint</p>
          <h2 className="text-xl font-semibold">{activeCheckpoint.title}</h2>
          <p className="text-slate-200">{activeCheckpoint.clue_text}</p>

          <input className="w-full rounded-lg p-3 text-black" placeholder="Optional answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <button className="btn w-full bg-emerald-500 text-black" onClick={handleSubmitProof}>Upload proof</button>

          <input className="w-full rounded-lg p-3 text-black" placeholder="QR code or unlock answer" value={unlock} onChange={(e) => setUnlock(e.target.value)} />
          <button className="btn w-full bg-indigo-500" onClick={handleUnlock}>Unlock next clue</button>
          <button className="btn w-full bg-amber-400 text-black" onClick={computeHint}>GPS warmer/colder hint</button>
          {hint ? <p>{hint}</p> : null}
          {message ? <p className="font-semibold">{message}</p> : null}
        </section>
      ) : (
        <section className="card">No active checkpoint. Proceed to Mulate&apos;s for final reveal!</section>
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

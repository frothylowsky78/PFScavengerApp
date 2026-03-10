import { writeFileSync } from 'node:fs'
import { TEAM_META } from '../lib/team-meta'
import { kickoffChallenges, routeStops } from './seed'

const rows: string[] = []
const header = [
  'team_code',
  'team_name',
  'team_route',
  'team_color_hex',
  'team_text_color',
  'kickoff_challenge',
  'checkpoint_number',
  'public_checkpoint_label',
  'internal_location_name',
  'answer_key',
  'difficulty_level',
  'proof_type',
  'points',
  'participant_task_pre_solve',
  'participant_success_text_post_solve',
  'host_verification_instruction',
  'clue_text',
  'latitude',
  'longitude'
]

const esc = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
rows.push(header.join(','))

for (const team of TEAM_META) {
  const stops = routeStops[team.routeCode]

  stops.forEach((stop, index) => {
    rows.push(
      [
        team.code,
        team.name,
        team.routeCode,
        team.hex,
        team.text,
        kickoffChallenges[team.code],
        index + 1,
        stop.publicCheckpointLabel,
        stop.internalLocationName,
        stop.answerText,
        stop.difficultyLevel,
        stop.proofType,
        stop.points,
        stop.participantTaskTextPreSolve,
        stop.participantSuccessTextPostSolve,
        stop.hostVerificationTaskText,
        stop.participantClueText,
        stop.lat,
        stop.lng
      ].map(esc).join(',')
    )
  })
}

writeFileSync('clues_export.csv', `${rows.join('\n')}\n`, 'utf8')
console.log(`Wrote clues_export.csv with ${rows.length - 1} rows.`)

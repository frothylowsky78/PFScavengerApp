import { routeStops } from './seed'

function normalize(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function includesAnswer(haystack: string, answer: string) {
  const h = normalize(haystack)
  const a = normalize(answer)
  return h.includes(a)
}

const failures: string[] = []

for (const [routeCode, stops] of Object.entries(routeStops)) {
  for (const [index, stop] of stops.entries()) {
    const key = `${routeCode}${index + 1}`

    if (includesAnswer(stop.participantClueText, stop.answerText)) {
      failures.push(`${key}: participant_clue_text contains answer_text`)
    }

    if (includesAnswer(stop.participantTaskTextPreSolve, stop.answerText)) {
      failures.push(`${key}: participant_task_text_pre_solve contains answer_text`)
    }

    if (normalize(stop.publicCheckpointLabel) === normalize(stop.internalLocationName)) {
      failures.push(`${key}: public_checkpoint_label matches internal_location_name`)
    }

    if (includesAnswer(stop.publicCheckpointLabel, stop.answerText)) {
      failures.push(`${key}: public_checkpoint_label reveals answer_text`)
    }
  }
}

if (failures.length > 0) {
  console.error('❌ Seed anti-reveal validation failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('✅ Seed anti-reveal validation passed')

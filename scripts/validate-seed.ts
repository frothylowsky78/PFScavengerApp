import { routeStops } from './seed'

function normalize(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function includesAnswer(haystack: string, answer: string) {
  const h = normalize(haystack)
  const a = normalize(answer)
  if (!a) return false
  return h.includes(a)
}

const failures: string[] = []

for (const [routeCode, stops] of Object.entries(routeStops)) {
  for (const [index, stop] of stops.entries()) {
    const key = `${routeCode}${index + 1}`

    // Rule 1: clue must not contain exact answer_text
    if (includesAnswer(stop.participantClueText, stop.answerText)) {
      failures.push(`${key}: participant_clue_text contains answer_text ("${stop.answerText}")`)
    }

    // Rule 2: pre-solve task must not contain exact answer_text
    if (includesAnswer(stop.participantTaskTextPreSolve, stop.answerText)) {
      failures.push(`${key}: participant_task_text_pre_solve contains answer_text ("${stop.answerText}")`)
    }

    // Rule 3: public label must not equal internal location name
    if (normalize(stop.publicCheckpointLabel) === normalize(stop.internalLocationName)) {
      failures.push(`${key}: public_checkpoint_label equals internal_location_name`)
    }

    // Rule 4: public label must be a generic "Checkpoint N" / "Final checkpoint"
    const label = normalize(stop.publicCheckpointLabel)
    const isGeneric =
      label === 'final checkpoint' || /^checkpoint \d+$/.test(label)
    if (!isGeneric) {
      failures.push(`${key}: public_checkpoint_label must be generic (got "${stop.publicCheckpointLabel}")`)
    }

    // Rule 5: public label must not reveal answer_text
    if (includesAnswer(stop.publicCheckpointLabel, stop.answerText)) {
      failures.push(`${key}: public_checkpoint_label reveals answer_text`)
    }

    // Rule 6: final stop must carry is_final=true; non-final must be false
    const expectedFinal = index === stops.length - 1
    if (stop.isFinal !== expectedFinal) {
      failures.push(`${key}: is_final=${stop.isFinal} does not match position (expected ${expectedFinal})`)
    }

    // Rule 7: proof_type must be photo or text
    if (stop.proofType !== 'photo' && stop.proofType !== 'text') {
      failures.push(`${key}: proof_type must be 'photo' or 'text' (got "${stop.proofType}")`)
    }
  }
}

if (failures.length > 0) {
  console.error('❌ Seed anti-reveal validation failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('✅ Seed anti-reveal validation passed')

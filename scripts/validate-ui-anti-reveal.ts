import { readFileSync } from 'node:fs'

const source = readFileSync('app/participant/[teamCode]/page.tsx', 'utf8')
const failures: string[] = []

const bannedSnippets = [
  'activeCheckpoint.title',
  'activeCheckpoint.clue_text',
  'activeCheckpoint.task_text',
  'unlock_answer',
]

for (const snippet of bannedSnippets) {
  if (source.includes(snippet)) {
    failures.push(`participant page contains banned pre-solve snippet: ${snippet}`)
  }
}

if (!source.includes('activeCheckpoint.reveal?.internal_location_name')) {
  failures.push('participant page is not using post-solve reveal field as expected')
}

if (!source.includes("activeCheckpoint.status !== 'pending'")) {
  failures.push('participant page is missing explicit post-solve status gate')
}

if (failures.length > 0) {
  console.error('❌ UI anti-reveal validation failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log('✅ UI anti-reveal validation passed')

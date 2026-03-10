import { createClient } from '@supabase/supabase-js'
import { TEAM_META } from '../lib/team-meta'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const routeCodes = ['A', 'B', 'C', 'D', 'E', 'F']

const kickoffChallenges: Record<string, string> = {
  pink: 'Take a creative team selfie with the NOPSI sign.',
  red: 'Find a historic detail in the hotel lobby and describe it in 5 words.',
  yellow: 'Record a 5-second hype chant for your team.',
  purple: 'Capture a photo of something purple near NOPSI.',
  green: 'Get the whole team to do a synchronized pose photo.',
  silver: 'Find a reflective surface and capture your team reflection.',
  black: 'Take a cinematic walking video leaving NOPSI.',
  white: 'Capture a bright-white object and frame it artistically.',
  blue: 'Record the team saying “Powerflex!” in unison.'
}

const routeStops = [
  { title: 'Jackson Square', clue: 'Where artists and iron fences frame the heart of the Quarter.', lat: 29.9574, lng: -90.0623 },
  { title: 'French Market', clue: 'Seek the buzzing open-air market by Decatur.', lat: 29.9615, lng: -90.0572 },
  { title: 'Cafe du Monde', clue: 'Powdered sugar in the air near river breeze.', lat: 29.9577, lng: -90.0621 },
  { title: 'Bourbon Marker', clue: 'Music spills where neon meets balconies.', lat: 29.9583, lng: -90.065 },
  { title: "Mulate's", clue: 'Final destination for the reveal.', lat: 29.9435, lng: -90.0703 }
]

async function run() {
  const routeIdByCode: Record<string, string> = {}
  for (const code of routeCodes) {
    const { data } = await supabase.from('routes').upsert({ code, name: `Route ${code}` }, { onConflict: 'code' }).select('id,code').single()
    if (data) routeIdByCode[code] = data.id
  }

  for (const team of TEAM_META) {
    await supabase.from('teams').upsert({
      code: team.code,
      name: team.name,
      color_hex: team.hex,
      route_id: routeIdByCode[team.routeCode],
      kickoff_challenge: kickoffChallenges[team.code]
    }, { onConflict: 'code' })
  }

  for (const code of routeCodes) {
    const routeId = routeIdByCode[code]
    for (const [index, stop] of routeStops.entries()) {
      await supabase.from('checkpoints').upsert({
        route_id: routeId,
        order_index: index,
        title: stop.title,
        clue_text: stop.clue,
        unlock_answer: `${code}${index + 1}`,
        unlock_qr: `QR-${code}-${index + 1}`,
        latitude: stop.lat,
        longitude: stop.lng,
        points: index === routeStops.length - 1 ? 150 : 100
      }, { onConflict: 'route_id,order_index' })
    }
  }

  console.log('Seed complete')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

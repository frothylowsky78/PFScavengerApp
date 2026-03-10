import { createClient } from '@supabase/supabase-js'
import { TEAM_META } from '../lib/team-meta'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const routeCodes = ['A', 'B', 'C', 'D', 'E', 'F']

const kickoffChallenges: Record<string, string> = {
  pink: 'Find the vintage NOPSI generator sculpture in the lobby and take a team selfie.',
  red: 'Ask a hotel staff member for their favorite New Orleans restaurant and record the answer.',
  yellow: 'Take a photo of something gold or brass inside NOPSI.',
  purple: 'Create a quick 5-second jazz pose video in the lobby.',
  green: 'Find a plant or greenery inside or just outside the hotel and take a team photo.',
  silver: 'Find something metallic or reflective in the lobby and snap a photo.',
  black: 'Take a dramatic film-noir style photo in the NOPSI entrance.',
  white: 'Take a bright group selfie under the lobby lights.',
  blue: 'Find something blue in the lobby or a street sign outside and photograph it.'
}

type SeedStop = {
  title: string
  answer: string
  clue: string
  task: string
  proofType: 'photo' | 'video'
  points: number
  lat: number
  lng: number
}

const routeStops: Record<string, SeedStop[]> = {
  A: [
    { title: 'Lafayette Square', answer: 'lafayette square', clue: 'Your hunt begins where oak trees shade the suits. Across from the building where city leaders once addressed the crowd. Find the park named for a French hero of war.', task: 'Take a team photo pointing dramatically at the statue in the center.', proofType: 'photo', points: 10, lat: 29.9496, lng: -90.0704 },
    { title: 'Bourbon Street Sign', answer: 'bourbon street', clue: 'Where balconies lean and the music is loud, this street is famous for drawing a crowd. Find the sign with a name known worldwide.', task: 'Take a team photo with a Bourbon Street sign.', proofType: 'photo', points: 10, lat: 29.9581, lng: -90.0656 },
    { title: 'Jackson Square', answer: 'jackson square', clue: 'Artists line the fence with paintings for sale. A general on horseback tells a historic tale. The cathedral towers behind the scene.', task: 'Take a team photo with Andrew Jackson in the background.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623 },
    { title: 'Café du Monde', answer: 'cafe du monde', clue: 'Powdered sugar floats like snow in July. Find the café where beignets reign supreme.', task: 'Show a powdered sugar mustache in a team photo.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621 },
    { title: "Mulate's", answer: 'mulates', clue: "The hunt ends where Cajun music plays and dancing fills the room. Head toward the river and find the Zydeco finish line.", task: "Record a 10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  B: [
    { title: 'Canal Street Streetcar', answer: 'canal street', clue: 'Tracks run through the city where streetcars glide. Find the moving green machine downtown.', task: 'Take a photo of a moving streetcar.', proofType: 'photo', points: 10, lat: 29.9537, lng: -90.0716 },
    { title: 'Royal Street', answer: 'royal street', clue: "Not Bourbon's chaos but elegance instead, where artists and antiques fill the street ahead.", task: 'Capture a short video of a teammate dancing near a street musician.', proofType: 'video', points: 15, lat: 29.9589, lng: -90.0645 },
    { title: 'Jackson Square', answer: 'jackson square', clue: 'Find the square where cathedral spires rise above artists and iron fences.', task: 'Take a team photo in front of St. Louis Cathedral or the Jackson statue.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623 },
    { title: "Pat O'Brien's Flaming Fountain", answer: 'pat obrien', clue: 'In a courtyard hidden behind a famous bar, a fountain burns like a tiny star.', task: "Pose like you're in the middle of a hurricane around the fountain.", proofType: 'photo', points: 15, lat: 29.9579, lng: -90.0653 },
    { title: "Mulate's", answer: 'mulates', clue: 'Now follow the river side energy to a Cajun celebration. Your finish line has food, music, and dancing.', task: "Record a 10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  C: [
    { title: 'Gallier Hall', answer: 'gallier hall', clue: 'White columns and civic history mark this grand old building on St. Charles.', task: 'Count the columns and take a team photo.', proofType: 'photo', points: 10, lat: 29.9516, lng: -90.0702 },
    { title: 'Bourbon Street Sign', answer: 'bourbon street', clue: "Music, balconies, and bright energy make this the city's most notorious street.", task: 'Take a group photo with a Bourbon Street sign.', proofType: 'photo', points: 10, lat: 29.9581, lng: -90.0656 },
    { title: 'Café du Monde', answer: 'cafe du monde', clue: 'Find the place where coffee and powdered sugar rule the morning and the night.', task: 'Show a beignet or powdered sugar evidence in your photo.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621 },
    { title: 'French Market', answer: 'french market', clue: 'Stalls, souvenirs, and local flavor stretch along the edge of the Quarter. Find the market that has served the city for generations.', task: 'Take a team photo with the French Market sign or vendor stalls.', proofType: 'photo', points: 15, lat: 29.9615, lng: -90.0572 },
    { title: "Mulate's", answer: 'mulates', clue: 'Leave the Quarter and head for the Cajun finish. Music and dinner await at the final stop.', task: "Record a 10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  D: [
    { title: 'Canal Street', answer: 'canal street', clue: 'Begin where downtown widens and the Quarter starts to hum. Look for rails, storefronts, and constant motion.', task: 'Take a team shot with Canal Street in the background.', proofType: 'photo', points: 10, lat: 29.9537, lng: -90.0716 },
    { title: "Pat O'Brien's Flaming Fountain", answer: 'pat obrien', clue: 'A hidden courtyard, a famous drink, and a flame that dances above water.', task: 'Create your best storm-blown group pose.', proofType: 'photo', points: 15, lat: 29.9579, lng: -90.0653 },
    { title: 'Royal Street', answer: 'royal street', clue: 'Find the elegant street where buskers and galleries replace the Bourbon roar.', task: 'Film 5 seconds of a teammate giving their best jazz hands.', proofType: 'video', points: 15, lat: 29.9589, lng: -90.0645 },
    { title: 'Jackson Square', answer: 'jackson square', clue: 'History, artists, and cathedral views all collide here.', task: 'Take a photo with the cathedral or square fencing.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623 },
    { title: "Mulate's", answer: 'mulates', clue: 'Time to finish strong. Head toward the riverfront warehouse district for your Cajun ending.', task: "Record a 10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  E: [
    { title: 'Lafayette Square', answer: 'lafayette square', clue: 'Start in the shady square where downtown workers and old oaks meet.', task: 'Take a team photo with the square behind you.', proofType: 'photo', points: 10, lat: 29.9496, lng: -90.0704 },
    { title: 'Royal Street', answer: 'royal street', clue: 'This street trades neon for charm, with antiques, galleries, and musicians.', task: 'Snap a photo of the most elegant balcony or storefront you can find.', proofType: 'photo', points: 10, lat: 29.9589, lng: -90.0645 },
    { title: 'French Market', answer: 'french market', clue: 'Head toward the long historic market where food, gifts, and local finds line the way.', task: 'Take a group photo by the French Market sign or a row of stalls.', proofType: 'photo', points: 15, lat: 29.9615, lng: -90.0572 },
    { title: 'Café du Monde', answer: 'cafe du monde', clue: "Follow the scent of coffee and sugar to one of New Orleans' most famous bites.", task: 'Show your best powdered sugar mustache in a photo.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621 },
    { title: "Mulate's", answer: 'mulates', clue: 'End the hunt with Cajun flavor and a little dancing near the river.', task: "Record a 10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  F: [
    { title: 'Royal Street', answer: 'royal street', clue: 'Begin where galleries and street musicians create a quieter rhythm than Bourbon. Find the elegant street of art and iron balconies.', task: 'Take a team photo with a street performer or gallery sign.', proofType: 'photo', points: 10, lat: 29.9589, lng: -90.0645 },
    { title: 'Jackson Square', answer: 'jackson square', clue: 'Follow the music until cathedral towers appear and artists line the iron fence.', task: 'Take a team photo with St. Louis Cathedral behind you.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623 },
    { title: 'Café du Monde', answer: 'cafe du monde', clue: 'Powdered sugar floats through the air where beignets rule the Quarter.', task: 'Photo of a powdered sugar mustache.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621 },
    { title: 'French Market', answer: 'french market', clue: 'Find the historic market stretching along the edge of the Quarter with stalls and souvenirs.', task: 'Group photo near the French Market sign.', proofType: 'photo', points: 15, lat: 29.9615, lng: -90.0572 },
    { title: "Mulate's", answer: 'mulates', clue: 'Leave the Quarter and head toward the river warehouses for Cajun music and your final celebration.', task: 'Record a Cajun dance video.', proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ]
}

async function run() {
  const routeIdByCode: Record<string, string> = {}
  for (const code of routeCodes) {
    const { data } = await supabase.from('routes').upsert({ code, name: `Route ${code}` }, { onConflict: 'code' }).select('id,code').single()
    if (data) routeIdByCode[code] = data.id
  }

  for (const team of TEAM_META) {
    const { data } = await supabase.from('teams').upsert({
      code: team.code,
      name: team.name,
      color_hex: team.hex,
      route_id: routeIdByCode[team.routeCode],
      kickoff_challenge: kickoffChallenges[team.code]
    }, { onConflict: 'code' }).select('id').single()

    if (data?.id) {
      await supabase.from('kickoff_progress').upsert({ team_id: data.id, status: 'pending', points_awarded: 10 }, { onConflict: 'team_id' })
    }
  }

  for (const code of routeCodes) {
    const routeId = routeIdByCode[code]
    await supabase.from('checkpoints').delete().eq('route_id', routeId)
    for (const [index, stop] of routeStops[code].entries()) {
      await supabase.from('checkpoints').insert({
        route_id: routeId,
        order_index: index + 1,
        title: stop.title,
        clue_text: stop.clue,
        task_text: stop.task,
        unlock_answer: stop.answer,
        unlock_qr: `QR-${code}-${index + 1}`,
        latitude: stop.lat,
        longitude: stop.lng,
        enable_gps: true,
        proof_type: stop.proofType,
        points: stop.points
      })
    }
  }

  console.log('Seed complete')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

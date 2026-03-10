import { pathToFileURL } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { TEAM_META } from '../lib/team-meta'

export const routeCodes = ['A', 'B', 'C', 'D', 'E', 'F']

export const kickoffChallenges: Record<string, string> = {
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

export type SeedStop = {
  publicCheckpointLabel: string
  internalLocationName: string
  answerText: string
  participantClueText: string
  participantTaskTextPreSolve: string
  participantSuccessTextPostSolve: string
  hostVerificationTaskText: string
  proofType: 'photo' | 'video'
  points: number
  lat: number
  lng: number
  difficultyLevel: 'medium' | 'hard'
}

function buildClue(lines: string[], finalChallengeSentence: string) {
  return [...lines, finalChallengeSentence].join(' ')
}

const locationClues = {
  lafayette: (task: string) => buildClue([
    'Begin where office towers give way to a patch of green that feels older than the surrounding glass and traffic.',
    'Large oaks cast shade over lunch crowds while a raised monument anchors the center of the grounds.',
    'This stop honors a French military ally tied to early American independence.',
    'Stand where business district rush slows into a pocket of benches, iron fencing, and open lawn.',
    'If you can see a formal civic corridor nearby, you are in the right zone.'
  ], task),
  nightlifeCorridor: (task: string) => buildClue([
    'Head toward the Quarter corridor where balconies stack high and sound spills into the street day and night.',
    'Neon, live bands, and dense foot traffic make this one of the city’s most photographed stretches.',
    'You are looking for the most famous party spine in the neighborhood, not the refined arts blocks nearby.',
    'Keep moving until the energy is unmistakably loud and theatrical.',
    'Street signs here are often snapped by visitors proving they made it to this iconic zone.'
  ], task),
  jackson: (task: string) => buildClue([
    'Find the public plaza where painters line the perimeter and portrait artists call out to passersby.',
    'Iron fencing frames open space while cathedral towers dominate the skyline behind it.',
    'A mounted historical figure stands watch over the center and appears in countless travel photos.',
    'This is one of the strongest visual crossroads of history, art, and tourism in the Quarter.',
    'If street performers, open-air artwork, and church spires all appear together, you are close.'
  ], task),
  sugarCoffee: (task: string) => buildClue([
    'Follow the aroma of chicory coffee and sweet fried dough dusted in white sugar.',
    'Tables turn quickly here as people compare powdered-sugar smiles and napkin disasters.',
    'The stop sits near major Quarter footpaths and is almost always buzzing from morning through night.',
    'You are searching for a long-running local ritual that visitors treat like a required pilgrimage.',
    'Look for lines, green-and-white visual cues, and people balancing paper bags with warm pastries.'
  ], task),
  finalDanceHall: (task: string) => buildClue([
    'Your finish is beyond the French Quarter, where the streets widen and old warehouse blocks replace the tight tourist maze.',
    'This last stop is known as the original Cajun restaurant, a high-energy place where Louisiana flavor, live music, and dancing come together under one roof.',
    'Look near the Convention Center for a destination that feels more like a Cajun party than a quiet dinner.',
    'If you are still in balcony-lined Quarter streets, keep going.',
    'If you are along the water or at the Outlets, you have gone too far.'
  ], task),
  canal: (task: string) => buildClue([
    'Start on the broad downtown edge where the Quarter begins and movement channels in multiple directions.',
    'Rails run through this corridor and transit is part of the visual identity from end to end.',
    'You should notice a constant flow of riders, storefronts, and traffic converging in one linear spine.',
    'This location feels more open and commercial than the narrower historic lanes nearby.',
    'If you can spot track-based transport and heavy cross-city movement, you are on target.'
  ], task),
  royal: (task: string) => buildClue([
    'Find the Quarter stretch known for galleries, antiques, and buskers rather than loud nightlife crowds.',
    'Iron balconies and polished storefronts give the area a refined, curated feel.',
    'Street musicians still animate the block, but the mood is more elegant than rowdy.',
    'Window displays, art spaces, and collectors’ shops are strong visual markers here.',
    'If the surroundings feel upscale and performance-driven without neon chaos, you are in the right corridor.'
  ], task),
  flamingFountain: (task: string) => buildClue([
    'Look for a tucked-away courtyard linked to a famous cocktail stop in the Quarter.',
    'Inside, one feature is memorable because fire appears above water in the same focal point.',
    'This isn’t a street-corner landmark, so you need to slip off the main path to locate it.',
    'The atmosphere is photogenic, and often packed with visitors enjoying the weather and a Hurricane.',
    'If your team enters a hidden patio and immediately knows it is iconic, you found the right place.'
  ], task),
  gallier: (task: string) => buildClue([
    'Head to a formal civic landmark on the major boulevard where parades and ceremonies often pass.',
    'White columns and symmetrical architecture make this stop stand out from nearby modern facades.',
    'The building reflects an older era of city governance and public display.',
    'From the sidewalk, the frontage feels stately, open, and built for official gatherings.',
    'You are seeking a classic municipal structure, not a retail or nightlife destination.'
  ], task),
  frenchMarket: (task: string) => buildClue([
    'Move toward the long commercial corridor where open-air stalls and vendor rows stretch block after block.',
    'This area blends shopping, snacks, souvenirs, and constant pedestrian flow.',
    'It feels historic but active, with changing displays and a market rhythm throughout the day.',
    'You should see repeated booth-style setups instead of a single storefront destination.',
    'If the scene looks like a continuous bazaar near the Quarter edge, you are in the correct zone.'
  ], task)
}

export const routeStops: Record<string, SeedStop[]> = {
  A: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Lafayette Square', answerText: 'lafayette square', participantTaskTextPreSolve: 'Take a team photo that clearly shows your group at the correct landmark area.', participantClueText: locationClues.lafayette('Take a team photo that clearly shows your group at the correct landmark area.'), participantSuccessTextPostSolve: 'Nice solve. Confirm your proof upload and keep moving.', hostVerificationTaskText: 'Team photo pointing dramatically at the central statue.', proofType: 'photo', points: 10, lat: 29.9496, lng: -90.0704, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Bourbon Street Sign', answerText: 'bourbon street', participantTaskTextPreSolve: 'Take a team photo that clearly proves you reached the correct street checkpoint.', participantClueText: locationClues.nightlifeCorridor('Take a team photo that clearly proves you reached the correct street checkpoint.'), participantSuccessTextPostSolve: 'Checkpoint solved. Keep your pace and unlock the next clue.', hostVerificationTaskText: 'Team photo with a Bourbon Street sign.', proofType: 'photo', points: 10, lat: 29.9581, lng: -90.0656, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Jackson Square', answerText: 'jackson square', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable historic element at this location.', participantClueText: locationClues.jackson('Take a team photo featuring the most recognizable historic element at this location.'), participantSuccessTextPostSolve: 'Great work. You solved this checkpoint.', hostVerificationTaskText: 'Team photo with Andrew Jackson visible.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'Café du Monde', answerText: 'cafe du monde', participantTaskTextPreSolve: 'Take a photo proving your team completed the signature food-themed challenge at this stop.', participantClueText: locationClues.sugarCoffee('Take a photo proving your team completed the signature food-themed challenge at this stop.'), participantSuccessTextPostSolve: 'Solved. Upload confirmed—time for the final leg.', hostVerificationTaskText: 'Team photo showing a powdered sugar mustache.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantClueText: locationClues.finalDanceHall('Record a 10-second celebration video at the final destination.'), participantSuccessTextPostSolve: 'Final checkpoint solved. Await host wrap-up.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703, difficultyLevel: 'medium' }
  ],
  B: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Canal Street Streetcar', answerText: 'canal street', participantTaskTextPreSolve: 'Take a photo or action shot that proves you found the transit-themed checkpoint.', participantClueText: locationClues.canal('Take a photo or action shot that proves you found the transit-themed checkpoint.'), participantSuccessTextPostSolve: 'Solved. Keep moving to checkpoint 2.', hostVerificationTaskText: 'Photo of a moving streetcar on Canal Street.', proofType: 'photo', points: 10, lat: 29.9537, lng: -90.0716, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Royal Street', answerText: 'royal street', participantTaskTextPreSolve: 'Capture a short video showing your team interacting with the artistic or musical energy of the location.', participantClueText: locationClues.royal('Capture a short video showing your team interacting with the artistic or musical energy of the location.'), participantSuccessTextPostSolve: 'Checkpoint solved. Unlock your next clue.', hostVerificationTaskText: 'Short video of a teammate dancing near a street musician.', proofType: 'video', points: 15, lat: 29.9589, lng: -90.0645, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Jackson Square', answerText: 'jackson square', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable landmark element in the area.', participantClueText: locationClues.jackson('Take a team photo featuring the most recognizable landmark element in the area.'), participantSuccessTextPostSolve: 'Solved. Team is on track.', hostVerificationTaskText: 'Team photo with St. Louis Cathedral or Andrew Jackson statue visible.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: "Pat O'Brien's Flaming Fountain", answerText: 'pat obrien', participantTaskTextPreSolve: 'Take a dramatic team photo proving you found the correct hidden courtyard feature.', participantClueText: locationClues.flamingFountain('Take a dramatic team photo proving you found the correct hidden courtyard feature.'), participantSuccessTextPostSolve: 'Solved. Final checkpoint ahead.', hostVerificationTaskText: 'Hurricane-style team pose around the flaming fountain.', proofType: 'photo', points: 15, lat: 29.9579, lng: -90.0653, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantClueText: locationClues.finalDanceHall('Record a 10-second celebration video at the final destination.'), participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703, difficultyLevel: 'medium' }
  ],
  C: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Gallier Hall', answerText: 'gallier hall', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable architectural detail at this civic landmark.', participantClueText: locationClues.gallier('Take a team photo featuring the most recognizable architectural detail at this civic landmark.'), participantSuccessTextPostSolve: 'Great solve. Keep going.', hostVerificationTaskText: 'Team photo at Gallier Hall with column count visible or noted.', proofType: 'photo', points: 10, lat: 29.9516, lng: -90.0702, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Bourbon Street Sign', answerText: 'bourbon street', participantTaskTextPreSolve: 'Take a group photo that clearly proves your team reached the correct street checkpoint.', participantClueText: locationClues.nightlifeCorridor('Take a group photo that clearly proves your team reached the correct street checkpoint.'), participantSuccessTextPostSolve: 'Solved. Next clue unlocked soon.', hostVerificationTaskText: 'Group photo with a Bourbon Street sign.', proofType: 'photo', points: 10, lat: 29.9581, lng: -90.0656, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Café du Monde', answerText: 'cafe du monde', participantTaskTextPreSolve: 'Take a photo proving your team completed the signature treat challenge at this stop.', participantClueText: locationClues.sugarCoffee('Take a photo proving your team completed the signature treat challenge at this stop.'), participantSuccessTextPostSolve: 'Solved. Keep your momentum.', hostVerificationTaskText: 'Photo showing beignet or powdered sugar evidence.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'French Market', answerText: 'french market', participantTaskTextPreSolve: 'Take a team photo that clearly proves you found the market checkpoint.', participantClueText: locationClues.frenchMarket('Take a team photo that clearly proves you found the market checkpoint.'), participantSuccessTextPostSolve: 'Checkpoint solved. Final stop remains.', hostVerificationTaskText: 'Team photo with French Market sign or vendor stalls.', proofType: 'photo', points: 15, lat: 29.9615, lng: -90.0572, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantClueText: locationClues.finalDanceHall('Record a 10-second celebration video at the final destination.'), participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703, difficultyLevel: 'medium' }
  ],
  D: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Canal Street', answerText: 'canal street', participantTaskTextPreSolve: 'Take a team photo that clearly shows the main corridor or movement feature of this checkpoint.', participantClueText: locationClues.canal('Take a team photo that clearly shows the main corridor or movement feature of this checkpoint.'), participantSuccessTextPostSolve: 'Solved. Keep moving.', hostVerificationTaskText: 'Team shot with Canal Street background.', proofType: 'photo', points: 10, lat: 29.9537, lng: -90.0716, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: "Pat O'Brien's Flaming Fountain", answerText: 'pat obrien', participantTaskTextPreSolve: 'Take a dramatic team photo proving you found the correct hidden courtyard feature.', participantClueText: locationClues.flamingFountain('Take a dramatic team photo proving you found the correct hidden courtyard feature.'), participantSuccessTextPostSolve: 'Solved. Next clue is ready.', hostVerificationTaskText: 'Storm-blown team pose around the flaming fountain.', proofType: 'photo', points: 15, lat: 29.9579, lng: -90.0653, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Royal Street', answerText: 'royal street', participantTaskTextPreSolve: 'Film 5 seconds showing your team interacting with the arts or music energy of the location.', participantClueText: locationClues.royal('Film 5 seconds showing your team interacting with the arts or music energy of the location.'), participantSuccessTextPostSolve: 'Solved. Keep pace for a strong finish.', hostVerificationTaskText: '5-second jazz-hands video on Royal Street.', proofType: 'video', points: 15, lat: 29.9589, lng: -90.0645, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'Jackson Square', answerText: 'jackson square', participantTaskTextPreSolve: 'Take a photo featuring the most recognizable historic or visual element in the area.', participantClueText: locationClues.jackson('Take a photo featuring the most recognizable historic or visual element in the area.'), participantSuccessTextPostSolve: 'Checkpoint solved. Final checkpoint is next.', hostVerificationTaskText: 'Photo with cathedral or square fencing visible.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantClueText: locationClues.finalDanceHall('Record a 10-second celebration video at the final destination.'), participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703, difficultyLevel: 'medium' }
  ],
  E: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Lafayette Square', answerText: 'lafayette square', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable landmark element at this square.', participantClueText: locationClues.lafayette('Take a team photo featuring the most recognizable landmark element at this square.'), participantSuccessTextPostSolve: 'Solved. Keep your team moving.', hostVerificationTaskText: 'Team photo with the square and central statue area visible.', proofType: 'photo', points: 10, lat: 29.9496, lng: -90.0704, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Royal Street', answerText: 'royal street', participantTaskTextPreSolve: 'Take a photo of the most elegant or distinctive visual detail at this location.', participantClueText: locationClues.royal('Take a photo of the most elegant or distinctive visual detail at this location.'), participantSuccessTextPostSolve: 'Solved. Keep going.', hostVerificationTaskText: 'Photo of an elegant balcony or storefront on Royal Street.', proofType: 'photo', points: 10, lat: 29.9589, lng: -90.0645, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'French Market', answerText: 'french market', participantTaskTextPreSolve: 'Take a group photo proving you found the open-air market checkpoint.', participantClueText: locationClues.frenchMarket('Take a group photo proving you found the open-air market checkpoint.'), participantSuccessTextPostSolve: 'Solved. One more clue before the finale.', hostVerificationTaskText: 'Group photo by French Market sign or vendor row.', proofType: 'photo', points: 15, lat: 29.9615, lng: -90.0572, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'Café du Monde', answerText: 'cafe du monde', participantTaskTextPreSolve: 'Take a photo proving your team completed the signature food challenge at this stop.', participantClueText: locationClues.sugarCoffee('Take a photo proving your team completed the signature food challenge at this stop.'), participantSuccessTextPostSolve: 'Solved. Final checkpoint remains.', hostVerificationTaskText: 'Photo showing powdered sugar mustache.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantClueText: locationClues.finalDanceHall('Record a 10-second celebration video at the final destination.'), participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703, difficultyLevel: 'medium' }
  ],
  F: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Royal Street', answerText: 'royal street', participantTaskTextPreSolve: 'Take a team photo that proves you found the arts-and-music checkpoint.', participantClueText: locationClues.royal('Take a team photo that proves you found the arts-and-music checkpoint.'), participantSuccessTextPostSolve: 'Checkpoint solved. Continue to the next clue.', hostVerificationTaskText: 'Team photo with street musician or gallery sign on Royal Street.', proofType: 'photo', points: 10, lat: 29.9589, lng: -90.0645, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Jackson Square', answerText: 'jackson square', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable landmark element in the area.', participantClueText: locationClues.jackson('Take a team photo featuring the most recognizable landmark element in the area.'), participantSuccessTextPostSolve: 'Solved. Keep moving.', hostVerificationTaskText: 'Team photo with St. Louis Cathedral visible.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Café du Monde', answerText: 'cafe du monde', participantTaskTextPreSolve: 'Take a photo proving your team completed the signature treat challenge at this stop.', participantClueText: locationClues.sugarCoffee('Take a photo proving your team completed the signature treat challenge at this stop.'), participantSuccessTextPostSolve: 'Checkpoint solved. Keep pace.', hostVerificationTaskText: 'Photo of powdered sugar mustache.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621, difficultyLevel: 'medium' },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'French Market', answerText: 'french market', participantTaskTextPreSolve: 'Take a group photo proving you found the market checkpoint.', participantClueText: locationClues.frenchMarket('Take a group photo proving you found the market checkpoint.'), participantSuccessTextPostSolve: 'Solved. Final checkpoint remains.', hostVerificationTaskText: 'Group photo near the French Market sign.', proofType: 'photo', points: 15, lat: 29.9615, lng: -90.0572, difficultyLevel: 'hard' },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantClueText: locationClues.finalDanceHall('Record a 10-second celebration video at the final destination.'), participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "Cajun dance video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703, difficultyLevel: 'medium' }
  ]
}

async function run() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
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
      await supabase.from('kickoff_progress').upsert({ team_id: data.id, status: 'pending', points_awarded: 10, proof_url: null, completed_at: null }, { onConflict: 'team_id' })
    }
  }

  for (const code of routeCodes) {
    const routeId = routeIdByCode[code]
    await supabase.from('checkpoints').delete().eq('route_id', routeId)

    for (const [index, stop] of routeStops[code].entries()) {
      await supabase.from('checkpoints').insert({
        route_id: routeId,
        order_index: index + 1,
        title: stop.internalLocationName,
        clue_text: stop.participantClueText,
        task_text: stop.participantTaskTextPreSolve,
        unlock_answer: stop.answerText,
        answer_text: stop.answerText,
        unlock_qr: `QR-${code}-${index + 1}`,
        latitude: stop.lat,
        longitude: stop.lng,
        enable_gps: true,
        proof_type: stop.proofType,
        points: stop.points,
        public_checkpoint_label: stop.publicCheckpointLabel,
        participant_clue_text: stop.participantClueText,
        participant_task_text_pre_solve: stop.participantTaskTextPreSolve,
        participant_success_text_post_solve: stop.participantSuccessTextPostSolve,
        internal_location_name: stop.internalLocationName,
        host_verification_task_text: stop.hostVerificationTaskText,
        difficulty_level: stop.difficultyLevel
      })
    }
  }

  console.log('Seed complete')
}

const isDirectExecution = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false

if (isDirectExecution) {
  run().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

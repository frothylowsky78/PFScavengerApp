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
}

export const routeStops: Record<string, SeedStop[]> = {
  A: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Lafayette Square', answerText: 'lafayette square', participantClueText: 'Begin where downtown opens up beneath old oaks and a watchful monument anchors the scene. This green square honors a French ally from the Revolutionary era.', participantTaskTextPreSolve: 'Take a team photo that clearly shows your group at the correct landmark area.', participantSuccessTextPostSolve: 'Nice solve. Confirm your proof upload and keep moving.', hostVerificationTaskText: 'Team photo pointing dramatically at the central statue.', proofType: 'photo', points: 10, lat: 29.9496, lng: -90.0704 },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Bourbon Street Sign', answerText: 'bourbon street', participantClueText: 'Balconies, music, and nonstop energy define this world-famous corridor. Find the Quarter’s loudest legend.', participantTaskTextPreSolve: 'Take a team photo that clearly proves you reached the correct street checkpoint.', participantSuccessTextPostSolve: 'Checkpoint solved. Keep your pace and unlock the next clue.', hostVerificationTaskText: 'Team photo with a Bourbon Street sign.', proofType: 'photo', points: 10, lat: 29.9581, lng: -90.0656 },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Jackson Square', answerText: 'jackson square', participantClueText: 'Find the historic gathering place where artists line iron fencing and a rider watches over the scene with cathedral towers nearby.', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable historic element at this location.', participantSuccessTextPostSolve: 'Great work. You solved this checkpoint.', hostVerificationTaskText: 'Team photo with Andrew Jackson visible.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623 },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'Café du Monde', answerText: 'cafe du monde', participantClueText: 'Follow the scent of coffee and powdered sugar to one of the city’s most beloved food traditions.', participantTaskTextPreSolve: 'Take a photo proving your team completed the signature food-themed challenge at this stop.', participantSuccessTextPostSolve: 'Solved. Upload confirmed—time for the final leg.', hostVerificationTaskText: 'Team photo showing a powdered sugar mustache.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621 },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantClueText: 'Finish near the riverfront where Cajun music, food, and dancing bring the route to a close.', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantSuccessTextPostSolve: 'Final checkpoint solved. Await host wrap-up.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  B: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Canal Street Streetcar', answerText: 'canal street', participantClueText: 'Where downtown meets the Quarter, tracks still shape the street and transit remains part of the identity. Find the route defined by rails.', participantTaskTextPreSolve: 'Take a photo or action shot that proves you found the transit-themed checkpoint.', participantSuccessTextPostSolve: 'Solved. Keep moving to checkpoint 2.', hostVerificationTaskText: 'Photo of a moving streetcar on Canal Street.', proofType: 'photo', points: 10, lat: 29.9537, lng: -90.0716 },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Royal Street', answerText: 'royal street', participantClueText: 'Where nearby streets get louder, this one leans refined—galleries, buskers, antiques, and elegant balconies set the tone.', participantTaskTextPreSolve: 'Capture a short video showing your team interacting with the artistic or musical energy of the location.', participantSuccessTextPostSolve: 'Checkpoint solved. Unlock your next clue.', hostVerificationTaskText: 'Short video of a teammate dancing near a street musician.', proofType: 'video', points: 15, lat: 29.9589, lng: -90.0645 },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Jackson Square', answerText: 'jackson square', participantClueText: 'Cathedral spires, painters, and iron fencing mark one of the city’s best-known public spaces.', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable landmark element in the area.', participantSuccessTextPostSolve: 'Solved. Team is on track.', hostVerificationTaskText: 'Team photo with St. Louis Cathedral or Andrew Jackson statue visible.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623 },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: "Pat O'Brien's Flaming Fountain", answerText: 'pat obrien', participantClueText: 'Hidden behind a famous bar is a courtyard feature where flame and water meet.', participantTaskTextPreSolve: 'Take a dramatic team photo proving you found the correct hidden courtyard feature.', participantSuccessTextPostSolve: 'Solved. Final checkpoint ahead.', hostVerificationTaskText: 'Hurricane-style team pose around the flaming fountain.', proofType: 'photo', points: 15, lat: 29.9579, lng: -90.0653 },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantClueText: 'Follow the energy toward a Cajun finish filled with food, music, and dancing.', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  C: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Gallier Hall', answerText: 'gallier hall', participantClueText: 'White columns and civic grandeur mark this landmark along St. Charles. Find the ceremonial old heart of city government.', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable architectural detail at this civic landmark.', participantSuccessTextPostSolve: 'Great solve. Keep going.', hostVerificationTaskText: 'Team photo at Gallier Hall with column count visible or noted.', proofType: 'photo', points: 10, lat: 29.9516, lng: -90.0702 },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Bourbon Street Sign', answerText: 'bourbon street', participantClueText: 'Neon, balconies, and nonstop energy define this famous stretch. Find the Quarter’s best-known nightlife corridor.', participantTaskTextPreSolve: 'Take a group photo that clearly proves your team reached the correct street checkpoint.', participantSuccessTextPostSolve: 'Solved. Next clue unlocked soon.', hostVerificationTaskText: 'Group photo with a Bourbon Street sign.', proofType: 'photo', points: 10, lat: 29.9581, lng: -90.0656 },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Café du Monde', answerText: 'cafe du monde', participantClueText: 'Coffee and sugar have been drawing crowds here for generations. Find the city’s most iconic sweet stop.', participantTaskTextPreSolve: 'Take a photo proving your team completed the signature treat challenge at this stop.', participantSuccessTextPostSolve: 'Solved. Keep your momentum.', hostVerificationTaskText: 'Photo showing beignet or powdered sugar evidence.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621 },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'French Market', answerText: 'french market', participantClueText: 'Stalls, shopping, and local flavor stretch along one of the Quarter’s oldest commercial corridors.', participantTaskTextPreSolve: 'Take a team photo that clearly proves you found the market checkpoint.', participantSuccessTextPostSolve: 'Checkpoint solved. Final stop remains.', hostVerificationTaskText: 'Team photo with French Market sign or vendor stalls.', proofType: 'photo', points: 15, lat: 29.9615, lng: -90.0572 },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantClueText: 'Leave the Quarter and head for a Cajun finish with music, food, and a final dance.', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  D: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Canal Street', answerText: 'canal street', participantClueText: 'Start where the city widens, rails run through the center, and downtown gives way to the Quarter.', participantTaskTextPreSolve: 'Take a team photo that clearly shows the main corridor or movement feature of this checkpoint.', participantSuccessTextPostSolve: 'Solved. Keep moving.', hostVerificationTaskText: 'Team shot with Canal Street background.', proofType: 'photo', points: 10, lat: 29.9537, lng: -90.0716 },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: "Pat O'Brien's Flaming Fountain", answerText: 'pat obrien', participantClueText: 'Search for a tucked-away courtyard where a famous drink and a fire-meets-water feature share the spotlight.', participantTaskTextPreSolve: 'Create a dramatic group pose proving you found the hidden courtyard checkpoint.', participantSuccessTextPostSolve: 'Solved. Next clue is ready.', hostVerificationTaskText: 'Storm-blown team pose around the flaming fountain.', proofType: 'photo', points: 15, lat: 29.9579, lng: -90.0653 },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Royal Street', answerText: 'royal street', participantClueText: 'Antique shops, buskers, and elegant balconies make this stretch feel polished instead of wild.', participantTaskTextPreSolve: 'Film 5 seconds showing your team interacting with the arts or music energy of the location.', participantSuccessTextPostSolve: 'Solved. Keep pace for a strong finish.', hostVerificationTaskText: '5-second jazz-hands video on Royal Street.', proofType: 'video', points: 15, lat: 29.9589, lng: -90.0645 },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'Jackson Square', answerText: 'jackson square', participantClueText: 'History, artists, and cathedral views come together in the Quarter’s most iconic square.', participantTaskTextPreSolve: 'Take a photo featuring the most recognizable historic or visual element in the area.', participantSuccessTextPostSolve: 'Checkpoint solved. Final checkpoint is next.', hostVerificationTaskText: 'Photo with cathedral or square fencing visible.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623 },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantClueText: 'Finish strong near the riverfront with Cajun flavor, music, and celebration.', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  E: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Lafayette Square', answerText: 'lafayette square', participantClueText: 'Start in a downtown square shaded by large oaks, where a central monument anchors the scene.', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable landmark element at this square.', participantSuccessTextPostSolve: 'Solved. Keep your team moving.', hostVerificationTaskText: 'Team photo with the square and central statue area visible.', proofType: 'photo', points: 10, lat: 29.9496, lng: -90.0704 },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Royal Street', answerText: 'royal street', participantClueText: 'This street swaps neon for charm, with galleries, antiques, music, and refined visual details.', participantTaskTextPreSolve: 'Take a photo of the most elegant or distinctive visual detail at this location.', participantSuccessTextPostSolve: 'Solved. Keep going.', hostVerificationTaskText: 'Photo of an elegant balcony or storefront on Royal Street.', proofType: 'photo', points: 10, lat: 29.9589, lng: -90.0645 },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'French Market', answerText: 'french market', participantClueText: 'Follow the flow of shopping stalls and open-air browsing toward one of the Quarter’s oldest commercial stretches.', participantTaskTextPreSolve: 'Take a group photo proving you found the open-air market checkpoint.', participantSuccessTextPostSolve: 'Solved. One more clue before the finale.', hostVerificationTaskText: 'Group photo by French Market sign or vendor row.', proofType: 'photo', points: 15, lat: 29.9615, lng: -90.0572 },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'Café du Monde', answerText: 'cafe du monde', participantClueText: 'Powdered sugar and café au lait are the giveaway here. Find the city’s iconic sweet-stop tradition.', participantTaskTextPreSolve: 'Take a photo proving your team completed the signature food challenge at this stop.', participantSuccessTextPostSolve: 'Solved. Final checkpoint remains.', hostVerificationTaskText: 'Photo showing powdered sugar mustache.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621 },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantClueText: 'Wrap the route with Cajun food, dancing, and a river-adjacent finish.', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "10-second Cajun two-step video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
  ],
  F: [
    { publicCheckpointLabel: 'Checkpoint 1', internalLocationName: 'Royal Street', answerText: 'royal street', participantClueText: 'Where nearby streets roar, this one feels more composed—art, music, antiques, and ironwork define the mood.', participantTaskTextPreSolve: 'Take a team photo that proves you found the arts-and-music checkpoint.', participantSuccessTextPostSolve: 'Checkpoint solved. Continue to the next clue.', hostVerificationTaskText: 'Team photo with street musician or gallery sign on Royal Street.', proofType: 'photo', points: 10, lat: 29.9589, lng: -90.0645 },
    { publicCheckpointLabel: 'Checkpoint 2', internalLocationName: 'Jackson Square', answerText: 'jackson square', participantClueText: 'Follow the flow until cathedral towers rise above painters and iron fencing.', participantTaskTextPreSolve: 'Take a team photo featuring the most recognizable landmark element in the area.', participantSuccessTextPostSolve: 'Solved. Keep moving.', hostVerificationTaskText: 'Team photo with St. Louis Cathedral visible.', proofType: 'photo', points: 15, lat: 29.9574, lng: -90.0623 },
    { publicCheckpointLabel: 'Checkpoint 3', internalLocationName: 'Café du Monde', answerText: 'cafe du monde', participantClueText: 'Somewhere nearby, hot coffee and powdered sugar have been creating happy messes for decades.', participantTaskTextPreSolve: 'Take a photo proving your team completed the signature treat challenge at this stop.', participantSuccessTextPostSolve: 'Checkpoint solved. Keep pace.', hostVerificationTaskText: 'Photo of powdered sugar mustache.', proofType: 'photo', points: 15, lat: 29.9577, lng: -90.0621 },
    { publicCheckpointLabel: 'Checkpoint 4', internalLocationName: 'French Market', answerText: 'french market', participantClueText: 'Find the long-running market corridor where stalls and souvenirs line the edge of the Quarter.', participantTaskTextPreSolve: 'Take a group photo proving you found the market checkpoint.', participantSuccessTextPostSolve: 'Solved. Final checkpoint remains.', hostVerificationTaskText: 'Group photo near the French Market sign.', proofType: 'photo', points: 15, lat: 29.9615, lng: -90.0572 },
    { publicCheckpointLabel: 'Final checkpoint', internalLocationName: "Mulate's", answerText: 'mulates', participantClueText: 'Head out for a Cajun finale with music, food, and a final celebratory dance.', participantTaskTextPreSolve: 'Record a 10-second celebration video at the final destination.', participantSuccessTextPostSolve: 'Route complete. Await host confirmation.', hostVerificationTaskText: "Cajun dance video at Mulate's.", proofType: 'video', points: 20, lat: 29.9435, lng: -90.0703 }
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
        host_verification_task_text: stop.hostVerificationTaskText
      })
    }
  }

  console.log('Seed complete')
}

import { pathToFileURL } from 'node:url'

const isDirectExecution = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false

if (isDirectExecution) {
  run().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

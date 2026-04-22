import { pathToFileURL } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { TEAM_META } from '../lib/team-meta'

export const routeCodes = ['A', 'B', 'C', 'D', 'E', 'F']

export const kickoffChallenges: Record<string, string> = {
  pink: 'Find skis or a snowboard (real or decorative) and take a team selfie.',
  red: 'Ask a local for their favorite ski run and enter the answer in text.',
  yellow: 'Find something gold or shiny in a storefront and photograph it.',
  purple: 'Do a ski pose as a group and submit a photo.',
  gold: 'Find something that shines or reflects light and take a team photo capturing that "golden moment."',
  green: 'Find a pine tree or greenery and take a team photo.',
  silver: 'Find something metallic or reflective and photograph it.',
  black: 'Take a dramatic "film noir ski town" photo.',
  white: 'Take a bright snow-style group selfie.',
  blue: 'Find something blue on Main Street and photograph it.'
}

export const kickoffProofTypes: Record<string, 'photo' | 'text'> = {
  pink: 'photo',
  red: 'text',
  yellow: 'photo',
  purple: 'photo',
  gold: 'photo',
  green: 'photo',
  silver: 'photo',
  black: 'photo',
  white: 'photo',
  blue: 'photo'
}

export type SeedStop = {
  publicCheckpointLabel: string
  internalLocationName: string
  answerText: string
  participantClueText: string
  participantTaskTextPreSolve: string
  participantSuccessTextPostSolve: string
  hostVerificationTaskText: string
  proofType: 'photo' | 'text'
  points: number
  lat: number
  lng: number
  isFinal: boolean
  difficultyLevel: 'medium' | 'hard'
}

const successNonFinal = 'Solved! Upload confirmed — keep moving to the next clue.'
const successFinal = 'Route complete! Find a WorkMoney host for the wrap-up.'

const difficultyByIndex: Array<'medium' | 'hard'> = ['medium', 'medium', 'hard', 'hard', 'medium']

export const routeStops: Record<string, SeedStop[]> = {
  A: [
    {
      publicCheckpointLabel: 'Checkpoint 1',
      internalLocationName: 'Egyptian Theatre',
      answerText: 'egyptian theatre',
      participantClueText:
        'You don’t need a ticket to find this stage. Look for bold style, bright signage, and a building that feels more theatrical than anything around it.',
      participantTaskTextPreSolve:
        'Take a team photo clearly showing your group at the correct historic performance venue area.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with Egyptian Theatre exterior or marquee clearly visible.',
      proofType: 'photo',
      points: 10,
      lat: 40.6469,
      lng: -111.4977,
      isFinal: false,
      difficultyLevel: difficultyByIndex[0]
    },
    {
      publicCheckpointLabel: 'Checkpoint 2',
      internalLocationName: 'Park City Museum',
      answerText: 'park city museum',
      participantClueText:
        'The past is carefully kept here—mining, local stories, and artifacts all under one roof along Main Street.',
      participantTaskTextPreSolve:
        'Take a team photo that clearly proves you found the history-focused building.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with Park City Museum exterior or signage visible.',
      proofType: 'photo',
      points: 10,
      lat: 40.6464,
      lng: -111.4972,
      isFinal: false,
      difficultyLevel: difficultyByIndex[1]
    },
    {
      publicCheckpointLabel: 'Checkpoint 3',
      internalLocationName: 'Town Lift',
      answerText: 'town lift',
      participantClueText:
        'Most towns make you drive to adventure. Here, the mountain meets the street and the ride begins right from town.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the mountain access point.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo near Town Lift base or lift structure.',
      proofType: 'photo',
      points: 15,
      lat: 40.6460,
      lng: -111.4989,
      isFinal: false,
      difficultyLevel: difficultyByIndex[2]
    },
    {
      publicCheckpointLabel: 'Checkpoint 4',
      internalLocationName: 'High West Saloon exterior',
      answerText: 'high west',
      participantClueText:
        'In a town built on grit, this historic-looking stop refined things a bit. Look for age, wood, and strong character from the outside.',
      participantTaskTextPreSolve:
        'Take a team photo clearly showing the correct historic exterior.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with High West exterior or signage visible.',
      proofType: 'photo',
      points: 15,
      lat: 40.6461,
      lng: -111.4995,
      isFinal: false,
      difficultyLevel: difficultyByIndex[3]
    },
    {
      publicCheckpointLabel: 'Final checkpoint',
      internalLocationName: 'The Cabin',
      answerText: 'the cabin',
      participantClueText:
        'The route ends where music, nightlife, and mountain-town energy come together under one roof.',
      participantTaskTextPreSolve:
        'Take a team photo at the final destination showing your full group.',
      participantSuccessTextPostSolve: successFinal,
      hostVerificationTaskText:
        'Team photo clearly inside or outside The Cabin.',
      proofType: 'photo',
      points: 20,
      lat: 40.6456,
      lng: -111.4978,
      isFinal: true,
      difficultyLevel: difficultyByIndex[4]
    }
  ],

  B: [
    {
      publicCheckpointLabel: 'Checkpoint 1',
      internalLocationName: 'Main Street Bridge / creek crossing',
      answerText: 'main street bridge',
      participantClueText:
        'Water cuts quietly through town. Find the crossing where the street passes over it.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the creek crossing checkpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo near Main Street bridge or creek crossing.',
      proofType: 'photo',
      points: 10,
      lat: 40.6468,
      lng: -111.4984,
      isFinal: false,
      difficultyLevel: difficultyByIndex[0]
    },
    {
      publicCheckpointLabel: 'Checkpoint 2',
      internalLocationName: 'Riverhorse on Main exterior',
      answerText: 'riverhorse',
      participantClueText:
        'Look for a refined dining stop known for a more elevated Main Street atmosphere.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the upscale dining exterior.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with Riverhorse on Main exterior or signage visible.',
      proofType: 'photo',
      points: 10,
      lat: 40.6467,
      lng: -111.4976,
      isFinal: false,
      difficultyLevel: difficultyByIndex[1]
    },
    {
      publicCheckpointLabel: 'Checkpoint 3',
      internalLocationName: 'Swede Alley',
      answerText: 'swede alley',
      participantClueText:
        'Not all of Park City runs on the main strip. Find the quieter historic lane that slips just off the primary flow.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the side-street checkpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText: 'Team photo on Swede Alley.',
      proofType: 'photo',
      points: 15,
      lat: 40.6459,
      lng: -111.4971,
      isFinal: false,
      difficultyLevel: difficultyByIndex[2]
    },
    {
      publicCheckpointLabel: 'Checkpoint 4',
      internalLocationName: 'Town Lift',
      answerText: 'town lift',
      participantClueText:
        'Here, mountain access meets town life directly.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the mountain access point.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo near Town Lift base or lift structure.',
      proofType: 'photo',
      points: 15,
      lat: 40.6460,
      lng: -111.4989,
      isFinal: false,
      difficultyLevel: difficultyByIndex[3]
    },
    {
      publicCheckpointLabel: 'Final checkpoint',
      internalLocationName: 'The Cabin',
      answerText: 'the cabin',
      participantClueText:
        'Follow the energy toward a lively Main Street finish where music and celebration take over.',
      participantTaskTextPreSolve:
        'Take a team photo at the final destination showing your full group.',
      participantSuccessTextPostSolve: successFinal,
      hostVerificationTaskText:
        'Team photo clearly inside or outside The Cabin.',
      proofType: 'photo',
      points: 20,
      lat: 40.6456,
      lng: -111.4978,
      isFinal: true,
      difficultyLevel: difficultyByIndex[4]
    }
  ],

  C: [
    {
      publicCheckpointLabel: 'Checkpoint 1',
      internalLocationName: 'Atticus Coffee & Books',
      answerText: 'atticus',
      participantClueText:
        'Coffee and books come together in one of Main Street’s coziest combinations.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the coffee-and-books checkpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with Atticus exterior or sign visible.',
      proofType: 'photo',
      points: 10,
      lat: 40.6464,
      lng: -111.4978,
      isFinal: false,
      difficultyLevel: difficultyByIndex[0]
    },
    {
      publicCheckpointLabel: 'Checkpoint 2',
      internalLocationName: 'No Name Saloon exterior',
      answerText: 'no name saloon',
      participantClueText:
        'One Main Street favorite is watched over by an unforgettable rooftop figure.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the iconic bar exterior.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with No Name Saloon exterior or rooftop buffalo visible.',
      proofType: 'photo',
      points: 10,
      lat: 40.6463,
      lng: -111.4968,
      isFinal: false,
      difficultyLevel: difficultyByIndex[1]
    },
    {
      publicCheckpointLabel: 'Checkpoint 3',
      internalLocationName: 'Main Street public art sculpture',
      answerText: 'public art sculpture',
      participantClueText:
        'Not all the art here hangs on walls. Find a creative work out in the open.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the outdoor art checkpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText: 'Team photo with designated public art piece.',
      proofType: 'photo',
      points: 15,
      lat: 40.6465,
      lng: -111.4974,
      isFinal: false,
      difficultyLevel: difficultyByIndex[2]
    },
    {
      publicCheckpointLabel: 'Checkpoint 4',
      internalLocationName: 'Park City Museum',
      answerText: 'park city museum',
      participantClueText: 'Local history lives here.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the history-focused building.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with Park City Museum exterior or signage visible.',
      proofType: 'photo',
      points: 15,
      lat: 40.6464,
      lng: -111.4972,
      isFinal: false,
      difficultyLevel: difficultyByIndex[3]
    },
    {
      publicCheckpointLabel: 'Final checkpoint',
      internalLocationName: 'The Cabin',
      answerText: 'the cabin',
      participantClueText:
        'Finish where the street energy turns into a full evening scene.',
      participantTaskTextPreSolve:
        'Take a team photo at the final destination showing your full group.',
      participantSuccessTextPostSolve: successFinal,
      hostVerificationTaskText:
        'Team photo clearly inside or outside The Cabin.',
      proofType: 'photo',
      points: 20,
      lat: 40.6456,
      lng: -111.4978,
      isFinal: true,
      difficultyLevel: difficultyByIndex[4]
    }
  ],

  D: [
    {
      publicCheckpointLabel: 'Checkpoint 1',
      internalLocationName: 'Swede Alley',
      answerText: 'swede alley',
      participantClueText:
        'Slip just off the main flow and find the historic lane that locals know but visitors can miss.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the side-street checkpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText: 'Team photo on Swede Alley.',
      proofType: 'photo',
      points: 10,
      lat: 40.6459,
      lng: -111.4971,
      isFinal: false,
      difficultyLevel: difficultyByIndex[0]
    },
    {
      publicCheckpointLabel: 'Checkpoint 2',
      internalLocationName: 'Main Street staircase connection',
      answerText: 'staircase',
      participantClueText:
        'Park City doesn’t always move flat. Find the connection that climbs between levels.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the staircase checkpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo on a Main Street staircase connection.',
      proofType: 'photo',
      points: 10,
      lat: 40.6462,
      lng: -111.4973,
      isFinal: false,
      difficultyLevel: difficultyByIndex[1]
    },
    {
      publicCheckpointLabel: 'Checkpoint 3',
      internalLocationName: 'Egyptian Theatre',
      answerText: 'egyptian theatre',
      participantClueText:
        'Look for a building that feels more theatrical than everything around it.',
      participantTaskTextPreSolve:
        'Take a team photo showing the correct performance-venue area.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with Egyptian Theatre exterior or marquee visible.',
      proofType: 'photo',
      points: 15,
      lat: 40.6469,
      lng: -111.4977,
      isFinal: false,
      difficultyLevel: difficultyByIndex[2]
    },
    {
      publicCheckpointLabel: 'Checkpoint 4',
      internalLocationName: 'High West Saloon exterior',
      answerText: 'high west',
      participantClueText:
        'Historic wood, strong character, and old-town spirit define this exterior stop.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the correct historic exterior.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with High West exterior or signage visible.',
      proofType: 'photo',
      points: 15,
      lat: 40.6461,
      lng: -111.4995,
      isFinal: false,
      difficultyLevel: difficultyByIndex[3]
    },
    {
      publicCheckpointLabel: 'Final checkpoint',
      internalLocationName: 'The Cabin',
      answerText: 'the cabin',
      participantClueText:
        'Your last stop is where live sound and Main Street nightlife pull the route to a close.',
      participantTaskTextPreSolve:
        'Take a team photo at the final destination showing your full group.',
      participantSuccessTextPostSolve: successFinal,
      hostVerificationTaskText:
        'Team photo clearly inside or outside The Cabin.',
      proofType: 'photo',
      points: 20,
      lat: 40.6456,
      lng: -111.4978,
      isFinal: true,
      difficultyLevel: difficultyByIndex[4]
    }
  ],

  E: [
    {
      publicCheckpointLabel: 'Checkpoint 1',
      internalLocationName: 'Top of Main Street viewpoint',
      answerText: 'top of main',
      participantClueText:
        'Climb a bit higher and find the view where town and mountain atmosphere come together.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the scenic elevated viewpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo from upper Main Street scenic viewpoint.',
      proofType: 'photo',
      points: 10,
      lat: 40.6472,
      lng: -111.4979,
      isFinal: false,
      difficultyLevel: difficultyByIndex[0]
    },
    {
      publicCheckpointLabel: 'Checkpoint 2',
      internalLocationName: 'Main Street public art sculpture',
      answerText: 'public art sculpture',
      participantClueText:
        'Creativity appears in the open here, not just behind glass.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the outdoor art checkpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText: 'Team photo with designated public art piece.',
      proofType: 'photo',
      points: 10,
      lat: 40.6465,
      lng: -111.4974,
      isFinal: false,
      difficultyLevel: difficultyByIndex[1]
    },
    {
      publicCheckpointLabel: 'Checkpoint 3',
      internalLocationName: 'Atticus Coffee & Books',
      answerText: 'atticus',
      participantClueText:
        'Find the stop where caffeine and literature share the same address.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the coffee-and-books checkpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with Atticus exterior or sign visible.',
      proofType: 'photo',
      points: 15,
      lat: 40.6464,
      lng: -111.4978,
      isFinal: false,
      difficultyLevel: difficultyByIndex[2]
    },
    {
      publicCheckpointLabel: 'Checkpoint 4',
      internalLocationName: 'Main Street Bridge / creek crossing',
      answerText: 'main street bridge',
      participantClueText:
        'Somewhere along Main, water passes quietly underneath.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the creek crossing checkpoint.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo near Main Street bridge or creek crossing.',
      proofType: 'photo',
      points: 15,
      lat: 40.6468,
      lng: -111.4984,
      isFinal: false,
      difficultyLevel: difficultyByIndex[3]
    },
    {
      publicCheckpointLabel: 'Final checkpoint',
      internalLocationName: 'The Cabin',
      answerText: 'the cabin',
      participantClueText:
        'Wrap the route where mountain-town nightlife, music, and celebration converge.',
      participantTaskTextPreSolve:
        'Take a team photo at the final destination showing your full group.',
      participantSuccessTextPostSolve: successFinal,
      hostVerificationTaskText:
        'Team photo clearly inside or outside The Cabin.',
      proofType: 'photo',
      points: 20,
      lat: 40.6456,
      lng: -111.4978,
      isFinal: true,
      difficultyLevel: difficultyByIndex[4]
    }
  ],

  F: [
    {
      publicCheckpointLabel: 'Checkpoint 1',
      internalLocationName: 'No Name Saloon exterior',
      answerText: 'no name saloon',
      participantClueText:
        'One of Main Street’s most iconic exteriors is watched by an unforgettable figure overhead.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the iconic bar exterior.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with No Name Saloon exterior or rooftop buffalo visible.',
      proofType: 'photo',
      points: 10,
      lat: 40.6463,
      lng: -111.4968,
      isFinal: false,
      difficultyLevel: difficultyByIndex[0]
    },
    {
      publicCheckpointLabel: 'Checkpoint 2',
      internalLocationName: 'Town Lift',
      answerText: 'town lift',
      participantClueText:
        'Here the mountain and town connect directly.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the mountain access point.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo near Town Lift base or lift structure.',
      proofType: 'photo',
      points: 10,
      lat: 40.6460,
      lng: -111.4989,
      isFinal: false,
      difficultyLevel: difficultyByIndex[1]
    },
    {
      publicCheckpointLabel: 'Checkpoint 3',
      internalLocationName: 'Park City Museum',
      answerText: 'park city museum',
      participantClueText:
        'The town’s mining and local history are collected here.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the history-focused building.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with Park City Museum exterior or signage visible.',
      proofType: 'photo',
      points: 15,
      lat: 40.6464,
      lng: -111.4972,
      isFinal: false,
      difficultyLevel: difficultyByIndex[2]
    },
    {
      publicCheckpointLabel: 'Checkpoint 4',
      internalLocationName: 'Riverhorse on Main exterior',
      answerText: 'riverhorse',
      participantClueText:
        'Find a polished Main Street dining stop known for a more elevated feel.',
      participantTaskTextPreSolve:
        'Take a team photo proving you found the upscale dining exterior.',
      participantSuccessTextPostSolve: successNonFinal,
      hostVerificationTaskText:
        'Team photo with Riverhorse on Main exterior or signage visible.',
      proofType: 'photo',
      points: 15,
      lat: 40.6467,
      lng: -111.4976,
      isFinal: false,
      difficultyLevel: difficultyByIndex[3]
    },
    {
      publicCheckpointLabel: 'Final checkpoint',
      internalLocationName: 'The Cabin',
      answerText: 'the cabin',
      participantClueText:
        'End where live music, warm lighting, and Main Street energy meet.',
      participantTaskTextPreSolve:
        'Take a team photo at the final destination showing your full group.',
      participantSuccessTextPostSolve: successFinal,
      hostVerificationTaskText:
        'Team photo clearly inside or outside The Cabin.',
      proofType: 'photo',
      points: 20,
      lat: 40.6456,
      lng: -111.4978,
      isFinal: true,
      difficultyLevel: difficultyByIndex[4]
    }
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
      kickoff_challenge: kickoffChallenges[team.code],
      kickoff_proof_type: kickoffProofTypes[team.code],
      bus_start: team.busStart
    }, { onConflict: 'code' }).select('id').single()

    if (data?.id) {
      await supabase.from('kickoff_progress').upsert({ team_id: data.id, status: 'pending', points_awarded: 10, proof_url: null, answer_text: null, completed_at: null }, { onConflict: 'team_id' })
    }
  }

  for (const code of routeCodes) {
    const routeId = routeIdByCode[code]
    await supabase.from('checkpoints').delete().eq('route_id', routeId)

    for (const [index, s] of routeStops[code].entries()) {
      await supabase.from('checkpoints').insert({
        route_id: routeId,
        order_index: index + 1,
        title: s.internalLocationName,
        clue_text: s.participantClueText,
        task_text: s.participantTaskTextPreSolve,
        unlock_answer: s.answerText,
        answer_text: s.answerText,
        unlock_qr: `QR-${code}-${index + 1}`,
        latitude: s.lat,
        longitude: s.lng,
        enable_gps: true,
        proof_type: s.proofType,
        points: s.points,
        public_checkpoint_label: s.publicCheckpointLabel,
        participant_clue_text: s.participantClueText,
        participant_task_text_pre_solve: s.participantTaskTextPreSolve,
        participant_success_text_post_solve: s.participantSuccessTextPostSolve,
        internal_location_name: s.internalLocationName,
        host_verification_task_text: s.hostVerificationTaskText,
        difficulty_level: s.difficultyLevel,
        is_final: s.isFinal
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

import { pathToFileURL } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { TEAM_META } from '../lib/team-meta'

export const routeCodes = ['A', 'B', 'C', 'D', 'E', 'F']

export const kickoffChallenges: Record<string, string> = {
  pink: 'Find skis or a snowboard (real or decorative) and take a team selfie.',
  red: 'Ask a local for their favorite ski run and enter the answer in text.',
  yellow: 'Find something gold or shiny in a storefront and photograph it.',
  purple: 'Do a ski pose as a group and submit a photo.',
  green: 'Find a pine tree or greenery and take a team photo.',
  silver: 'Find something metallic or reflective and photograph it.',
  black: 'Take a dramatic "film noir ski town" photo.',
  white: 'Take a bright snow-style group selfie.',
  blue: 'Find something blue on Main Street and photograph it.',
  gold: 'Find something that shines or reflects light and take a team photo capturing that "golden moment."'
}

export const kickoffProofTypes: Record<string, 'photo' | 'text'> = {
  pink: 'photo',
  red: 'text',
  yellow: 'photo',
  purple: 'photo',
  green: 'photo',
  silver: 'photo',
  black: 'photo',
  white: 'photo',
  blue: 'photo',
  gold: 'photo'
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
  difficultyLevel: 'medium' | 'hard'
}

function buildClue(lines: string[], finalChallengeSentence: string) {
  return [...lines, finalChallengeSentence].join(' ')
}

const locationClues = {
  egyptianTheatre: (task: string) => buildClue([
    "Find the historic Upper Main Street venue famous for its ornate façade and classic marquee.",
    "During the region's biggest winter film festival this block is crowded with press and moviegoers.",
    "The building has stood since the 1920s and is a repeat stop for cinema premieres.",
    "A bright lit sign overhead spells out films and events and is visible from blocks away.",
    "The front sidewalk is often the busiest photo corner at the top of Main.",
    "If you see a neon marquee over an art-deco storefront you are in the right spot."
  ], task),
  pcMuseum: (task: string) => buildClue([
    "Look for the historic mid-Main building that preserves the town's mining and ski heritage.",
    "Its basement once served as the territorial jail and now displays the original iron cells.",
    "A prominent vintage sign anchors its sidewalk entrance along the busiest block.",
    "Exhibits trace the city's silver-boom era up through modern ski culture.",
    "School groups and tourists alternate through the doors almost every hour.",
    "Look for a brick façade that doubles as a walking-tour anchor."
  ], task),
  townLift: (task: string) => buildClue([
    "Find the base of the ski lift that rises right off the city's main street.",
    "Skiers drop in from the mountain here all winter and load straight back up.",
    "A wide plaza of benches and ski racks sits below the lift towers.",
    "Look for cables that climb sharply above storefronts toward the resort above.",
    "The location is a natural transit point between downtown and the mountain.",
    "If you can see chairlift cars and orange loading signs you are there."
  ], task),
  highWest: (task: string) => buildClue([
    "Find the former livery-barn building that now houses a well-known distillery just off the main strip.",
    "The exterior still carries its wooden barn shape, with large doors and rustic timber siding.",
    "A black metal sign above the entrance advertises small-batch whiskey made in town.",
    "Even when the venue is closed, the building's exterior is a common backdrop for winter photos.",
    "It sits at a corner where foot traffic splits between residential blocks and Main.",
    "The building history traces back more than a century."
  ], task),
  theCabin: (task: string) => buildClue([
    "Your finish is the private venue booked for tonight's WorkMoney celebration in Park City.",
    "Look beyond the storefronts for a stand-alone wood-structure event space prepared for the group.",
    "Staff and signage on site will confirm you have reached the right door.",
    "This stop is not a public landmark — follow the last clue and the host directions carefully.",
    "The arrival point is close to Main Street but set slightly apart from the retail row.",
    "If you see WorkMoney banners and event staff you are at the right door."
  ], task),
  mainBridge: (task: string) => buildClue([
    "Find the short bridge on the lower end of the main strip where water crosses beneath the roadway.",
    "A small creek runs under the crossing and feeds through downtown on its way east.",
    "Railings and interpretive plaques mark the span on both sides.",
    "Foot traffic slows here because the view opens up and cars merge nearby.",
    "In winter snow lines the banks and the water is a distinctive visual break.",
    "If the roadway dips and you can look over a guardrail at moving water you are close."
  ], task),
  riverhorse: (task: string) => buildClue([
    "Look for the second-floor restaurant in a historic mid-Main building with a large brass-style sign.",
    "The entrance is set off the sidewalk behind a stair-climb entryway.",
    "The block faces the busiest restaurant corridor downtown and is often quieter during the day.",
    "The façade mixes old-town brick with modern glass trim and outdoor lanterns.",
    "It's part of a row of long-running upscale dining venues downtown.",
    "If you see a tall brass name plate above a brick storefront you are in the right place."
  ], task),
  swedeAlley: (task: string) => buildClue([
    "Find the narrow parallel road that runs one block east of the main strip.",
    "Service entrances, parking structures, and transit stops line this quieter route.",
    "Buses and shuttles drop riders along its length throughout the day.",
    "The alley is a local shortcut and often less congested than the primary street.",
    "Look for transit shelters, garage entrances, and rear building doors.",
    "If the storefronts all show back-facing sides and service doors you are on the right road."
  ], task),
  atticus: (task: string) => buildClue([
    "Find the independent coffee-and-bookshop tucked into a historic Main Street storefront.",
    "A small chalkboard sign by the door typically lists the daily pour and featured reads.",
    "Inside, locals camp with laptops while travelers linger over espresso.",
    "Window displays mix new releases, used volumes, and regional titles.",
    "Wooden shelves and a short front counter make it feel small but busy.",
    "If a warm indie-shop atmosphere meets you through the door you are there."
  ], task),
  noName: (task: string) => buildClue([
    "Find the weathered western-style saloon that anchors one of the busiest mid-Main blocks.",
    "A large mounted bison head visible through the front windows is the unmistakable giveaway.",
    "Carved wood, vintage signage, and a classic saloon doorway dominate the frontage.",
    "It has long been a post-ski gathering spot and sidewalk photos are common here.",
    "The building exterior is iconic even if you never step inside.",
    "If the front of the building looks more like an Old West movie than a modern bar you are close."
  ], task),
  publicArt: (task: string) => buildClue([
    "Find the free-standing public art piece installed along the main commercial strip.",
    "Bronze or painted-steel work sits on a low base at the sidewalk edge.",
    "It is positioned to catch foot-traffic photos and is often mistaken for decoration.",
    "The work references local heritage and shows up on downtown walking tours.",
    "It sits between two storefronts and is lit at night.",
    "If a sidewalk sculpture stops you mid-stride you have found the checkpoint."
  ], task),
  staircase: (task: string) => buildClue([
    "Find the set of concrete steps that connects the primary street to the parallel back road.",
    "The staircase is narrow and built into the hillside between two buildings.",
    "Handrails and signage mark both the top and the bottom landings.",
    "Locals use it as a shortcut between shopping and transit blocks.",
    "It is easy to miss from the main sidewalk but clearly marked once spotted.",
    "If you find stairs joining two parallel blocks you are at the right crossing."
  ], task),
  topOfMain: (task: string) => buildClue([
    "Reach the uppermost block of the main strip where the road ends at a small plaza.",
    "From here the entire commercial corridor slopes down below you toward the valley.",
    "Benches and a short rail section frame a classic Park City skyline photo.",
    "Visitors often pause here for group portraits with the town spread out behind them.",
    "The block is quieter than the mid-Main restaurant row.",
    "If you are looking down the street and can see the whole strip you are at the right spot."
  ], task)
}

type StopDef = Omit<SeedStop, 'publicCheckpointLabel' | 'participantClueText' | 'points' | 'difficultyLevel'> & {
  clueBuilder: (task: string) => string
}

type StopDefWithMeta = StopDef & {
  points: number
  difficultyLevel: 'medium' | 'hard'
}

function stop(
  order: number,
  totalStops: number,
  def: StopDefWithMeta
): SeedStop {
  const isFinal = order === totalStops
  return {
    publicCheckpointLabel: isFinal ? 'Final checkpoint' : `Checkpoint ${order}`,
    internalLocationName: def.internalLocationName,
    answerText: def.answerText,
    participantClueText: def.clueBuilder(def.participantTaskTextPreSolve),
    participantTaskTextPreSolve: def.participantTaskTextPreSolve,
    participantSuccessTextPostSolve: def.participantSuccessTextPostSolve,
    hostVerificationTaskText: def.hostVerificationTaskText,
    proofType: def.proofType,
    points: def.points,
    lat: def.lat,
    lng: def.lng,
    difficultyLevel: def.difficultyLevel
  }
}

const defs = {
  egyptianTheatre: {
    internalLocationName: 'Egyptian Theatre',
    answerText: 'pc101',
    participantTaskTextPreSolve: 'Take a team photo under the marquee.',
    participantSuccessTextPostSolve: 'Nice solve. Upload confirmed — keep moving.',
    hostVerificationTaskText: 'Team photo under the Egyptian Theatre marquee.',
    proofType: 'photo' as const,
    lat: 40.6437, lng: -111.4965,
    clueBuilder: locationClues.egyptianTheatre
  },
  pcMuseum: {
    internalLocationName: 'Park City Museum',
    answerText: 'pc102',
    participantTaskTextPreSolve: 'Take a team photo at the front entrance sign.',
    participantSuccessTextPostSolve: 'Solved. Keep your team moving.',
    hostVerificationTaskText: 'Team photo by Park City Museum entrance sign.',
    proofType: 'photo' as const,
    lat: 40.6451, lng: -111.4970,
    clueBuilder: locationClues.pcMuseum
  },
  townLift: {
    internalLocationName: 'Town Lift',
    answerText: 'pc103',
    participantTaskTextPreSolve: 'Take a team photo with the lift cables visible overhead.',
    participantSuccessTextPostSolve: 'Solved. Next clue unlocks on upload.',
    hostVerificationTaskText: 'Team photo at Town Lift base with cables overhead.',
    proofType: 'photo' as const,
    lat: 40.6479, lng: -111.4974,
    clueBuilder: locationClues.townLift
  },
  highWest: {
    internalLocationName: 'High West Saloon exterior',
    answerText: 'pc104',
    participantTaskTextPreSolve: 'Take a team photo in front of the barn-style exterior.',
    participantSuccessTextPostSolve: 'Solved. Keep moving to the finish.',
    hostVerificationTaskText: 'Team photo at the High West barn exterior (venue closed — exterior only).',
    proofType: 'photo' as const,
    lat: 40.6420, lng: -111.4958,
    clueBuilder: locationClues.highWest
  },
  theCabin: {
    internalLocationName: 'The Cabin',
    answerText: 'pc105',
    participantTaskTextPreSolve: 'Take a team photo at the entrance of The Cabin to confirm your finish.',
    participantSuccessTextPostSolve: 'Route complete. Welcome to The Cabin — find a WorkMoney host for the wrap-up.',
    hostVerificationTaskText: 'Arrival team photo at The Cabin entrance.',
    proofType: 'photo' as const,
    lat: 40.6430, lng: -111.4950,
    clueBuilder: locationClues.theCabin
  },
  mainBridge: {
    internalLocationName: 'Main Street Bridge / creek crossing',
    answerText: 'pc106',
    participantTaskTextPreSolve: 'Take a team photo on the span with the creek visible.',
    participantSuccessTextPostSolve: 'Solved. Keep your pace.',
    hostVerificationTaskText: 'Team photo on the creek-crossing bridge.',
    proofType: 'photo' as const,
    lat: 40.6492, lng: -111.4984,
    clueBuilder: locationClues.mainBridge
  },
  riverhorse: {
    internalLocationName: 'Riverhorse on Main exterior',
    answerText: 'pc107',
    participantTaskTextPreSolve: 'Take a team photo at the building exterior and brass sign.',
    participantSuccessTextPostSolve: 'Solved. Next clue is ready.',
    hostVerificationTaskText: 'Team photo at Riverhorse on Main exterior (no interior required).',
    proofType: 'photo' as const,
    lat: 40.6472, lng: -111.4974,
    clueBuilder: locationClues.riverhorse
  },
  swedeAlley: {
    internalLocationName: 'Swede Alley',
    answerText: 'pc108',
    participantTaskTextPreSolve: 'Take a team photo on the alley with a transit shelter or street sign visible.',
    participantSuccessTextPostSolve: 'Solved. Keep moving.',
    hostVerificationTaskText: 'Team photo on Swede Alley, transit shelter or street sign visible.',
    proofType: 'photo' as const,
    lat: 40.6470, lng: -111.4965,
    clueBuilder: locationClues.swedeAlley
  },
  atticus: {
    internalLocationName: 'Atticus Coffee & Books',
    answerText: 'pc109',
    participantTaskTextPreSolve: 'Take a team photo at the storefront — exterior only, do not block traffic inside.',
    participantSuccessTextPostSolve: 'Solved. Keep your team moving.',
    hostVerificationTaskText: 'Team photo at Atticus storefront (exterior only).',
    proofType: 'photo' as const,
    lat: 40.6461, lng: -111.4971,
    clueBuilder: locationClues.atticus
  },
  noName: {
    internalLocationName: 'No Name Saloon exterior',
    answerText: 'pc110',
    participantTaskTextPreSolve: 'Take a team photo in front of the saloon exterior.',
    participantSuccessTextPostSolve: 'Solved. Next clue unlocks.',
    hostVerificationTaskText: 'Team photo at No Name Saloon exterior (no interior required).',
    proofType: 'photo' as const,
    lat: 40.6473, lng: -111.4975,
    clueBuilder: locationClues.noName
  },
  publicArt: {
    internalLocationName: 'Main Street public art sculpture',
    answerText: 'pc111',
    participantTaskTextPreSolve: 'Take a team photo with the sculpture clearly in frame.',
    participantSuccessTextPostSolve: 'Solved. Keep moving.',
    hostVerificationTaskText: 'Team photo with Main Street public art sculpture in frame.',
    proofType: 'photo' as const,
    lat: 40.6462, lng: -111.4970,
    clueBuilder: locationClues.publicArt
  },
  staircase: {
    internalLocationName: 'Main Street staircase connection',
    answerText: 'pc112',
    participantTaskTextPreSolve: 'Take a team photo on the staircase.',
    participantSuccessTextPostSolve: 'Solved. Next checkpoint is ready.',
    hostVerificationTaskText: 'Team photo on the Main-to-Swede staircase connector.',
    proofType: 'photo' as const,
    lat: 40.6470, lng: -111.4967,
    clueBuilder: locationClues.staircase
  },
  topOfMain: {
    internalLocationName: 'Top of Main Street viewpoint',
    answerText: 'pc113',
    participantTaskTextPreSolve: 'Take a team photo looking down the strip from the top-of-Main viewpoint.',
    participantSuccessTextPostSolve: 'Solved. Keep your pace.',
    hostVerificationTaskText: 'Team photo at the Top of Main Street viewpoint with the strip visible below.',
    proofType: 'photo' as const,
    lat: 40.6432, lng: -111.4960,
    clueBuilder: locationClues.topOfMain
  }
} satisfies Record<string, StopDef>

const points = [10, 10, 15, 15, 20]
const difficulties: Array<'medium' | 'hard'> = ['medium', 'medium', 'hard', 'hard', 'medium']

function route(defsInOrder: StopDef[]): SeedStop[] {
  return defsInOrder.map((def, i) => stop(
    i + 1,
    defsInOrder.length,
    { ...def, points: points[i], difficultyLevel: difficulties[i] }
  ))
}

export const routeStops: Record<string, SeedStop[]> = {
  A: route([defs.egyptianTheatre, defs.pcMuseum, defs.townLift, defs.highWest, defs.theCabin]),
  B: route([defs.mainBridge, defs.riverhorse, defs.swedeAlley, defs.townLift, defs.theCabin]),
  C: route([defs.atticus, defs.noName, defs.publicArt, defs.pcMuseum, defs.theCabin]),
  D: route([defs.swedeAlley, defs.staircase, defs.egyptianTheatre, defs.highWest, defs.theCabin]),
  E: route([defs.topOfMain, defs.publicArt, defs.atticus, defs.mainBridge, defs.theCabin]),
  F: route([defs.noName, defs.townLift, defs.pcMuseum, defs.riverhorse, defs.theCabin])
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
        difficulty_level: s.difficultyLevel
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

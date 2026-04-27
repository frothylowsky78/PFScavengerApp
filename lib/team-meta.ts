export type BusStartCode = 'A' | 'B'

export const BUS_STARTS: Record<BusStartCode, { code: BusStartCode; name: string; description: string }> = {
  A: {
    code: 'A',
    name: 'Bus A — Upper Main Street',
    description: 'Drop-off at the Egyptian Theatre area on Upper Main Street.'
  },
  B: {
    code: 'B',
    name: 'Bus B — Lower Main Street',
    description: 'Drop-off at the Town Lift plaza on Lower Main Street.'
  }
}

export const TEAM_META = [
  { code: 'eagles', name: 'Eagles', routeCode: 'A', busStart: 'A', hex: '#004C54', text: '#ffffff' },
  { code: 'steelers', name: 'Steelers', routeCode: 'B', busStart: 'A', hex: '#FFB612', text: '#101820' },
  { code: 'packers', name: 'Packers', routeCode: 'C', busStart: 'A', hex: '#203731', text: '#FFB612' },
  { code: 'chiefs', name: 'Chiefs', routeCode: 'D', busStart: 'A', hex: '#E31837', text: '#ffffff' },
  { code: 'cowboys', name: 'Cowboys', routeCode: 'D', busStart: 'A', hex: '#003594', text: '#ffffff' },
  { code: 'falcons', name: 'Falcons', routeCode: 'E', busStart: 'B', hex: '#A71930', text: '#ffffff' },
  { code: 'lions', name: 'Lions', routeCode: 'A', busStart: 'B', hex: '#0076B6', text: '#ffffff' },
  { code: 'bills', name: 'Bills', routeCode: 'B', busStart: 'B', hex: '#00338D', text: '#ffffff' },
  { code: 'dolphins', name: 'Dolphins', routeCode: 'C', busStart: 'B', hex: '#008E97', text: '#ffffff' },
  { code: 'bears', name: 'Bears', routeCode: 'F', busStart: 'B', hex: '#0B162A', text: '#C83803' }
] as const

export type TeamCode = (typeof TEAM_META)[number]['code']

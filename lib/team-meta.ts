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
  { code: 'pink', name: 'Pink Team', routeCode: 'A', busStart: 'A', hex: '#ec4899', text: '#111827' },
  { code: 'red', name: 'Red Team', routeCode: 'B', busStart: 'A', hex: '#ef4444', text: '#ffffff' },
  { code: 'yellow', name: 'Yellow Team', routeCode: 'C', busStart: 'A', hex: '#eab308', text: '#111827' },
  { code: 'purple', name: 'Purple Team', routeCode: 'D', busStart: 'A', hex: '#8b5cf6', text: '#ffffff' },
  { code: 'gold', name: 'Gold Team', routeCode: 'D', busStart: 'A', hex: '#D4AF37', text: '#111827' },
  { code: 'green', name: 'Green Team', routeCode: 'E', busStart: 'B', hex: '#22c55e', text: '#111827' },
  { code: 'silver', name: 'Silver Team', routeCode: 'A', busStart: 'B', hex: '#9ca3af', text: '#111827' },
  { code: 'black', name: 'Black Team', routeCode: 'B', busStart: 'B', hex: '#111827', text: '#ffffff' },
  { code: 'white', name: 'White Team', routeCode: 'C', busStart: 'B', hex: '#e5e7eb', text: '#111827' },
  { code: 'blue', name: 'Blue Team', routeCode: 'F', busStart: 'B', hex: '#2563eb', text: '#ffffff' }
] as const

export type TeamCode = (typeof TEAM_META)[number]['code']

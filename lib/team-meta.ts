export const TEAM_META = [
  { code: 'pink', name: 'Pink Team', routeCode: 'A', hex: '#ec4899', text: '#111827' },
  { code: 'red', name: 'Red Team', routeCode: 'B', hex: '#ef4444', text: '#ffffff' },
  { code: 'yellow', name: 'Yellow Team', routeCode: 'C', hex: '#facc15', text: '#111827' },
  { code: 'purple', name: 'Purple Team', routeCode: 'D', hex: '#a855f7', text: '#ffffff' },
  { code: 'green', name: 'Green Team', routeCode: 'E', hex: '#22c55e', text: '#111827' },
  { code: 'silver', name: 'Silver Team', routeCode: 'A', hex: '#94a3b8', text: '#111827' },
  { code: 'black', name: 'Black Team', routeCode: 'B', hex: '#0f172a', text: '#ffffff' },
  { code: 'white', name: 'White Team', routeCode: 'C', hex: '#f8fafc', text: '#111827' },
  { code: 'blue', name: 'Blue Team', routeCode: 'F', hex: '#3b82f6', text: '#ffffff' }
] as const

export type TeamCode = (typeof TEAM_META)[number]['code']

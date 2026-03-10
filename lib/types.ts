export type TeamProgress = {
  id: string
  team_id: string
  checkpoint_id: string
  status: 'pending' | 'submitted' | 'verified' | 'rejected'
  answer_text: string | null
  proof_url: string | null
  points_awarded: number
}

export type KickoffProgress = {
  id: string
  team_id: string
  status: 'pending' | 'submitted' | 'verified' | 'rejected'
  proof_url: string | null
  points_awarded: number
  completed_at: string | null
}

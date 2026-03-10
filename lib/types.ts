export type TeamProgress = {
  id: string
  team_id: string
  checkpoint_id: string
  status: 'pending' | 'submitted' | 'verified' | 'rejected'
  answer_text: string | null
  proof_url: string | null
  points_awarded: number
}

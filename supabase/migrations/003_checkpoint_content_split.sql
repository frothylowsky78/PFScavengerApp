-- Split participant-safe pre-solve content from internal/admin checkpoint content

alter table checkpoints add column if not exists public_checkpoint_label text;
alter table checkpoints add column if not exists participant_clue_text text;
alter table checkpoints add column if not exists participant_task_text_pre_solve text;
alter table checkpoints add column if not exists participant_success_text_post_solve text;
alter table checkpoints add column if not exists internal_location_name text;
alter table checkpoints add column if not exists answer_text text;
alter table checkpoints add column if not exists host_verification_task_text text;

update checkpoints
set
  public_checkpoint_label = coalesce(public_checkpoint_label, case when order_index = 5 then 'Final checkpoint' else 'Checkpoint ' || order_index::text end),
  participant_clue_text = coalesce(participant_clue_text, clue_text),
  participant_task_text_pre_solve = coalesce(participant_task_text_pre_solve, task_text, 'Upload proof showing your team completed this checkpoint challenge.'),
  participant_success_text_post_solve = coalesce(participant_success_text_post_solve, 'Great work! Keep moving to the next clue.'),
  internal_location_name = coalesce(internal_location_name, title),
  answer_text = coalesce(answer_text, unlock_answer),
  host_verification_task_text = coalesce(host_verification_task_text, task_text, 'Verify completion from uploaded proof.');

alter table checkpoints alter column public_checkpoint_label set not null;
alter table checkpoints alter column participant_clue_text set not null;
alter table checkpoints alter column participant_task_text_pre_solve set not null;
alter table checkpoints alter column internal_location_name set not null;
alter table checkpoints alter column answer_text set not null;
alter table checkpoints alter column host_verification_task_text set not null;

drop view if exists pending_submissions_view;

create view pending_submissions_view as
select
  kp.id as progress_id,
  'kickoff'::text as submission_type,
  t.name as team_name,
  'Kickoff Challenge'::text as checkpoint_title,
  t.kickoff_challenge as answer_text,
  t.kickoff_challenge as host_verification_task_text,
  kp.proof_url
from kickoff_progress kp
join teams t on t.id = kp.team_id
where kp.status = 'submitted'

union all

select
  tp.id as progress_id,
  'checkpoint'::text as submission_type,
  t.name as team_name,
  c.internal_location_name as checkpoint_title,
  tp.answer_text,
  c.host_verification_task_text,
  tp.proof_url
from team_progress tp
join teams t on t.id = tp.team_id
join checkpoints c on c.id = tp.checkpoint_id
where tp.status = 'submitted';

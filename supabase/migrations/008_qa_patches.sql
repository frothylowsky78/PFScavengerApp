drop view if exists leaderboard_view;

create view leaderboard_view as
select
  t.code as team_code,
  t.name as team_name,
  r.code as route_code,
  coalesce(kp.points_awarded, 0) + coalesce(sum(tp.points_awarded), 0) as total_points,
  greatest(
    coalesce(max(tp.verified_at), 'epoch'::timestamptz),
    coalesce(kp.completed_at, 'epoch'::timestamptz)
  ) as last_verified_at
from teams t
join routes r on r.id = t.route_id
left join kickoff_progress kp on kp.team_id = t.id and kp.status in ('submitted','verified')
left join team_progress tp on tp.team_id = t.id and tp.status = 'verified'
group by t.code, t.name, r.code, kp.points_awarded, kp.completed_at;

drop view if exists pending_submissions_view;

create view pending_submissions_view as
select
  kp.id as progress_id,
  'kickoff'::text as submission_type,
  t.name as team_name,
  'Kickoff Challenge'::text as checkpoint_title,
  t.kickoff_challenge as answer_text,
  t.kickoff_challenge as host_verification_task_text,
  kp.proof_url,
  kp.created_at as created_at
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
  tp.proof_url,
  tp.created_at as created_at
from team_progress tp
join teams t on t.id = tp.team_id
join checkpoints c on c.id = tp.checkpoint_id
where tp.status = 'submitted';

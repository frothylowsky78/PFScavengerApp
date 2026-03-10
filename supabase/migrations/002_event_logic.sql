-- Adds explicit kickoff progression + route-specific checkpoint metadata

alter table checkpoints add column if not exists task_text text;
alter table checkpoints add column if not exists proof_type text default 'photo';
alter table checkpoints add column if not exists enable_gps boolean not null default true;

create table if not exists kickoff_progress (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null unique references teams(id),
  status text not null check (status in ('pending','submitted','verified','rejected')) default 'pending',
  proof_url text,
  points_awarded int not null default 10,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace view leaderboard_view as
select
  t.code as team_code,
  t.name as team_name,
  r.code as route_code,
  coalesce(kp.points_awarded, 0) + coalesce(sum(tp.points_awarded), 0) as total_points
from teams t
join routes r on r.id = t.route_id
left join kickoff_progress kp on kp.team_id = t.id and kp.status in ('submitted','verified')
left join team_progress tp on tp.team_id = t.id
group by t.code, t.name, r.code, kp.points_awarded;

drop view if exists pending_submissions_view;

create view pending_submissions_view as
select
  kp.id as progress_id,
  'kickoff'::text as submission_type,
  t.name as team_name,
  'Kickoff Challenge'::text as checkpoint_title,
  t.kickoff_challenge as answer_text,
  kp.proof_url
from kickoff_progress kp
join teams t on t.id = kp.team_id
where kp.status = 'submitted'

union all

select
  tp.id as progress_id,
  'checkpoint'::text as submission_type,
  t.name as team_name,
  c.title as checkpoint_title,
  tp.answer_text,
  tp.proof_url
from team_progress tp
join teams t on t.id = tp.team_id
join checkpoints c on c.id = tp.checkpoint_id
where tp.status = 'submitted';

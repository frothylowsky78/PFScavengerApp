create extension if not exists "uuid-ossp";

create table if not exists routes (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null
);

create table if not exists teams (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null,
  color_hex text not null,
  route_id uuid not null references routes(id),
  kickoff_challenge text not null
);

create table if not exists checkpoints (
  id uuid primary key default uuid_generate_v4(),
  route_id uuid not null references routes(id),
  order_index int not null,
  title text not null,
  clue_text text not null,
  unlock_answer text,
  unlock_qr text,
  latitude double precision,
  longitude double precision,
  points int not null default 100
);

create table if not exists team_progress (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id),
  checkpoint_id uuid not null references checkpoints(id),
  status text not null check (status in ('pending','submitted','verified','rejected')),
  answer_text text,
  proof_url text,
  points_awarded int not null default 0,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(team_id, checkpoint_id)
);

create unique index if not exists checkpoints_route_order_uniq on checkpoints(route_id, order_index);

create or replace view leaderboard_view as
select t.code as team_code, t.name as team_name, r.code as route_code, coalesce(sum(tp.points_awarded),0) as total_points
from teams t
join routes r on r.id = t.route_id
left join team_progress tp on tp.team_id = t.id
group by t.code, t.name, r.code;

create or replace view pending_submissions_view as
select tp.id as progress_id, t.name as team_name, c.title as checkpoint_title, tp.answer_text, tp.proof_url
from team_progress tp
join teams t on t.id = tp.team_id
join checkpoints c on c.id = tp.checkpoint_id
where tp.status = 'submitted'
order by tp.created_at asc;


insert into storage.buckets (id, name, public) values ('hunt-proofs','hunt-proofs', true) on conflict (id) do nothing;

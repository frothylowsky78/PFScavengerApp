-- Limit each team to a single active phone at a time.
-- A device is a client-generated opaque token stored in the browser.
-- The team's currently-claimed device is tracked on the teams row; all prior
-- claims (including takeovers) are kept in team_devices for auditing.

alter table teams add column if not exists active_device_id text;
alter table teams add column if not exists active_device_claimed_at timestamptz;

create table if not exists team_devices (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  device_id text not null,
  claimed_at timestamptz not null default now(),
  released_at timestamptz,
  last_seen_at timestamptz not null default now(),
  user_agent text
);

create index if not exists team_devices_team_id_idx on team_devices(team_id);
create index if not exists team_devices_active_idx on team_devices(team_id) where released_at is null;

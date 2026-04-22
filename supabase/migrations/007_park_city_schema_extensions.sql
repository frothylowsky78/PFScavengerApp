-- Park City schema extensions:
-- - new bus_starts table (was inline TS constants); teams.bus_start now FK to it
-- - routes.sort_order for explicit display ordering
-- - teams.created_at audit column
-- - checkpoints.is_final boolean (backfilled from highest order_index per route)

create table if not exists bus_starts (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null,
  description text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

insert into bus_starts (code, name, description, lat, lng) values
  ('A', 'Bus A — Upper Main Street', 'Drop-off at the Egyptian Theatre area on Upper Main Street.', 40.6437, -111.4965),
  ('B', 'Bus B — Lower Main Street', 'Drop-off at the Town Lift plaza on Lower Main Street.', 40.6479, -111.4974)
on conflict (code) do update
set name = excluded.name,
    description = excluded.description,
    lat = excluded.lat,
    lng = excluded.lng;

-- Replace teams.bus_start CHECK with a real FK to bus_starts(code).
alter table teams drop constraint if exists teams_bus_start_check;
alter table teams drop constraint if exists teams_bus_start_fk;
alter table teams add constraint teams_bus_start_fk
  foreign key (bus_start) references bus_starts(code);

alter table teams add column if not exists created_at timestamptz not null default now();

alter table routes add column if not exists sort_order int not null default 0;
update routes set sort_order = case code
  when 'A' then 1
  when 'B' then 2
  when 'C' then 3
  when 'D' then 4
  when 'E' then 5
  when 'F' then 6
  else sort_order
end;

alter table checkpoints add column if not exists is_final boolean not null default false;

-- Mark the highest order_index per route as final (idempotent).
with ranked as (
  select id,
         row_number() over (partition by route_id order by order_index desc) as rn
  from checkpoints
)
update checkpoints c
set is_final = true
from ranked r
where r.id = c.id and r.rn = 1;

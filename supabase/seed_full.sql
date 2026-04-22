-- WorkMoney Park City seed bootstrap.
--
-- This file sets up routes, teams, and kickoff-progress baselines only.
-- Checkpoints are seeded by `npm run seed` (scripts/seed.ts) because the
-- clue data is rich and kept in one place in TypeScript.
--
-- Order of operations for a fresh Supabase project:
--   1. Run migrations 001 → 007 in the SQL editor.
--   2. Run this file in the SQL editor (resets + seeds teams/routes).
--   3. From a local clone with .env.local set: `npm run seed` to populate
--      checkpoints for all six routes.

begin;

-- Optional reset of seed-owned content
delete from team_progress;
delete from kickoff_progress;
delete from checkpoints;
delete from teams;
delete from routes;

-- Bus starts (Park City)
insert into bus_starts (code, name, description, lat, lng) values
  ('A', 'Bus A — Upper Main Street', 'Drop-off at the Egyptian Theatre area on Upper Main Street.', 40.6437, -111.4965),
  ('B', 'Bus B — Lower Main Street', 'Drop-off at the Town Lift plaza on Lower Main Street.', 40.6479, -111.4974)
on conflict (code) do update
set name = excluded.name,
    description = excluded.description,
    lat = excluded.lat,
    lng = excluded.lng;

-- Routes
insert into routes (code, name, sort_order) values
  ('A', 'Route A', 1),
  ('B', 'Route B', 2),
  ('C', 'Route C', 3),
  ('D', 'Route D', 4),
  ('E', 'Route E', 5),
  ('F', 'Route F', 6)
on conflict (code) do update
set name = excluded.name,
    sort_order = excluded.sort_order;

-- Teams (WorkMoney Park City)
insert into teams (code, name, color_hex, route_id, kickoff_challenge, kickoff_proof_type, bus_start)
select v.code, v.name, v.color_hex, r.id, v.kickoff_challenge, v.kickoff_proof_type, v.bus_start
from (values
  ('pink',   'Pink Team',   '#ec4899', 'A', 'Find skis or a snowboard (real or decorative) and take a team selfie.',                                                              'photo', 'A'),
  ('red',    'Red Team',    '#ef4444', 'B', 'Ask a local for their favorite ski run and enter the answer in text.',                                                               'text',  'A'),
  ('yellow', 'Yellow Team', '#eab308', 'C', 'Find something gold or shiny in a storefront and photograph it.',                                                                    'photo', 'A'),
  ('purple', 'Purple Team', '#8b5cf6', 'D', 'Do a ski pose as a group and submit a photo.',                                                                                        'photo', 'A'),
  ('gold',   'Gold Team',   '#D4AF37', 'D', 'Find something that shines or reflects light and take a team photo capturing that "golden moment."',                                  'photo', 'A'),
  ('green',  'Green Team',  '#22c55e', 'E', 'Find a pine tree or greenery and take a team photo.',                                                                                 'photo', 'B'),
  ('silver', 'Silver Team', '#9ca3af', 'A', 'Find something metallic or reflective and photograph it.',                                                                            'photo', 'B'),
  ('black',  'Black Team',  '#111827', 'B', 'Take a dramatic "film noir ski town" photo.',                                                                                         'photo', 'B'),
  ('white',  'White Team',  '#e5e7eb', 'C', 'Take a bright snow-style group selfie.',                                                                                              'photo', 'B'),
  ('blue',   'Blue Team',   '#2563eb', 'F', 'Find something blue on Main Street and photograph it.',                                                                               'photo', 'B')
) as v(code, name, color_hex, route_code, kickoff_challenge, kickoff_proof_type, bus_start)
join routes r on r.code = v.route_code
on conflict (code) do update
set name = excluded.name,
    color_hex = excluded.color_hex,
    route_id = excluded.route_id,
    kickoff_challenge = excluded.kickoff_challenge,
    kickoff_proof_type = excluded.kickoff_proof_type,
    bus_start = excluded.bus_start;

-- Kickoff progress baseline
insert into kickoff_progress (team_id, status, points_awarded, proof_url, answer_text, completed_at)
select t.id, 'pending', 10, null, null, null
from teams t
on conflict (team_id) do update
set status = excluded.status,
    points_awarded = excluded.points_awarded,
    proof_url = excluded.proof_url,
    answer_text = excluded.answer_text,
    completed_at = excluded.completed_at,
    updated_at = now();

commit;

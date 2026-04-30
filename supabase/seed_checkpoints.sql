-- Reseed checkpoints for all 6 routes (Park City).
-- Paste this into the Supabase SQL editor and run.
-- Safe to re-run: it deletes existing checkpoints per-route, then re-inserts.

begin;

-- Wipe + reseed checkpoints for routes A-F.
delete from checkpoints
where route_id in (select id from routes where code in ('A','B','C','D','E','F'));

with r as (
  select code, id from routes where code in ('A','B','C','D','E','F')
)
insert into checkpoints (
  route_id, order_index, title, clue_text, task_text, unlock_answer, answer_text,
  latitude, longitude, enable_gps, proof_type, points,
  public_checkpoint_label, participant_clue_text, participant_task_text_pre_solve,
  participant_success_text_post_solve, internal_location_name, host_verification_task_text,
  difficulty_level, is_final
)
select r.id, v.order_index, v.title, v.clue_text, v.task_text, v.unlock_answer, v.answer_text,
       v.latitude, v.longitude, true, v.proof_type, v.points,
       v.public_checkpoint_label, v.clue_text, v.task_text,
       case when v.is_final then 'Route complete. Welcome to The Cabin — find a WorkMoney host for the wrap-up.'
            else 'Solved. Upload confirmed — keep moving.' end,
       v.title, v.host_verification_task_text,
       'medium', v.is_final
from (values
  -- ROUTE A
  ('A', 1, 'Egyptian Theatre', 'You don’t need a ticket to find this stage. Look for bold style, bright signage, and a building that feels more theatrical than anything around it.', 'Take a team photo clearly showing your group at the correct historic performance venue area.', 'egyptian theatre', 'egyptian theatre', 40.6469, -111.4977, 'photo'::text, 10, 'Checkpoint 1', 'Team photo with Egyptian Theatre exterior or marquee clearly visible.', false),
  ('A', 2, 'Park City Museum', 'The past is carefully kept here—mining, local stories, and artifacts all under one roof along Main Street.', 'Take a team photo that clearly proves you found the history-focused building.', 'park city museum', 'park city museum', 40.6464, -111.4972, 'photo', 10, 'Checkpoint 2', 'Team photo with Park City Museum exterior or signage visible.', false),
  ('A', 3, 'Town Lift', 'Most towns make you drive to adventure. Here, the mountain meets the street and the ride begins right from town.', 'Take a team photo proving you found the mountain access point.', 'town lift', 'town lift', 40.6460, -111.4989, 'photo', 15, 'Checkpoint 3', 'Team photo near Town Lift base or lift structure.', false),
  ('A', 4, 'High West Saloon exterior', 'In a town built on grit, this historic-looking stop refined things a bit. Look for age, wood, and strong character from the outside.', 'Take a team photo clearly showing the correct historic exterior.', 'high west', 'high west', 40.6461, -111.4995, 'photo', 15, 'Checkpoint 4', 'Team photo with High West exterior or signage visible.', false),
  ('A', 5, 'The Cabin', 'The route ends where music, nightlife, and mountain-town energy come together under one roof.', 'Take a team photo at the final destination showing your full group.', 'the cabin', 'the cabin', 40.6456, -111.4978, 'photo', 20, 'Final checkpoint', 'Team photo clearly inside or outside The Cabin.', true),

  -- ROUTE B
  ('B', 1, 'Main Street Bridge / creek crossing', 'Water cuts quietly through town. Find the crossing where the street passes over it.', 'Take a team photo proving you found the creek crossing checkpoint.', 'main street bridge', 'main street bridge', 40.6468, -111.4984, 'photo', 10, 'Checkpoint 1', 'Team photo near Main Street bridge or creek crossing.', false),
  ('B', 2, 'Riverhorse on Main exterior', 'Look for a refined dining stop known for a more elevated Main Street atmosphere.', 'Take a team photo proving you found the upscale dining exterior.', 'riverhorse', 'riverhorse', 40.6467, -111.4976, 'photo', 10, 'Checkpoint 2', 'Team photo with Riverhorse on Main exterior or signage visible.', false),
  ('B', 3, 'Swede Alley', 'Not all of Park City runs on the main strip. Find the quieter historic lane that slips just off the primary flow.', 'Take a team photo proving you found the side-street checkpoint.', 'swede alley', 'swede alley', 40.6459, -111.4971, 'photo', 15, 'Checkpoint 3', 'Team photo on Swede Alley.', false),
  ('B', 4, 'Town Lift', 'Here, mountain access meets town life directly.', 'Take a team photo proving you found the mountain access point.', 'town lift', 'town lift', 40.6460, -111.4989, 'photo', 15, 'Checkpoint 4', 'Team photo near Town Lift base or lift structure.', false),
  ('B', 5, 'The Cabin', 'Follow the energy toward a lively Main Street finish where music and celebration take over.', 'Take a team photo at the final destination showing your full group.', 'the cabin', 'the cabin', 40.6456, -111.4978, 'photo', 20, 'Final checkpoint', 'Team photo clearly inside or outside The Cabin.', true),

  -- ROUTE C
  ('C', 1, 'Atticus Coffee & Books', 'Coffee and books come together in one of Main Street’s coziest combinations.', 'Take a team photo proving you found the coffee-and-books checkpoint.', 'atticus', 'atticus', 40.6464, -111.4978, 'photo', 10, 'Checkpoint 1', 'Team photo with Atticus exterior or sign visible.', false),
  ('C', 2, 'No Name Saloon exterior', 'One Main Street favorite is watched over by an unforgettable rooftop figure.', 'Take a team photo proving you found the iconic bar exterior.', 'no name saloon', 'no name saloon', 40.6463, -111.4968, 'photo', 10, 'Checkpoint 2', 'Team photo with No Name Saloon exterior or rooftop buffalo visible.', false),
  ('C', 3, 'Main Street public art sculpture', 'Not all the art here hangs on walls. Find a creative work out in the open.', 'Take a team photo proving you found the outdoor art checkpoint.', 'public art sculpture', 'public art sculpture', 40.6465, -111.4974, 'photo', 15, 'Checkpoint 3', 'Team photo with designated public art piece.', false),
  ('C', 4, 'Park City Museum', 'Local history lives here.', 'Take a team photo proving you found the history-focused building.', 'park city museum', 'park city museum', 40.6464, -111.4972, 'photo', 15, 'Checkpoint 4', 'Team photo with Park City Museum exterior or signage visible.', false),
  ('C', 5, 'The Cabin', 'Finish where the street energy turns into a full evening scene.', 'Take a team photo at the final destination showing your full group.', 'the cabin', 'the cabin', 40.6456, -111.4978, 'photo', 20, 'Final checkpoint', 'Team photo clearly inside or outside The Cabin.', true),

  -- ROUTE D
  ('D', 1, 'Swede Alley', 'Slip just off the main flow and find the historic lane that locals know but visitors can miss.', 'Take a team photo proving you found the side-street checkpoint.', 'swede alley', 'swede alley', 40.6459, -111.4971, 'photo', 10, 'Checkpoint 1', 'Team photo on Swede Alley.', false),
  ('D', 2, 'Main Street staircase connection', 'Park City doesn’t always move flat. Find the connection that climbs between levels.', 'Take a team photo proving you found this between-levels checkpoint.', 'staircase', 'staircase', 40.6462, -111.4973, 'photo', 10, 'Checkpoint 2', 'Team photo on a Main Street staircase connection.', false),
  ('D', 3, 'Egyptian Theatre', 'Look for a building that feels more theatrical than everything around it.', 'Take a team photo showing the correct performance-venue area.', 'egyptian theatre', 'egyptian theatre', 40.6469, -111.4977, 'photo', 15, 'Checkpoint 3', 'Team photo with Egyptian Theatre exterior or marquee visible.', false),
  ('D', 4, 'High West Saloon exterior', 'Historic wood, strong character, and old-town spirit define this exterior stop.', 'Take a team photo proving you found the correct historic exterior.', 'high west', 'high west', 40.6461, -111.4995, 'photo', 15, 'Checkpoint 4', 'Team photo with High West exterior or signage visible.', false),
  ('D', 5, 'The Cabin', 'Your last stop is where live sound and Main Street nightlife pull the route to a close.', 'Take a team photo at the final destination showing your full group.', 'the cabin', 'the cabin', 40.6456, -111.4978, 'photo', 20, 'Final checkpoint', 'Team photo clearly inside or outside The Cabin.', true),

  -- ROUTE E
  ('E', 1, 'Top of Main Street viewpoint', 'Climb a bit higher and find the view where town and mountain atmosphere come together.', 'Take a team photo proving you found the scenic elevated viewpoint.', 'top of main', 'top of main', 40.6472, -111.4979, 'photo', 10, 'Checkpoint 1', 'Team photo from upper Main Street scenic viewpoint.', false),
  ('E', 2, 'Main Street public art sculpture', 'Creativity appears in the open here, not just behind glass.', 'Take a team photo proving you found the outdoor art checkpoint.', 'public art sculpture', 'public art sculpture', 40.6465, -111.4974, 'photo', 10, 'Checkpoint 2', 'Team photo with designated public art piece.', false),
  ('E', 3, 'Atticus Coffee & Books', 'Find the stop where caffeine and literature share the same address.', 'Take a team photo proving you found the coffee-and-books checkpoint.', 'atticus', 'atticus', 40.6464, -111.4978, 'photo', 15, 'Checkpoint 3', 'Team photo with Atticus exterior or sign visible.', false),
  ('E', 4, 'Main Street Bridge / creek crossing', 'Somewhere along Main, water passes quietly underneath.', 'Take a team photo proving you found the creek crossing checkpoint.', 'main street bridge', 'main street bridge', 40.6468, -111.4984, 'photo', 15, 'Checkpoint 4', 'Team photo near Main Street bridge or creek crossing.', false),
  ('E', 5, 'The Cabin', 'Wrap the route where mountain-town nightlife, music, and celebration converge.', 'Take a team photo at the final destination showing your full group.', 'the cabin', 'the cabin', 40.6456, -111.4978, 'photo', 20, 'Final checkpoint', 'Team photo clearly inside or outside The Cabin.', true),

  -- ROUTE F
  ('F', 1, 'No Name Saloon exterior', 'One of Main Street’s most iconic exteriors is watched by an unforgettable figure overhead.', 'Take a team photo proving you found the iconic bar exterior.', 'no name saloon', 'no name saloon', 40.6463, -111.4968, 'photo', 10, 'Checkpoint 1', 'Team photo with No Name Saloon exterior or rooftop buffalo visible.', false),
  ('F', 2, 'Town Lift', 'Here the mountain and town connect directly.', 'Take a team photo proving you found the mountain access point.', 'town lift', 'town lift', 40.6460, -111.4989, 'photo', 10, 'Checkpoint 2', 'Team photo near Town Lift base or lift structure.', false),
  ('F', 3, 'Park City Museum', 'The town’s mining and local history are collected here.', 'Take a team photo proving you found the history-focused building.', 'park city museum', 'park city museum', 40.6464, -111.4972, 'photo', 15, 'Checkpoint 3', 'Team photo with Park City Museum exterior or signage visible.', false),
  ('F', 4, 'Riverhorse on Main exterior', 'Find a polished Main Street dining stop known for a more elevated feel.', 'Take a team photo proving you found the upscale dining exterior.', 'riverhorse', 'riverhorse', 40.6467, -111.4976, 'photo', 15, 'Checkpoint 4', 'Team photo with Riverhorse on Main exterior or signage visible.', false),
  ('F', 5, 'The Cabin', 'End where live music, warm lighting, and Main Street energy meet.', 'Take a team photo at the final destination showing your full group.', 'the cabin', 'the cabin', 40.6456, -111.4978, 'photo', 20, 'Final checkpoint', 'Team photo clearly inside or outside The Cabin.', true)
) as v(route_code, order_index, title, clue_text, task_text, unlock_answer, answer_text, latitude, longitude, proof_type, points, public_checkpoint_label, host_verification_task_text, is_final)
join r on r.code = v.route_code;

commit;

-- Sanity check: should show 5 checkpoints per route.
select r.code as route, count(c.id) as checkpoints
from routes r left join checkpoints c on c.route_id = r.id
group by r.code order by r.code;

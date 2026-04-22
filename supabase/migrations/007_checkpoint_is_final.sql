-- Adds an explicit `is_final` flag for checkpoints so the seed can carry the spec
-- field verbatim and the app/export tooling no longer has to infer the final
-- stop from order_index.

alter table checkpoints add column if not exists is_final boolean not null default false;

update checkpoints c
set is_final = true
from (
  select route_id, max(order_index) as max_order
  from checkpoints
  group by route_id
) last_stops
where c.route_id = last_stops.route_id
  and c.order_index = last_stops.max_order;

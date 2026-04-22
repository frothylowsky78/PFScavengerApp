-- WorkMoney Park City rebrand:
-- - two bus starting locations (A / B)
-- - kickoff proof can be photo or text
-- - kickoff progress can carry a text answer (for text-only kickoffs)
-- - checkpoints are restricted to photo or text proofs only (no video)

alter table teams add column if not exists bus_start text;
alter table teams add column if not exists kickoff_proof_type text;

update teams set kickoff_proof_type = coalesce(kickoff_proof_type, 'photo');
alter table teams alter column kickoff_proof_type set not null;

alter table teams drop constraint if exists teams_bus_start_check;
alter table teams add constraint teams_bus_start_check check (bus_start in ('A','B'));

alter table teams drop constraint if exists teams_kickoff_proof_type_check;
alter table teams add constraint teams_kickoff_proof_type_check check (kickoff_proof_type in ('photo','text'));

alter table kickoff_progress add column if not exists answer_text text;

-- Checkpoints: allow only photo or text going forward.
update checkpoints set proof_type = 'photo' where proof_type is null or proof_type not in ('photo','text');
alter table checkpoints drop constraint if exists checkpoints_proof_type_check;
alter table checkpoints add constraint checkpoints_proof_type_check check (proof_type in ('photo','text'));

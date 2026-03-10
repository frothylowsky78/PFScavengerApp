-- Adds explicit difficulty level metadata for checkpoint challenge exports

alter table checkpoints add column if not exists difficulty_level text;

update checkpoints
set difficulty_level = coalesce(difficulty_level, 'medium');

alter table checkpoints alter column difficulty_level set not null;

alter table checkpoints drop constraint if exists checkpoints_difficulty_level_check;
alter table checkpoints add constraint checkpoints_difficulty_level_check check (difficulty_level in ('medium','hard'));

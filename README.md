# WorkMoney Park City Scavenger Hunt

Mobile-first scavenger hunt web app for the WorkMoney Park City corporate event, hosted by Jen Carpenter Productions.

## Stack
- Next.js 15 (App Router)
- Tailwind CSS
- Supabase (Postgres + Storage)
- Vercel deployment

## Features
- Participant-first mobile UI with large buttons and color-coded teams (10 teams)
- Two bus starts (Upper Main / Lower Main) feeding into 6 routes (A–F)
- Team-specific kickoff challenge (Step 0 gate); supports photo or text proofs
- Proof-driven checkpoint progression: teams submit proof to auto-advance while host scoring runs in parallel
- Hybrid unlock by QR or answer entry
- Photo/text-only proofs (no video — built for spotty Park City cell data)
- GPS warmer/colder hint on the active clue
- One active phone per team (device claim with takeover)
- Host/Admin dashboard for verification queue and live leaderboard
- All routes finish at The Cabin

## Event defaults
- 10 teams across 2 buses
- 6 routes (A–F), 5 stops each, all ending at The Cabin
- Seeded with anti-reveal participant clues and host verification instructions

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env.local
   ```
3. Fill `.env.local` with your Supabase URL, anon key, and service role key.
4. Run SQL migrations in Supabase SQL editor (in order):
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_event_logic.sql`
   - `supabase/migrations/003_checkpoint_content_split.sql`
   - `supabase/migrations/004_clue_difficulty.sql`
   - `supabase/migrations/005_team_devices.sql`
   - `supabase/migrations/006_workmoney_park_city.sql`
   - `supabase/migrations/007_park_city_schema_extensions.sql`
5. Bootstrap routes/teams/kickoff baseline (in Supabase SQL editor):
   - `supabase/seed_full.sql`
6. Seed checkpoints:
   ```bash
   npm run seed
   ```
7. Validate anti-reveal content rules:
   ```bash
   npm run validate:anti-reveal
   ```
8. Start dev server:
   ```bash
   npm run dev
   ```

## Logo asset
Drop `TrailSignLogo.png` into `/public/` before deploying. The home page references `/TrailSignLogo.png`.

## Deploy to Vercel
1. Push repo to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example` in Vercel project settings.
4. Set build command to `npm run build` (default) and output defaults.
5. Deploy.

## Support contact
- Carl Moczydlowsky · 619.204.9010

## Recommended production hardening
- Add host auth via Supabase Auth + Row Level Security
- Add signed upload URLs + file size limits by role
- Add rate limits on unlock/upload endpoints
- Enable realtime subscription for live auto-refresh leaderboard
- Add stronger upload abuse protections and moderation tooling

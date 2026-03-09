# Powerflex French Quarter Scavenger Hunt

Production-ready, mobile-first scavenger hunt web app for a live corporate event.

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (Postgres + Storage + Realtime-compatible schema)
- Vercel deployment

## Features
- Participant-first mobile UI with large buttons and color-coded teams
- Team-specific route assignment and kickoff challenge support
- Hybrid checkpoint progression (unlock by QR or answer + proof upload)
- Photo/video proof uploads to Supabase Storage bucket (`hunt-proofs`)
- GPS warmer/colder hinting on active clue
- Host/Admin dashboard for verification queue and leaderboard
- Final destination built into route flow (Mulate's)

## Event defaults included
- 9 teams and route assignment exactly as provided
- 6 routes (A-F)
- Seeded checkpoints and unlock tokens
- 75-minute game model from NOPSI Hotel to Mulate's

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
4. Run SQL migration in Supabase SQL editor:
   - `supabase/migrations/001_init.sql`
5. Seed data:
   ```bash
   npm run seed
   ```
6. Start dev server:
   ```bash
   npm run dev
   ```

## Deploy to Vercel
1. Push repo to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example` in Vercel project settings.
4. Set build command to `npm run build` (default) and output defaults.
5. Deploy.

## Supabase notes
- The migration creates core tables and views:
  - `routes`, `teams`, `checkpoints`, `team_progress`
  - `leaderboard_view`, `pending_submissions_view`
- Bucket `hunt-proofs` is created as public for fast field uploads.
- Host verification is optional per checkpoint, and used mainly for score validation/edge cases.

## Recommended production hardening
- Add host auth (Supabase Auth + Row Level Security policies)
- Add signed upload URLs + file size limits by role
- Add rate limits on unlock/upload endpoints
- Enable realtime subscription for live auto-refresh leaderboard
- Add QR scanner integration in participant view


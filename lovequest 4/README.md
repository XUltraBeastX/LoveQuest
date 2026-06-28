# LoveQuest 💜

A gamified long-distance relationship app — GM controls the game, Player lives the adventure.

## Quick Start

1. Copy `.env.example` to `.env` and fill in your Supabase credentials
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:5173

## Supabase Setup

1. Create a project at supabase.com
2. Go to SQL Editor and run `supabase/schema.sql`
3. Copy your Project URL and anon key to `.env`

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in vercel.com
3. Add env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Deploy!

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Supabase (Auth, Database, Realtime)
- Lucide icons

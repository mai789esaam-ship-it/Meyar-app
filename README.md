# MEYAR app (stage 3)
Next.js 14 + TypeScript + Tailwind + Supabase.

## Run on a computer
npm install
npm run dev     # http://localhost:3000

## Deploy from a phone (Vercel)
1. Put this folder in a GitHub repo.
2. vercel.com > Add New Project > import the repo.
3. Environment Variables:
   NEXT_PUBLIC_SUPABASE_URL      = https://pnmqtmbcuugkzrvywghj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (your publishable key)
4. Deploy, then copy the site URL.

## Supabase settings (Authentication > URL Configuration)
Site URL = your Vercel URL; add it and <url>/auth/update to Redirect URLs.
For quick testing you may turn off "Confirm email" under Providers > Email.

# Meal Match

Group meal decision app: fake multiplayer demo where one real player (Serena) swipes and seven scripted players vote. Built for a mobile-first PWA experience with Bowlie the mascot.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS, Framer Motion, `canvas-confetti`, `qrcode.react`
- Mock data isolated in [`lib/mockData.ts`](lib/mockData.ts)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use a narrow viewport or device emulation for the intended layout.

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Development server             |
| `npm run build`| Production build               |
| `npm run start`| Serve production build locally |
| `npm run lint` | ESLint                         |
| `npm run test:e2e` | Playwright mobile flow (requires dev server or uses config webServer) |

## Deploy (Vercel)

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com), import the project (framework preset: Next.js).
3. Deploy with default settings — no extra environment variables are required for the MVP.

The app is static-friendly (`next build`); service worker and `manifest.json` live under `public/`.

## PWA

- `public/manifest.json` — name **Meal Match**, `display: standalone`, theme/background `#FBF4E8`
- Icons use `public/bowlie-wave.png` (including Apple touch icon copy under `public/icons/apple-touch-icon.png`)
- `public/splash-screen.png` — cream + waving Bowlie placeholder for `apple-touch-startup-image`
- `public/sw.js` — basic cache-first GET handler (tighten for production as needed)
- `components/ServiceWorkerRegister.tsx` registers the worker from the root layout

## Mock data → Supabase (Phase 2)

All demo data and deterministic vote math live in **`lib/mockData.ts`**. The UI imports only the exported helpers and types (`getPlayers`, `getRestaurants`, `getPlayerVotes`, `getRoomCode`, `getRoomUrl`, `filterRestaurantsForDeck`, `simulatePlayerJoin`, `simulatePlayerVoting`, `tallyAllVotesInDeck`, `calculateWinner`, `topVoteRows`, etc.).

**Swap path:** replace the *bodies* of those functions with Supabase queries and real-time subscriptions. Keep the same function signatures so components under `components/` do not need to change. Optionally split into `lib/data/mock.ts` and `lib/data/supabase.ts` and re-export from `mockData.ts` behind a flag.

## End-to-end demo video

After `npm run test:e2e`, Playwright writes a trace video under `test-results/`. You can copy the latest `video.webm` (mobile viewport ~390×844) for a full-flow recording. Example:

```bash
npx playwright test
cp test-results/*/video.webm ./meal-match-demo.webm
```

## Project layout

- `app/` — `layout.tsx` (fonts, PWA meta), `page.tsx`, `globals.css`
- `components/MealMatchApp.tsx` — full screen flow (landing → lobby → onboarding → swipe → tally → reveal)
- `components/Mascot.tsx` — idle breathing animation
- `lib/mockData.ts` — restaurants, players, votes, filters, winner logic
- `public/` — mascots, manifest, service worker, icons
- `e2e/demo.spec.ts` — full happy-path automation

## Flow notes

- Room code is always **`MONTREAL GROUP 08`** (per product spec).
- Phở Liên wins with **7/8** yes when Serena swipes right on it; fake vote tables are in `lib/mockData.ts`.
- Top-level screen transitions avoid `AnimatePresence mode="wait"` so the tally screen is not blocked by a stuck swipe exit.

## License

Private / demo use unless otherwise specified.

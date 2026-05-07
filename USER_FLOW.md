# Meal Match — User Flow Document

**Version:** MVP v1 (Fake Multiplayer)
**Last updated:** May 2026
**Owner:** Serena
**Purpose:** Sponsored video demo app for Cursor (sponsored campaign)

---

## 1. Product Summary

**One-liner:** A group meal decision-making web app where everyone votes on restaurants, and the app picks the winner that satisfies everyone's preferences.

**Pain point solved:** "8 people in a group chat, 30 minutes, still can't decide where to eat."

**Differentiator vs Uber Eats / Yelp:** Not a discovery tool. A *decision-making ritual* for groups who already know they want to eat together.

**MVP scope:** Single-device fake multiplayer. Real player (Serena) swipes; 7 fake players have pre-scripted votes. No backend, no database. All mock data isolated in one file for easy swap to Supabase later (Phase 2).

---

## 2. Personas

### Real player (the user)
- **Serena** — host, real swiper, the only person actually using the app

### Fake players (hardcoded in mockData)
| Name | Profile (preset preferences) |
|---|---|
| Rachelle | Vegetarian, prefers French, hates waiting |
| Aiden | No restrictions, loves Asian, OK with longer walks |
| Ellie | Gluten-free, prefers healthy, mid-budget |
| Chloe | No restrictions, prefers comfort food, low budget |
| Stephen | Nut allergy, no cuisine pref, willing to travel |
| Khue | Vegan, prefers Asian + healthy, low budget |
| Linh | No restrictions, prefers Vietnamese, mid-budget |

Each fake player has a hardcoded vote pattern that produces a predictable winner (Phở Lien) for predictable demo recordings.

---

## 3. Screen-by-Screen Flow

### Screen 0 — Landing
**Purpose:** First impression, set tone, launch experience.

**Elements:**
- Bowlie mascot (waving pose), centered top
- App name: "Meal Match" (display serif, large)
- Tagline: "Stop debating. Start eating."
- Single primary button: **"Create a room"**

**User action:** Tap "Create a room" → Screen 1

**Animation:** Bowlie idle breathing animation (subtle scale 1.0 → 1.02 → 1.0 every 3s)

---

### Screen 1 — Room Created + Lobby
**Purpose:** Establish "multiplayer" feeling, fake players join.

**Elements:**
- Header: "Room code"
- Big code: **`MONTREAL GROUP 08`** (hardcoded, display serif for character)
- QR code (generated from current page URL, for screenshot purposes)
- "Copy link" button (copies fake URL like `meal-match.app/r/MONTREAL-GROUP-08`)
- Lobby section:
  - Counter: "1/8 joined" → animates to "8/8 joined"
  - Player list with avatars (initials or color dots):
    - Serena (You) ✓ — appears immediately, marked as Host
    - Rachelle, Aiden, Ellie, Chloe, Stephen, Khue, Linh
  - Each fake player joins **every 0.6 seconds** with a soft spring animation + small "ding" sound (optional)
- Bottom button: **"Start swiping →"**
  - Disabled (grey) until 8/8 joined
  - Enabled (coral) when full

**User action:** Wait for all players to join (~5 seconds total) → tap "Start swiping" → Screen 2

**Animation:** Players pop-in with spring bounce. Counter increments.

---

### Screen 2 — Onboarding (5 questions)
**Purpose:** Collect Serena's preferences to personalize the swipe set.

**Format:** Typeform-style, one question per screen, full-screen, snappy transitions between.

#### Q1: Cuisine vibes
- Heading: "What are you craving?"
- Subtext: "Pick up to 3"
- Multi-select pills (up to 3):
  - 🍜 Asian (Vietnamese, Japanese, Korean, Thai)
  - 🥐 French / European
  - 🥗 Healthy / Salads
  - 🍔 Comfort / Burgers
  - 🍕 Italian
  - 🌮 Mexican / Latin
- Bottom: "Next →" button (enabled after at least 1 selection)

#### Q2: Dietary restrictions
- Heading: "Any restrictions?"
- Multi-select pills:
  - None
  - Vegetarian
  - Vegan
  - Gluten-free
  - Dairy-free
  - Nut allergy
  - Other
- Bottom: "Next →"

#### Q3: How far?
- Heading: "How far would you go?"
- Single-select cards:
  - 🚶 5-min walk
  - 🚶‍♀️ 10-min walk
  - 🚇 15-min by metro
  - 🚗 Anywhere worth it
- Bottom: "Next →" (auto-advances on tap, optional)

#### Q4: Wait tolerance
- Heading: "How patient are you?"
- Single-select cards:
  - ⚡ No wait, I'm starving
  - ⏱ 15-min OK
  - 🛋 Happy to wait if good
- Bottom: "Next →"

#### Q5: Budget
- Heading: "What's the vibe?"
- Single-select cards:
  - 💰 $ — Cheap eats
  - 💰💰 $$ — Mid-range
  - 💰💰💰 $$$ — Treat day
- Bottom: "Done →"

**After Q5:**
- Brief loading screen (1.5s): "Tallying preferences from your group..."
- Bowlie stirring animation
- → Screen 3

**Animation:** Smooth horizontal slide between questions. Pills/cards have squish-on-press feedback.

---

### Screen 3 — Swipe
**Purpose:** Core swipe interaction. Real swiping for Serena, fake live updates for other players.

**Elements:**
- Top bar:
  - Left: "Round 1 · 3/10" (progress through swipe deck)
  - Right: rotating fake player status:
    - "Rachelle is voting..."
    - "Aiden voted ✓"
    - "Ellie is voting..."
    - (cycles every ~2s on fake timer)
- Card stack:
  - Front card: visible, fully interactive
  - Back card: peeking ~10px behind, slightly smaller
- Card content (per restaurant):
  - Top 65%: large photo
  - Bottom 35%: name (display serif), cuisine + price ($/$$/$$$), one-line description, distance + wait time icons
- Action buttons (below card):
  - ✕ (red outline) — left swipe equivalent
  - ❤️ (sage outline) — right swipe equivalent

**Swipe physics (Framer Motion):**
- Card rotates as dragged (max ±15°)
- Threshold 100px = commit swipe
- Released card flies off screen with spring momentum
- Next card scales up from 0.95 → 1.0 with spring

**Cards in deck:**
- Filtered from 20 restaurants based on Serena's onboarding answers
- Typical filtered set: ~10 cards (varies by filters)
- After Serena swipes through all → Screen 4

**Special interaction:**
- Swipe right + match-with-fakes-already → small subtle "🔥 4 others liked this too" badge appears briefly
- Helps build anticipation before reveal

**Animation:** Smooth swipe physics. Subtle haptic feedback if available (mobile vibration API).

---

### Screen 4 — Tallying
**Purpose:** Build anticipation before reveal. Brief but cinematic.

**Elements:**
- Bowlie mascot in stirring pose, centered
- Heading: "Counting votes..."
- Subtext: "Bowlie is doing the math"
- Loading dots / spinner

**Duration:** ~2 seconds (feel substantial but don't bore)

**After loading:** → Screen 5

**Animation:** Bowlie stirring spoon rotates. Steam swirls rising. Soft fade to next screen.

---

### Screen 5 — Reveal (Winner)
**Purpose:** The wow moment. Climax of the experience.

**Elements:**
- Confetti burst on screen entry (canvas-confetti, coral + sage + mustard colors)
- Bowlie in jumping/excited pose, top of screen
- Heading: "It's a match!"
- Winner name: **"Phở Lien"** (display serif, large, coral color)
- Subtext: "6/8 votes · satisfies everyone's diet & distance"
- Restaurant card preview:
  - Photo
  - Cuisine + price
  - Address + distance
  - One-line description
- Vote breakdown bar chart (top 5 restaurants):
  - Phở Lien: 6/8 (winner, highlighted in sage green)
  - [Restaurant 2]: X/8
  - [Restaurant 3]: X/8
  - [Restaurant 4]: X/8
  - [Restaurant 5]: X/8
- Bottom buttons:
  - **"Open in Maps"** (primary coral) — deep link to Google Maps with restaurant query
  - **"Start over"** (secondary outline) — back to Screen 0

**Caption (small, italic, below winner name):** "Finally settled. 🎉"

**Animation:**
- Confetti rains for 2-3 seconds then fades
- Bowlie bounces 2-3 times excitedly
- Vote bars fill left-to-right with stagger (200ms delay between each)
- Winner bar fills last with extra emphasis (sage green pop + slight scale bump)

---

### Screen 6 (Edge case) — No Match Found
**Purpose:** Handle edge case if filters too restrictive or no consensus.

**Elements:**
- Bowlie in sad pose
- Heading: "No agreement found 😅"
- Subtext: "Loosen up the filters or just go with cơm tấm"
- Buttons:
  - "Try again" (re-do onboarding)
  - "Show all top voted anyway" (force reveal)

**When triggered:** Only if all restaurants in deck are vetoed by ≥4 players. Rarely happens with current fake data setup.

---

## 4. Mock Data Architecture

**Critical requirement for Phase 2 swap-ability.**

All mock data lives in a single file: `lib/mockData.ts`

### Functions exposed:
```typescript
getPlayers(): Player[]
getRestaurants(): Restaurant[]
getPlayerVotes(playerId: string): VoteMap
getRoomCode(): string
calculateWinner(votes: VoteMap[], constraints: Constraint[]): Restaurant
simulatePlayerJoin(callback): void   // fake timer joining players
simulatePlayerVoting(callback): void // fake voting status updates
```

### UI components rule:
**UI never hardcodes any mock value.** All data comes through these functions.

**Phase 2 swap (later):**
Replace function bodies in `mockData.ts` with Supabase queries. UI components don't change.

Example transition:
```typescript
// MVP (mock)
export function getPlayers() {
  return [
    { id: '1', name: 'Serena', isHost: true },
    { id: '2', name: 'Rachelle', ... },
    // ...
  ]
}

// Phase 2 (real)
export function getPlayers() {
  return supabase.from('players').select('*').eq('roomCode', currentRoom)
}
```

---

## 5. Restaurant Data Schema

Each of the 20 restaurants needs:

```typescript
type Restaurant = {
  id: string
  name: string
  cuisine: 'asian' | 'french' | 'healthy' | 'comfort' | 'italian' | 'mexican'
  subCuisine: string  // e.g. "Vietnamese", "Bistro français"
  priceLevel: 1 | 2 | 3   // $, $$, $$$
  distanceMin: number     // walking/metro minutes
  waitTimeMin: number     // typical wait
  dietaryTags: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free')[]
  imageUrl: string
  description: string     // one-line vibe
  address: string         // for Maps deep link
  mapsUrl: string         // pre-generated Google Maps URL
}
```

20 restaurants split: ~12 Asian, ~8 French (per Serena's preference). Mix of price levels and dietary options to make filtering meaningful.

---

## 6. Fake Vote Logic (so Phở Lien always wins)

For predictable demo recordings, hardcode votes so Phở Lien wins. Suggested approach:

```typescript
const fakeVotePattern = {
  'pho-lien': { yes: ['rachelle', 'aiden', 'ellie', 'chloe', 'khue', 'linh'], no: ['stephen'] }, // 6/7 fake yes
  'restaurant-2': { yes: ['rachelle', 'aiden', 'stephen'], no: ['ellie', 'chloe', 'khue', 'linh'] }, // 3/7
  // ...
}
```

When Serena votes yes on Phở Lien, total = 7/8 (close to 6/8 if Stephen votes no, gives expected "6/8 satisfies everyone").

For other restaurants, vary fake votes so the bar chart looks realistic and natural — not all uniformly mid.

---

## 7. Mascot Asset Plan

**Mascot:** Bowlie (one character, multiple poses)

| Pose | Used in screen | File name |
|---|---|---|
| Waving | Screen 0 (Landing) | `bowlie-wave.png` |
| Thinking | Screen 2 (Onboarding) | `bowlie-thinking.png` |
| Stirring | Screen 4 (Tallying) | `bowlie-stirring.png` |
| Jumping/excited | Screen 5 (Reveal) | `bowlie-jumping.png` |
| Sad | Screen 6 (No match) | `bowlie-sad.png` |

All transparent PNG, generated via Nano Banana (Gemini 2.5 Flash Image).

---

## 8. Visual Design Tokens

### Colors
| Token | Hex | Usage |
|---|---|---|
| `--bg-cream` | `#FBF4E8` | Main background |
| `--surface-white` | `#FFFCF7` | Cards, surfaces |
| `--coral-primary` | `#FF7A55` | Primary buttons, accents, winner highlight |
| `--sage-green` | `#7FB069` | Yes button, success states, winner bar |
| `--mustard` | `#F4C95D` | Highlights, badges |
| `--cocoa-text` | `#3D2E2A` | All body text, outlines |
| `--cocoa-soft` | `rgba(61, 46, 42, 0.6)` | Secondary text |
| `--shadow-warm` | `rgba(255, 122, 85, 0.12)` | Soft warm card shadows |

### Typography
- **Display:** Fraunces (serif, for headings, room code, winner name, mascot moments)
- **Body:** DM Sans (sans-serif, for UI text, descriptions, labels)
- **Optional accent:** Caveat or Patrick Hand (handwritten, for 1-2 charm moments)

### Spacing & shapes
- Border radius: 16px (medium), 24px (cards), 999px (pills/buttons)
- Card shadow: `0 8px 24px var(--shadow-warm)`
- Button height: min 56px (large tap target)
- Generous whitespace, mobile-first

### Animation philosophy
- Spring physics (Framer Motion `type: 'spring'`)
- Slower than Duolingo: 400-600ms typical
- Soft overshoot, settle gently
- Mascot has subtle idle animation always running

---

## 9. PWA Setup Requirements

App must work as PWA so it looks native when added to iPhone home screen:

- `manifest.json` with proper name, icons, theme color (cream)
- Apple touch icon (180x180) — Bowlie face
- Standalone display mode (`"display": "standalone"`)
- Splash screen (cream background + Bowlie waving)
- Status bar style: default
- Service worker (basic, for offline caching of assets)

**Test:** After deploy, open Vercel URL on iPhone Safari → Share → Add to Home Screen → tap icon → should open fullscreen, no Safari UI.

---

## 10. Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Confetti:** canvas-confetti
- **Fonts:** next/font (Fraunces, DM Sans, optional Caveat)
- **QR generation:** qrcode.react or similar
- **Deployment:** Vercel (zero config)
- **No backend, no database** (Phase 1)
- **Phase 2 ready:** Supabase swap via mockData.ts replacement

---

## 11. Out of Scope (Phase 1)

- Real multi-device sync
- Authentication
- Persistent rooms / history
- Restaurant search / API integration (Google Places)
- Push notifications
- Group chat / messaging
- Order placement
- Payments
- Restaurant ratings / reviews

All of these are Phase 2+ considerations.

---

## 12. Success Criteria for Video

Video records best if:
1. App loads in <2s on iPhone Safari
2. PWA install works smoothly (icon on home screen)
3. Lobby fills naturally (~5 seconds total, looks like real multiplayer)
4. Swipe physics feel premium and responsive
5. Reveal screen has impact (confetti + winner name lands)
6. Mascot is visible in at least 3 screens (Landing, Tallying, Reveal)
7. Mobile viewport perfect (no desktop UI artifacts)

If all 7 hit, video has the visual ammo it needs.

---

## 13. Restaurant Data (20 spots, Montréal)

Split: 12 Asian + 8 French. All real restaurants, verifiable on Google Maps. Distance/wait values are illustrative for demo — feel free to adjust for realism in your specific scenario.

### Asian (12)

```typescript
{
  id: 'pho-lien',
  name: 'Phở Liên',
  cuisine: 'asian',
  subCuisine: 'Vietnamese',
  priceLevel: 1,
  distanceMin: 12,
  waitTimeMin: 10,
  dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'nut-free'],
  description: 'Legendary pho, no-frills, the OG.',
  address: '5703 Chemin de la Côte-des-Neiges, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3'
},
{
  id: 'red-tiger',
  name: 'Le Red Tiger',
  cuisine: 'asian',
  subCuisine: 'Modern Vietnamese',
  priceLevel: 2,
  distanceMin: 8,
  waitTimeMin: 20,
  dietaryTags: ['vegetarian'],
  description: 'Stylish takes on Vietnamese street food.',
  address: '1201 Rue de Bullion, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43'
},
{
  id: 'bistro-co-ut',
  name: 'Bistro Cô Út',
  cuisine: 'asian',
  subCuisine: 'Vietnamese',
  priceLevel: 1,
  distanceMin: 6,
  waitTimeMin: 5,
  dietaryTags: ['vegetarian', 'nut-free'],
  description: 'Cozy spot, generous portions, authentic.',
  address: '1791 Rue Sainte-Catherine O, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1583224944844-5b268c057b72'
},
{
  id: 'tran-cantine',
  name: 'Tran Cantine',
  cuisine: 'asian',
  subCuisine: 'Modern Vietnamese',
  priceLevel: 2,
  distanceMin: 15,
  waitTimeMin: 15,
  dietaryTags: ['vegetarian', 'vegan'],
  description: 'Young, creative, family-run vibes.',
  address: '6076 Rue Saint-Hubert, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1547928576-b822bc410bdf'
},
{
  id: 'pho-bac-97',
  name: 'Pho Bac 97',
  cuisine: 'asian',
  subCuisine: 'Vietnamese',
  priceLevel: 1,
  distanceMin: 10,
  waitTimeMin: 25,
  dietaryTags: ['gluten-free'],
  description: 'Locals say best pho in town. Worth the line.',
  address: '1016 Boul. Saint-Laurent, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624'
},
{
  id: 'petit-sao',
  name: 'Le Petit Sao',
  cuisine: 'asian',
  subCuisine: 'Vietnamese',
  priceLevel: 1,
  distanceMin: 7,
  waitTimeMin: 5,
  dietaryTags: ['vegetarian', 'vegan'],
  description: 'Bright, colorful, lots of veggie options.',
  address: '4380 Rue Saint-Denis, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e'
},
{
  id: 'hoang-oanh',
  name: 'Hoang Oanh Sandwich',
  cuisine: 'asian',
  subCuisine: 'Banh mi',
  priceLevel: 1,
  distanceMin: 14,
  waitTimeMin: 5,
  dietaryTags: ['vegetarian'],
  description: 'Best banh mi, sesame bread, real cheap.',
  address: '5772 Boul. Décarie, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1600454267253-50ec4c98203b'
},
{
  id: 'knot-dasie',
  name: 'Knot d\'Asie',
  cuisine: 'asian',
  subCuisine: 'Asian fusion',
  priceLevel: 2,
  distanceMin: 20,
  waitTimeMin: 15,
  dietaryTags: [],
  description: 'Sushi + bao + bowls, sleek modern.',
  address: 'Vaudreuil-Dorion',
  imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'
},
{
  id: 'qing-hua',
  name: 'Qing Hua Dumpling',
  cuisine: 'asian',
  subCuisine: 'Chinese dumplings',
  priceLevel: 1,
  distanceMin: 9,
  waitTimeMin: 10,
  dietaryTags: ['vegan', 'vegetarian'],
  description: 'Hand-folded dumplings, vegan options too.',
  address: '1019 Boul. Saint-Laurent, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c'
},
{
  id: 'lyla',
  name: 'Lyla',
  cuisine: 'asian',
  subCuisine: 'Vietnamese BYOB',
  priceLevel: 2,
  distanceMin: 18,
  waitTimeMin: 20,
  dietaryTags: ['vegetarian'],
  description: 'BYOB, big plates, bring the squad.',
  address: '5215 Boul. Saint-Laurent, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47'
},
{
  id: 'cafeden',
  name: 'Cafeden',
  cuisine: 'asian',
  subCuisine: 'Vietnamese',
  priceLevel: 2,
  distanceMin: 11,
  waitTimeMin: 15,
  dietaryTags: ['gluten-free'],
  description: 'Killer chicken wings + papaya salad.',
  address: '7059 Saint-Hubert, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791'
},
{
  id: 'sesame',
  name: 'Sésame',
  cuisine: 'asian',
  subCuisine: 'Asian fusion',
  priceLevel: 2,
  distanceMin: 5,
  waitTimeMin: 10,
  dietaryTags: ['vegetarian'],
  description: 'Modern Asian + cocktails, downtown chic.',
  address: '187 Rue Sainte-Catherine O, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
}
```

### French (8)

```typescript
{
  id: 'lexpress',
  name: 'L\'Express',
  cuisine: 'french',
  subCuisine: 'Parisian bistro',
  priceLevel: 3,
  distanceMin: 8,
  waitTimeMin: 30,
  dietaryTags: [],
  description: 'Iconic. Checkered floor. Old-school perfect.',
  address: '3927 Rue Saint-Denis, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
},
{
  id: 'lemeac',
  name: 'Leméac',
  cuisine: 'french',
  subCuisine: 'Brasserie',
  priceLevel: 3,
  distanceMin: 15,
  waitTimeMin: 20,
  dietaryTags: ['vegetarian'],
  description: 'Outremont classic. Brunch is the move.',
  address: '1045 Av. Laurier O, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
},
{
  id: 'boulevardier',
  name: 'Le Boulevardier',
  cuisine: 'french',
  subCuisine: 'French classic',
  priceLevel: 3,
  distanceMin: 6,
  waitTimeMin: 15,
  dietaryTags: [],
  description: 'Escoffier-inspired, downtown go-to.',
  address: '2050 Rue Mansfield, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1592861956120-e524fc739696'
},
{
  id: 'henri',
  name: 'Henri Brasserie Française',
  cuisine: 'french',
  subCuisine: 'Brasserie',
  priceLevel: 3,
  distanceMin: 5,
  waitTimeMin: 10,
  dietaryTags: ['vegetarian'],
  description: 'Birks building. 19th-century glam.',
  address: '1240 Rue du Square-Phillips, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d'
},
{
  id: 'pois-penche',
  name: 'Le Pois Penché',
  cuisine: 'french',
  subCuisine: 'Parisian brasserie',
  priceLevel: 2,
  distanceMin: 7,
  waitTimeMin: 15,
  dietaryTags: ['vegetarian'],
  description: 'Onion soup + duck confit done right.',
  address: '1230 Boul. de Maisonneuve O, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141'
},
{
  id: 'bouillon-albert',
  name: 'Bouillon Albert',
  cuisine: 'french',
  subCuisine: 'French casual',
  priceLevel: 1,
  distanceMin: 9,
  waitTimeMin: 10,
  dietaryTags: ['vegetarian'],
  description: 'Affordable bouillon style, escargots welcome.',
  address: '4825 Av. du Parc, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
},
{
  id: 'au-petit-extra',
  name: 'Au Petit Extra',
  cuisine: 'french',
  subCuisine: 'Neighborhood bistro',
  priceLevel: 2,
  distanceMin: 16,
  waitTimeMin: 20,
  dietaryTags: ['vegetarian'],
  description: 'Since 1985. Neighborhood institution.',
  address: '1690 Rue Ontario E, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de'
},
{
  id: 'modavie',
  name: 'Modavie',
  cuisine: 'french',
  subCuisine: 'Bistro + jazz',
  priceLevel: 2,
  distanceMin: 12,
  waitTimeMin: 15,
  dietaryTags: [],
  description: 'Old Montréal vibes, live jazz, wine bar.',
  address: '1 Rue Saint-Paul O, Montréal',
  imageUrl: 'https://images.unsplash.com/photo-1592861956120-e524fc739696'
}
```

### Image URL note
Image URLs above are Unsplash placeholders (categorized: noodle soups, banh mi, dumplings, French bistros, brasseries). Verify each loads before committing. If any fail, replace via Unsplash search with these keywords:
- Vietnamese dishes: `vietnamese pho`, `banh mi`, `vietnamese noodle`
- French dishes: `french bistro`, `parisian restaurant`, `escargot`, `french brasserie`
- Generic: `restaurant interior cozy`, `restaurant table setting`

### Filter passing logic for Phở Liên (winner)

When Serena picks: Asian cuisine, no dietary restrictions, 15-min walk OK, mid-budget — Phở Liên passes all filters and gets:

| Player | Vote | Reason |
|---|---|---|
| Serena (real) | yes | (real swipe) |
| Rachelle | yes | Has vegetarian options ✓ |
| Aiden | yes | Loves Asian ✓ |
| Ellie | yes | Gluten-free pho ✓ |
| Chloe | yes | Cheap + comfort ✓ |
| Stephen | no | Slightly far for him |
| Khue | yes | Vegan + Asian + cheap ✓ |
| Linh | yes | Vietnamese ❤️ |

= **7/8 votes** → winner.

Other restaurants get 2-5 votes per the fakeVotePattern in mockData.ts to make the bar chart look natural.


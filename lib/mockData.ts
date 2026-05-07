/**
 * Meal Match — mock data & deterministic demo logic.
 * Phase 2: swap implementations here for Supabase; UI imports only this module.
 */

export type Cuisine =
  | "asian"
  | "french"
  | "healthy"
  | "comfort"
  | "italian"
  | "mexican";

export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "nut-free";

export type Restaurant = {
  id: string;
  name: string;
  cuisine: Cuisine;
  subCuisine: string;
  priceLevel: 1 | 2 | 3;
  distanceMin: number;
  waitTimeMin: number;
  dietaryTags: DietaryTag[];
  imageUrl: string;
  description: string;
  address: string;
  mapsUrl: string;
};

export type Player = {
  id: string;
  name: string;
  isHost: boolean;
  profile: string;
};

export type VoteMap = Record<string, "yes" | "no">;

export type OnboardingAnswers = {
  cuisines: string[];
  dietary: string[];
  distanceId: string;
  waitId: string;
  budgetId: string;
};

export type Constraint = {
  kind:
    | "cuisine"
    | "dietary"
    | "distance"
    | "wait"
    | "budget"
    | "consensus";
  detail?: string;
};

export type VoteTotals = {
  restaurantId: string;
  yes: number;
  no: number;
};

export const SERENA_ID = "serena";

/** Generic food photo if a restaurant image fails to load (Unsplash). */
export const RESTAURANT_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800";

function mapsLink(name: string, address: string): string {
  const q = encodeURIComponent(`${name}, ${address}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

const RESTAURANTS: Restaurant[] = [
  {
    id: "pho-lien",
    name: "Phở Liên",
    cuisine: "asian",
    subCuisine: "Vietnamese",
    priceLevel: 1,
    distanceMin: 12,
    waitTimeMin: 10,
    dietaryTags: ["vegetarian", "vegan", "gluten-free", "nut-free"],
    description: "Legendary pho, no-frills, the OG.",
    address: "5703 Chemin de la Côte-des-Neiges, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800",
    mapsUrl: mapsLink("Phở Liên", "5703 Chemin de la Côte-des-Neiges, Montréal"),
  },
  {
    id: "red-tiger",
    name: "Le Red Tiger",
    cuisine: "asian",
    subCuisine: "Modern Vietnamese",
    priceLevel: 2,
    distanceMin: 8,
    waitTimeMin: 20,
    dietaryTags: ["vegetarian"],
    description: "Stylish takes on Vietnamese street food.",
    address: "1201 Rue de Bullion, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    mapsUrl: mapsLink("Le Red Tiger", "1201 Rue de Bullion, Montréal"),
  },
  {
    id: "bistro-co-ut",
    name: "Bistro Cô Út",
    cuisine: "asian",
    subCuisine: "Vietnamese",
    priceLevel: 1,
    distanceMin: 6,
    waitTimeMin: 5,
    dietaryTags: ["vegetarian", "nut-free"],
    description: "Cozy spot, generous portions, authentic.",
    address: "1791 Rue Sainte-Catherine O, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=800",
    mapsUrl: mapsLink("Bistro Cô Út", "1791 Rue Sainte-Catherine O, Montréal"),
  },
  {
    id: "tran-cantine",
    name: "Tran Cantine",
    cuisine: "asian",
    subCuisine: "Modern Vietnamese",
    priceLevel: 2,
    distanceMin: 15,
    waitTimeMin: 15,
    dietaryTags: ["vegetarian", "vegan"],
    description: "Young, creative, family-run vibes.",
    address: "6076 Rue Saint-Hubert, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800",
    mapsUrl: mapsLink("Tran Cantine", "6076 Rue Saint-Hubert, Montréal"),
  },
  {
    id: "pho-bac-97",
    name: "Pho Bac 97",
    cuisine: "asian",
    subCuisine: "Vietnamese",
    priceLevel: 1,
    distanceMin: 10,
    waitTimeMin: 25,
    dietaryTags: ["gluten-free"],
    description: "Locals say best pho in town. Worth the line.",
    address: "1016 Boul. Saint-Laurent, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1576577445504-6af96477db52?w=800",
    mapsUrl: mapsLink("Pho Bac 97", "1016 Boul. Saint-Laurent, Montréal"),
  },
  {
    id: "petit-sao",
    name: "Le Petit Sao",
    cuisine: "asian",
    subCuisine: "Vietnamese",
    priceLevel: 1,
    distanceMin: 7,
    waitTimeMin: 5,
    dietaryTags: ["vegetarian", "vegan"],
    description: "Bright, colorful, lots of veggie options.",
    address: "4380 Rue Saint-Denis, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
    mapsUrl: mapsLink("Le Petit Sao", "4380 Rue Saint-Denis, Montréal"),
  },
  {
    id: "hoang-oanh",
    name: "Hoang Oanh Sandwich",
    cuisine: "asian",
    subCuisine: "Banh mi",
    priceLevel: 1,
    distanceMin: 14,
    waitTimeMin: 5,
    dietaryTags: ["vegetarian"],
    description: "Best banh mi, sesame bread, real cheap.",
    address: "5772 Boul. Décarie, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1623205161276-6db8c1c97b13?w=800",
    mapsUrl: mapsLink("Hoang Oanh Sandwich", "5772 Boul. Décarie, Montréal"),
  },
  {
    id: "knot-dasie",
    name: "Knot d'Asie",
    cuisine: "asian",
    subCuisine: "Asian fusion",
    priceLevel: 2,
    distanceMin: 20,
    waitTimeMin: 15,
    dietaryTags: [],
    description: "Sushi + bao + bowls, sleek modern.",
    address: "Vaudreuil-Dorion",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
    mapsUrl: mapsLink("Knot d'Asie", "Vaudreuil-Dorion"),
  },
  {
    id: "qing-hua",
    name: "Qing Hua Dumpling",
    cuisine: "asian",
    subCuisine: "Chinese dumplings",
    priceLevel: 1,
    distanceMin: 9,
    waitTimeMin: 10,
    dietaryTags: ["vegan", "vegetarian"],
    description: "Hand-folded dumplings, vegan options too.",
    address: "1019 Boul. Saint-Laurent, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800",
    mapsUrl: mapsLink("Qing Hua Dumpling", "1019 Boul. Saint-Laurent, Montréal"),
  },
  {
    id: "lyla",
    name: "Lyla",
    cuisine: "asian",
    subCuisine: "Vietnamese BYOB",
    priceLevel: 2,
    distanceMin: 18,
    waitTimeMin: 20,
    dietaryTags: ["vegetarian"],
    description: "BYOB, big plates, bring the squad.",
    address: "5215 Boul. Saint-Laurent, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    mapsUrl: mapsLink("Lyla", "5215 Boul. Saint-Laurent, Montréal"),
  },
  {
    id: "cafeden",
    name: "Cafeden",
    cuisine: "asian",
    subCuisine: "Vietnamese",
    priceLevel: 2,
    distanceMin: 11,
    waitTimeMin: 15,
    dietaryTags: ["gluten-free"],
    description: "Killer chicken wings + papaya salad.",
    address: "7059 Saint-Hubert, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=800",
    mapsUrl: mapsLink("Cafeden", "7059 Saint-Hubert, Montréal"),
  },
  {
    id: "sesame",
    name: "Sésame",
    cuisine: "asian",
    subCuisine: "Asian fusion",
    priceLevel: 2,
    distanceMin: 5,
    waitTimeMin: 10,
    dietaryTags: ["vegetarian"],
    description: "Modern Asian + cocktails, downtown chic.",
    address: "187 Rue Sainte-Catherine O, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    mapsUrl: mapsLink("Sésame", "187 Rue Sainte-Catherine O, Montréal"),
  },
  {
    id: "lexpress",
    name: "L'Express",
    cuisine: "french",
    subCuisine: "Parisian bistro",
    priceLevel: 3,
    distanceMin: 8,
    waitTimeMin: 30,
    dietaryTags: [],
    description: "Iconic. Checkered floor. Old-school perfect.",
    address: "3927 Rue Saint-Denis, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    mapsUrl: mapsLink("L'Express", "3927 Rue Saint-Denis, Montréal"),
  },
  {
    id: "lemeac",
    name: "Leméac",
    cuisine: "french",
    subCuisine: "Brasserie",
    priceLevel: 3,
    distanceMin: 15,
    waitTimeMin: 20,
    dietaryTags: ["vegetarian"],
    description: "Outremont classic. Brunch is the move.",
    address: "1045 Av. Laurier O, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    mapsUrl: mapsLink("Leméac", "1045 Av. Laurier O, Montréal"),
  },
  {
    id: "boulevardier",
    name: "Le Boulevardier",
    cuisine: "french",
    subCuisine: "French classic",
    priceLevel: 3,
    distanceMin: 6,
    waitTimeMin: 15,
    dietaryTags: [],
    description: "Escoffier-inspired, downtown go-to.",
    address: "2050 Rue Mansfield, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800",
    mapsUrl: mapsLink("Le Boulevardier", "2050 Rue Mansfield, Montréal"),
  },
  {
    id: "henri",
    name: "Henri Brasserie Française",
    cuisine: "french",
    subCuisine: "Brasserie",
    priceLevel: 3,
    distanceMin: 5,
    waitTimeMin: 10,
    dietaryTags: ["vegetarian"],
    description: "Birks building. 19th-century glam.",
    address: "1240 Rue du Square-Phillips, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800",
    mapsUrl: mapsLink(
      "Henri Brasserie Française",
      "1240 Rue du Square-Phillips, Montréal",
    ),
  },
  {
    id: "pois-penche",
    name: "Le Pois Penché",
    cuisine: "french",
    subCuisine: "Parisian brasserie",
    priceLevel: 2,
    distanceMin: 7,
    waitTimeMin: 15,
    dietaryTags: ["vegetarian"],
    description: "Onion soup + duck confit done right.",
    address: "1230 Boul. de Maisonneuve O, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800",
    mapsUrl: mapsLink("Le Pois Penché", "1230 Boul. de Maisonneuve O, Montréal"),
  },
  {
    id: "bouillon-albert",
    name: "Bouillon Albert",
    cuisine: "french",
    subCuisine: "French casual",
    priceLevel: 1,
    distanceMin: 9,
    waitTimeMin: 10,
    dietaryTags: ["vegetarian"],
    description: "Affordable bouillon style, escargots welcome.",
    address: "4825 Av. du Parc, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    mapsUrl: mapsLink("Bouillon Albert", "4825 Av. du Parc, Montréal"),
  },
  {
    id: "au-petit-extra",
    name: "Au Petit Extra",
    cuisine: "french",
    subCuisine: "Neighborhood bistro",
    priceLevel: 2,
    distanceMin: 16,
    waitTimeMin: 20,
    dietaryTags: ["vegetarian"],
    description: "Since 1985. Neighborhood institution.",
    address: "1690 Rue Ontario E, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
    mapsUrl: mapsLink("Au Petit Extra", "1690 Rue Ontario E, Montréal"),
  },
  {
    id: "modavie",
    name: "Modavie",
    cuisine: "french",
    subCuisine: "Bistro + jazz",
    priceLevel: 2,
    distanceMin: 12,
    waitTimeMin: 15,
    dietaryTags: [],
    description: "Old Montréal vibes, live jazz, wine bar.",
    address: "1 Rue Saint-Paul O, Montréal",
    imageUrl:
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800",
    mapsUrl: mapsLink("Modavie", "1 Rue Saint-Paul O, Montréal"),
  },
];

const PLAYERS: Player[] = [
  { id: SERENA_ID, name: "Serena", isHost: true, profile: "Host — the real swiper" },
  {
    id: "rachelle",
    name: "Rachelle",
    isHost: false,
    profile: "Vegetarian, prefers French, hates waiting",
  },
  {
    id: "aiden",
    name: "Aiden",
    isHost: false,
    profile: "No restrictions, loves Asian, OK with longer walks",
  },
  {
    id: "ellie",
    name: "Ellie",
    isHost: false,
    profile: "Gluten-free, prefers healthy, mid-budget",
  },
  {
    id: "chloe",
    name: "Chloe",
    isHost: false,
    profile: "No restrictions, prefers comfort food, low budget",
  },
  {
    id: "stephen",
    name: "Stephen",
    isHost: false,
    profile: "Nut allergy, no cuisine pref, willing to travel",
  },
  {
    id: "khue",
    name: "Khue",
    isHost: false,
    profile: "Vegan, prefers Asian + healthy, low budget",
  },
  {
    id: "linh",
    name: "Linh",
    isHost: false,
    profile: "No restrictions, prefers Vietnamese, mid-budget",
  },
];

const FAKE_RESTAURANT_VOTES: Record<string, { yes: string[]; no: string[] }> = {
  "pho-lien": {
    yes: ["rachelle", "aiden", "ellie", "chloe", "khue", "linh"],
    no: ["stephen"],
  },
  "red-tiger": {
    yes: ["rachelle", "aiden", "stephen"],
    no: ["ellie", "chloe", "khue", "linh"],
  },
  "bistro-co-ut": {
    yes: ["aiden", "linh", "chloe", "stephen"],
    no: ["rachelle", "ellie", "khue"],
  },
  "tran-cantine": {
    yes: ["khue", "linh", "ellie", "aiden"],
    no: ["rachelle", "chloe", "stephen"],
  },
  "pho-bac-97": {
    yes: ["aiden", "linh", "chloe"],
    no: ["rachelle", "ellie", "stephen", "khue"],
  },
  "petit-sao": {
    yes: ["rachelle", "khue", "ellie", "linh"],
    no: ["aiden", "chloe", "stephen"],
  },
  "hoang-oanh": {
    yes: ["chloe", "aiden"],
    no: ["rachelle", "ellie", "stephen", "khue", "linh"],
  },
  "knot-dasie": {
    yes: ["aiden", "stephen"],
    no: ["rachelle", "ellie", "chloe", "khue", "linh"],
  },
  "qing-hua": {
    yes: ["ellie", "khue", "rachelle"],
    no: ["aiden", "chloe", "stephen", "linh"],
  },
  lyla: {
    yes: ["linh", "aiden", "chloe"],
    no: ["rachelle", "ellie", "stephen", "khue"],
  },
  cafeden: {
    yes: ["linh", "aiden"],
    no: ["rachelle", "ellie", "chloe", "stephen", "khue"],
  },
  sesame: {
    yes: ["aiden", "rachelle", "chloe"],
    no: ["ellie", "stephen", "khue", "linh"],
  },
  lexpress: {
    yes: ["rachelle", "stephen"],
    no: ["aiden", "ellie", "chloe", "khue", "linh"],
  },
  lemeac: {
    yes: ["rachelle", "ellie"],
    no: ["aiden", "chloe", "stephen", "khue", "linh"],
  },
  boulevardier: {
    yes: ["stephen", "chloe"],
    no: ["rachelle", "ellie", "aiden", "khue", "linh"],
  },
  henri: {
    yes: ["rachelle", "ellie"],
    no: ["aiden", "chloe", "stephen", "khue", "linh"],
  },
  "pois-penche": {
    yes: ["rachelle", "chloe"],
    no: ["aiden", "ellie", "stephen", "khue", "linh"],
  },
  "bouillon-albert": {
    yes: ["chloe", "khue", "rachelle"],
    no: ["aiden", "ellie", "stephen", "linh"],
  },
  "au-petit-extra": {
    yes: ["rachelle"],
    no: ["aiden", "ellie", "chloe", "stephen", "khue", "linh"],
  },
  modavie: {
    yes: ["stephen"],
    no: ["rachelle", "aiden", "ellie", "chloe", "khue", "linh"],
  },
};

const FAKE_STATUS = [
  { text: "Rachelle is voting...", playerId: "rachelle" },
  { text: "Aiden voted ✓", playerId: "aiden" },
  { text: "Ellie is voting...", playerId: "ellie" },
  { text: "Chloe voted ✓", playerId: "chloe" },
  { text: "Stephen is voting...", playerId: "stephen" },
  { text: "Khue voted ✓", playerId: "khue" },
  { text: "Linh is voting...", playerId: "linh" },
];

export function getPlayerVotes(playerId: string): VoteMap {
  const map: VoteMap = {};
  if (playerId === SERENA_ID) return map;
  for (const r of RESTAURANTS) {
    const slot = FAKE_RESTAURANT_VOTES[r.id];
    if (!slot) continue;
    if (slot.yes.includes(playerId)) map[r.id] = "yes";
    else if (slot.no.includes(playerId)) map[r.id] = "no";
    else map[r.id] = "yes";
  }
  return map;
}

export function getPlayers(): Player[] {
  return PLAYERS.map((p) => ({ ...p }));
}

export function getRestaurants(): Restaurant[] {
  return RESTAURANTS.map((r) => ({ ...r }));
}

export function getRoomCode(): string {
  return "MONTREAL GROUP 08";
}

export function getRoomUrl(): string {
  return "https://meal-match.app/r/MONTREAL-GROUP-08";
}

export function constraintsFromOnboarding(o: OnboardingAnswers): Constraint[] {
  const c: Constraint[] = [];
  if (o.cuisines.length) {
    c.push({ kind: "cuisine", detail: o.cuisines.join(",") });
  }
  if (o.dietary.length && !o.dietary.includes("none")) {
    c.push({ kind: "dietary", detail: o.dietary.join(",") });
  }
  c.push({ kind: "distance", detail: o.distanceId });
  c.push({ kind: "wait", detail: o.waitId });
  c.push({ kind: "budget", detail: o.budgetId });
  return c;
}

function distanceMax(id: string): number {
  switch (id) {
    case "5":
      return 6;
    case "10":
      return 11;
    case "15":
      return 20;
    default:
      return 999;
  }
}

function waitMax(id: string): number {
  switch (id) {
    case "none":
      return 12;
    case "15":
      return 15;
    default:
      return 999;
  }
}

function budgetMax(id: string): number {
  switch (id) {
    case "1":
      return 1;
    case "2":
      return 2;
    default:
      return 3;
  }
}

function dietTagFromPill(p: string): DietaryTag | null {
  const map: Record<string, DietaryTag> = {
    vegetarian: "vegetarian",
    vegan: "vegan",
    "gluten-free": "gluten-free",
    dairy: "dairy-free",
    "dairy-free": "dairy-free",
    nut: "nut-free",
  };
  return map[p] ?? null;
}

function restaurantMatchesCuisines(
  r: Restaurant,
  selectedKeys: string[],
): boolean {
  if (selectedKeys.length === 0) return false;
  let anyMatch = false;
  for (const key of selectedKeys) {
    if (key === "asian" && r.cuisine === "asian") anyMatch = true;
    if (key === "french" && r.cuisine === "french") anyMatch = true;
    if (key === "healthy") {
      if (
        r.dietaryTags.includes("vegan") ||
        r.dietaryTags.includes("vegetarian")
      ) {
        anyMatch = true;
      }
    }
    if (key === "comfort") {
      if (r.priceLevel <= 2 && (r.cuisine === "asian" || r.cuisine === "french")) {
        anyMatch = true;
      }
    }
    if (key === "italian" && r.subCuisine.toLowerCase().includes("italian")) {
      anyMatch = true;
    }
    if (key === "mexican" && r.subCuisine.toLowerCase().includes("mexican")) {
      anyMatch = true;
    }
  }
  return anyMatch;
}

function restaurantMatchesDietary(r: Restaurant, pills: string[]): boolean {
  const reqs = pills
    .filter((p) => p !== "none" && p !== "other")
    .map(dietTagFromPill)
    .filter(Boolean) as DietaryTag[];
  if (reqs.length === 0) return true;
  for (const req of reqs) {
    if (!r.dietaryTags.includes(req)) return false;
  }
  return true;
}

export function filterRestaurantsForDeck(o: OnboardingAnswers): Restaurant[] {
  const dMax = distanceMax(o.distanceId);
  const wMax = waitMax(o.waitId);
  const bMax = budgetMax(o.budgetId);

  const list = RESTAURANTS.filter((r) => {
    if (!restaurantMatchesCuisines(r, o.cuisines)) return false;
    if (!restaurantMatchesDietary(r, o.dietary)) return false;
    if (r.distanceMin > dMax) return false;
    if (r.waitTimeMin > wMax) return false;
    if (r.priceLevel > bMax) return false;
    return true;
  });

  if (list.length >= 8) return list.slice(0, 12);

  const fallback = RESTAURANTS.filter(
    (r) =>
      r.distanceMin <= dMax &&
      r.priceLevel <= bMax &&
      restaurantMatchesDietary(r, o.dietary),
  );
  const merged: Restaurant[] = [];
  const seen = new Set<string>();
  for (const r of [...list, ...fallback]) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      merged.push(r);
    }
  }
  return merged.slice(0, 12);
}

export function tallyVotesForRestaurant(
  restaurantId: string,
  serenaVote?: "yes" | "no",
): VoteTotals {
  const base = FAKE_RESTAURANT_VOTES[restaurantId] ?? { yes: [], no: [] };
  let yes = base.yes.length;
  let no = base.no.length;
  if (serenaVote === "yes") yes += 1;
  if (serenaVote === "no") no += 1;
  return { restaurantId, yes, no };
}

export function tallyAllVotesInDeck(
  deckIds: string[],
  serenaVotes: Record<string, "yes" | "no">,
): VoteTotals[] {
  return deckIds.map((id) =>
    tallyVotesForRestaurant(id, serenaVotes[id]),
  );
}

export function fakeYesCountExcludingSerena(restaurantId: string): number {
  return FAKE_RESTAURANT_VOTES[restaurantId]?.yes.length ?? 0;
}

export function calculateWinner(
  votesPerRestaurant: VoteTotals[],
  constraints: Constraint[],
): Restaurant | null {
  void constraints;
  if (!votesPerRestaurant.length) return null;
  const sorted = [...votesPerRestaurant].sort((a, b) => b.yes - a.yes);
  const top = sorted[0];
  const pho = votesPerRestaurant.find((v) => v.restaurantId === "pho-lien");
  if (pho && top && pho.yes === top.yes) {
    return RESTAURANTS.find((r) => r.id === "pho-lien") ?? null;
  }
  return RESTAURANTS.find((r) => r.id === top.restaurantId) ?? null;
}

export function topVoteRows(
  totals: VoteTotals[],
  limit = 5,
): { name: string; restaurantId: string; yes: number; max: number }[] {
  const max = 8;
  return [...totals]
    .sort((a, b) => b.yes - a.yes)
    .slice(0, limit)
    .map((t) => ({
      restaurantId: t.restaurantId,
      name:
        RESTAURANTS.find((r) => r.id === t.restaurantId)?.name ?? t.restaurantId,
      yes: t.yes,
      max,
    }));
}

export function shouldShowNoMatch(
  serenaVotes: Record<string, "yes" | "no">,
  deckIds: string[],
): boolean {
  if (!deckIds.length) return true;
  let allVetoed = true;
  for (const id of deckIds) {
    const t = tallyVotesForRestaurant(id, serenaVotes[id]);
    if (t.no < 4) allVetoed = false;
  }
  return allVetoed;
}

export function simulatePlayerJoin(
  onJoin: (player: Player, joinedCount: number) => void,
): () => void {
  const ordered = [...PLAYERS].sort((a, b) => {
    if (a.isHost) return -1;
    if (b.isHost) return 1;
    return 0;
  });
  const timers: ReturnType<typeof setTimeout>[] = [];
  let idx = 0;

  const scheduleNext = () => {
    if (idx >= ordered.length) return;
    const delay = idx === 0 ? 0 : 600;
    const t = setTimeout(() => {
      const p = ordered[idx];
      idx += 1;
      onJoin(p, idx);
      scheduleNext();
    }, delay);
    timers.push(t);
  };
  scheduleNext();

  return () => timers.forEach(clearTimeout);
}

export function simulatePlayerVoting(
  onTick: (status: { text: string; playerId?: string }) => void,
): () => void {
  let i = 0;
  onTick(FAKE_STATUS[0]);
  const id = setInterval(() => {
    i = (i + 1) % FAKE_STATUS.length;
    onTick(FAKE_STATUS[i]);
  }, 2000);
  return () => clearInterval(id);
}

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import dynamic from "next/dynamic";
import { RestaurantImage } from "@/components/RestaurantImage";
import confetti from "canvas-confetti";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Mascot } from "@/components/Mascot";
import type { OnboardingAnswers, Player, Restaurant } from "@/lib/mockData";
import {
  calculateWinner,
  constraintsFromOnboarding,
  fakeYesCountExcludingSerena,
  filterRestaurantsForDeck,
  getPlayers,
  getRoomCode,
  getRoomUrl,
  shouldShowNoMatch,
  simulatePlayerJoin,
  simulatePlayerVoting,
  tallyAllVotesInDeck,
  tallyVotesForRestaurant,
  topVoteRows,
  getRestaurants,
} from "@/lib/mockData";

const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((m) => m.QRCodeSVG),
  { ssr: false },
);

const spring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
  mass: 0.9,
};

const springSlow = {
  type: "spring" as const,
  stiffness: 200,
  damping: 30,
  mass: 1,
};

function priceLabel(level: 1 | 2 | 3): string {
  return "$".repeat(level);
}

function tryVibrate(ms = 12) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}

const CUISINE_OPTIONS = [
  { key: "asian", label: "🍜 Asian (Vietnamese, Japanese, Korean, Thai)" },
  { key: "french", label: "🥐 French / European" },
  { key: "healthy", label: "🥗 Healthy / Salads" },
  { key: "comfort", label: "🍔 Comfort / Burgers" },
  { key: "italian", label: "🍕 Italian" },
  { key: "mexican", label: "🌮 Mexican / Latin" },
];

const DIETARY_OPTIONS = [
  { key: "none", label: "None" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "vegan", label: "Vegan" },
  { key: "gluten-free", label: "Gluten-free" },
  { key: "dairy-free", label: "Dairy-free" },
  { key: "nut", label: "Nut allergy" },
  { key: "other", label: "Other" },
];

const DISTANCE_OPTIONS = [
  { id: "5", title: "🚶 5-min walk" },
  { id: "10", title: "🚶‍♀️ 10-min walk" },
  { id: "15", title: "🚇 15-min by metro" },
  { id: "any", title: "🚗 Anywhere worth it" },
];

const WAIT_OPTIONS = [
  { id: "none", title: "⚡ No wait, I'm starving" },
  { id: "15", title: "⏱ 15-min OK" },
  { id: "long", title: "🛋 Happy to wait if good" },
];

const BUDGET_OPTIONS = [
  { id: "1", title: "💰 $ — Cheap eats" },
  { id: "2", title: "💰💰 $$ — Mid-range" },
  { id: "3", title: "💰💰💰 $$$ — Treat day" },
];

const PLAYER_DOT: Record<string, string> = {
  serena: "#E8825F",
  rachelle: "#7FB069",
  aiden: "#5BA3C6",
  ellie: "#F4C95D",
  chloe: "#F5A593",
  stephen: "#9B8FD9",
  khue: "#6BC4A3",
  linh: "#E07FA0",
};

function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof motion.button>, "children">) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={spring}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[56px] w-full rounded-pill px-6 font-body text-[17px] font-semibold shadow-warm transition-colors ${
        disabled
          ? "cursor-not-allowed bg-cocoa/15 text-cocoa-soft"
          : "bg-coral text-surface hover:bg-coral/95"
      } ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

function OutlineButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      transition={spring}
      onClick={onClick}
      className={`min-h-[56px] w-full rounded-pill border-[0.5px] border-cocoa/40 bg-surface px-6 font-body text-[17px] font-semibold text-cocoa shadow-warm-sm ${className}`}
    >
      {children}
    </motion.button>
  );
}

type FlowStep =
  | "landing"
  | "lobby"
  | "onboarding"
  | "prefTally"
  | "swipe"
  | "voteTally"
  | "reveal"
  | "noMatch";

/** One shared layout for peek + front so promoting a card never adds new rows (no two-stage reveal). */
function RestaurantCardFace({
  restaurant,
  imagePriority,
}: {
  restaurant: Restaurant;
  imagePriority: boolean;
}) {
  return (
    <>
      <div className="relative h-[300px] w-full shrink-0">
        <RestaurantImage
          src={restaurant.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="340px"
          {...(imagePriority
            ? { priority: true, loading: "eager" as const }
            : { loading: "lazy" as const })}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa/50 via-transparent to-transparent" />
      </div>
      <div className="flex min-h-[276px] flex-col space-y-2 p-5 pb-6">
        <h3 className="font-display text-[26px] leading-tight text-cocoa">
          {restaurant.name}
        </h3>
        <p className="font-body text-[15px] text-cocoa-soft">
          {restaurant.subCuisine} · {priceLabel(restaurant.priceLevel)}
        </p>
        <p className="font-body text-[15px] leading-snug text-cocoa">
          {restaurant.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-3 pt-3 font-body text-sm text-cocoa-soft">
          <span className="rounded-pill bg-peach/40 px-3 py-1 text-cocoa">
            🚶 {restaurant.distanceMin} min
          </span>
          <span className="rounded-pill bg-mustard/35 px-3 py-1 text-cocoa">
            ⏱ ~{restaurant.waitTimeMin} min wait
          </span>
        </div>
      </div>
    </>
  );
}

function StackBackCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-2 mx-auto flex min-h-[592px] w-full max-w-[340px] translate-y-2 scale-[0.96] flex-col overflow-hidden rounded-card border-[0.5px] border-cocoa/10 bg-surface opacity-95 shadow-warm-sm"
      aria-hidden
    >
      <RestaurantCardFace restaurant={restaurant} imagePriority={false} />
    </div>
  );
}

function SwipeCard({
  restaurant,
  onDone,
}: {
  restaurant: Restaurant;
  onDone: (dir: "yes" | "no") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-15, 15]);

  const [dragging, setDragging] = useState(true);

  const finish = useCallback(
    async (dir: "yes" | "no") => {
      setDragging(false);
      tryVibrate(14);
      const { animate } = await import("framer-motion");
      await animate(x, dir === "yes" ? 520 : -520, {
        type: "spring",
        stiffness: 320,
        damping: 28,
        mass: 0.85,
      });
      onDone(dir);
    },
    [onDone, x],
  );

  return (
    <motion.div
      style={{
        x,
        rotate,
        zIndex: 1,
      }}
      drag={dragging ? "x" : false}
      dragElastic={0.9}
      onDragStart={() => tryVibrate(8)}
      onDragEnd={(_, info) => {
        if (!dragging) return;
        const { offset, velocity } = info;
        if (offset.x > 100 || velocity.x > 420) {
          void finish("yes");
        } else if (offset.x < -100 || velocity.x < -420) {
          void finish("no");
        }
      }}
      className="absolute inset-x-0 top-0 mx-auto flex min-h-[592px] w-full max-w-[340px] touch-none flex-col overflow-hidden rounded-card border-[0.5px] border-cocoa/15 bg-surface shadow-warm"
    >
      <RestaurantCardFace restaurant={restaurant} imagePriority />
    </motion.div>
  );
}

export function MealMatchApp() {
  const [flowStep, setFlowStep] = useState<FlowStep>("landing");
  const [onboardingIdx, setOnboardingIdx] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    cuisines: [],
    dietary: [],
    distanceId: "",
    waitId: "",
    budgetId: "",
  });

  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [voteBanner, setVoteBanner] = useState<string | null>(null);
  const [voteStatus, setVoteStatus] = useState({ text: "", playerId: "" });

  const [deck, setDeck] = useState<Restaurant[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [serenaVotes, setSerenaVotes] = useState<Record<string, "yes" | "no">>(
    {},
  );

  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [chartRows, setChartRows] = useState<
    { name: string; restaurantId: string; yes: number; max: number }[]
  >([]);

  const players = useMemo(() => getPlayers(), []);
  const roomCode = getRoomCode();
  const [qrValue, setQrValue] = useState(() => getRoomUrl());

  useEffect(() => {
    setQrValue(`${window.location.origin}/r/MONTREAL-GROUP-08`);
  }, []);

  const constraints = useMemo(
    () => constraintsFromOnboarding(answers),
    [answers],
  );

  const resetAll = useCallback(() => {
    setFlowStep("landing");
    setOnboardingIdx(0);
    setAnswers({
      cuisines: [],
      dietary: [],
      distanceId: "",
      waitId: "",
      budgetId: "",
    });
    setJoinedIds([]);
    setDeck([]);
    setCardIndex(0);
    setSerenaVotes({});
    setWinner(null);
    setChartRows([]);
    setVoteBanner(null);
  }, []);

  useEffect(() => {
    if (flowStep !== "lobby") return;
    setJoinedIds([]);
    const cancel = simulatePlayerJoin((_player, count) => {
      setJoinedIds(() => {
        const ordered = getPlayers().sort((a, b) => {
          if (a.isHost) return -1;
          if (b.isHost) return 1;
          return 0;
        });
        return ordered.slice(0, count).map((p) => p.id);
      });
    });
    return cancel;
  }, [flowStep]);

  useEffect(() => {
    if (flowStep !== "swipe") return;
    const cancel = simulatePlayerVoting((s) =>
      setVoteStatus({ text: s.text, playerId: s.playerId ?? "" }),
    );
    return cancel;
  }, [flowStep]);

  useEffect(() => {
    if (flowStep !== "prefTally") return;
    const t = setTimeout(() => {
      let nextDeck = filterRestaurantsForDeck(answers);
      if (!nextDeck.length) {
        nextDeck = getRestaurants().slice(0, 10);
      }
      setDeck(nextDeck);
      setCardIndex(0);
      setSerenaVotes({});
      setFlowStep("swipe");
    }, 1500);
    return () => clearTimeout(t);
  }, [flowStep, answers]);

  useEffect(() => {
    if (flowStep !== "voteTally") return;
    const t = setTimeout(() => {
      const ids = deck.map((r) => r.id);
      const totals = tallyAllVotesInDeck(ids, serenaVotes);
      const vetoAll = shouldShowNoMatch(serenaVotes, ids);
      if (vetoAll) {
        setFlowStep("noMatch");
        return;
      }
      const w = calculateWinner(totals, constraints);
      setWinner(w);
      setChartRows(topVoteRows(totals, 5));
      setFlowStep("reveal");
    }, 2000);
    return () => clearTimeout(t);
  }, [flowStep, deck, serenaVotes, constraints]);

  useEffect(() => {
    if (flowStep !== "reveal") return;
    const colors = ["#E8825F", "#7FB069", "#F4C95D"];
    const end = Date.now() + 2500;
    const frame = () => {
      void confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors,
      });
      void confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    return undefined;
  }, [flowStep]);

  const recordVote = useCallback(
    (dir: "yes" | "no") => {
      const current = deck[cardIndex];
      if (!current) return;
      setSerenaVotes((prev) => ({ ...prev, [current.id]: dir }));
      if (dir === "yes" && fakeYesCountExcludingSerena(current.id) >= 4) {
        setVoteBanner("🔥 4 others liked this too");
        setTimeout(() => setVoteBanner(null), 1600);
      }
      if (cardIndex + 1 >= deck.length) {
        setFlowStep("voteTally");
      } else {
        setCardIndex(cardIndex + 1);
      }
    },
    [cardIndex, deck],
  );

  const onboardingNext = () => {
    if (onboardingIdx < 4) {
      setOnboardingIdx((i) => i + 1);
      return;
    }
    setFlowStep("prefTally");
  };

  const canOnboardingProceed = (): boolean => {
    switch (onboardingIdx) {
      case 0:
        return answers.cuisines.length >= 1 && answers.cuisines.length <= 3;
      case 1:
        return answers.dietary.length >= 1;
      case 2:
        return Boolean(answers.distanceId);
      case 3:
        return Boolean(answers.waitId);
      case 4:
        return Boolean(answers.budgetId);
      default:
        return false;
    }
  };

  const toggleCuisine = (key: string) => {
    setAnswers((a) => {
      const has = a.cuisines.includes(key);
      let next = has
        ? a.cuisines.filter((k) => k !== key)
        : [...a.cuisines, key];
      if (next.length > 3) next = next.slice(0, 3);
      return { ...a, cuisines: next };
    });
  };

  const toggleDietary = (key: string) => {
    setAnswers((a) => {
      if (key === "none") {
        return { ...a, dietary: ["none"] };
      }
      let next = [...a.dietary.filter((d) => d !== "none")];
      if (next.includes(key)) next = next.filter((d) => d !== key);
      else next.push(key);
      return { ...a, dietary: next.length ? next : ["none"] };
    });
  };

  const forceReveal = () => {
    const ids = deck.map((r) => r.id);
    const totals = tallyAllVotesInDeck(ids, serenaVotes);
    const w = calculateWinner(totals, constraints);
    setWinner(w);
    setChartRows(topVoteRows(totals, 5));
    setFlowStep("reveal");
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-10 pt-8">
      <>
        {flowStep === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={springSlow}
            className="flex flex-1 flex-col items-center text-center"
          >
            <Mascot src="/bowlie-wave.png" alt="Bowlie waving" width={200} className="mb-4" />
            <h1 className="font-display text-[40px] leading-tight text-cocoa">
              Meal Match
            </h1>
            <p className="mt-3 font-body text-lg text-cocoa-soft">
              Stop debating. Start eating.
            </p>
            <div className="mt-auto w-full pt-16">
              <PrimaryButton data-testid="create-room" onClick={() => setFlowStep("lobby")}>
                Create a room
              </PrimaryButton>
            </div>
          </motion.div>
        )}

        {flowStep === "lobby" && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={springSlow}
            className="flex flex-1 flex-col"
          >
            <p className="text-center font-body text-sm uppercase tracking-wide text-cocoa-soft">
              Room code
            </p>
            <p className="mt-2 text-center font-display text-[32px] leading-none text-cocoa">
              {roomCode}
            </p>
            <div className="mt-6 flex justify-center rounded-card border-[0.5px] border-cocoa/12 bg-surface p-4 shadow-warm-sm">
              <QRCodeSVG
                value={qrValue}
                size={160}
                bgColor="#FFFCF7"
                fgColor="#3D2E2A"
                level="M"
              />
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              transition={spring}
              onClick={() => {
                void navigator.clipboard?.writeText(getRoomUrl());
              }}
              className="mt-4 rounded-pill border-[0.5px] border-cocoa/25 bg-peach/30 py-3 font-body text-[15px] font-semibold text-cocoa"
            >
              Copy link
            </motion.button>
            <p className="mt-1 text-center font-body text-xs text-cocoa-soft">
              {getRoomUrl()}
            </p>

            <div className="mt-8 rounded-card border-[0.5px] border-cocoa/12 bg-surface/90 p-4 shadow-warm">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-body text-sm font-semibold text-cocoa">
                  Lobby
                </span>
                <motion.span
                  key={joinedIds.length}
                  initial={{ scale: 0.86, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={spring}
                  className="font-display text-lg text-coral"
                >
                  {joinedIds.length}/8 joined
                </motion.span>
              </div>
              <ul className="space-y-2">
                {players.map((p: Player) => {
                  const joined = joinedIds.includes(p.id);
                  return (
                    <motion.li
                      key={p.id}
                      layout
                      initial={false}
                      animate={
                        joined
                          ? { scale: 1, opacity: 1, x: 0 }
                          : { scale: 0.96, opacity: 0.45, x: -4 }
                      }
                      transition={spring}
                      className="flex items-center gap-3 rounded-2xl bg-cream/80 px-3 py-2"
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full font-display text-lg text-cocoa ring-2 ring-white"
                        style={{
                          backgroundColor: PLAYER_DOT[p.id] ?? "#ccc",
                        }}
                      >
                        {p.name[0]}
                      </span>
                      <div className="flex-1">
                        <p className="font-body text-[15px] font-semibold text-cocoa">
                          {p.name}
                          {p.isHost ? " · Host" : ""}
                          {p.id === "serena" ? " (You)" : ""}
                        </p>
                        <p className="font-body text-xs text-cocoa-soft">
                          {p.profile}
                        </p>
                      </div>
                      {joined ? (
                        <span className="font-body text-sage">✓</span>
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-cocoa/15" />
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-auto w-full pt-8">
              <PrimaryButton
                data-testid="start-swiping"
                disabled={joinedIds.length < 8}
                onClick={() => setFlowStep("onboarding")}
              >
                Start swiping →
              </PrimaryButton>
            </div>
          </motion.div>
        )}

        {flowStep === "onboarding" && (
          <motion.div
            key="onboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-1 flex-col"
          >
            <Mascot
              src="/bowlie-thinking.png"
              alt=""
              width={96}
              className="absolute -right-1 top-0 z-10"
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={onboardingIdx}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={springSlow}
                className="flex flex-1 flex-col pb-28 pr-24 pt-2"
              >
                {onboardingIdx === 0 && (
                  <>
                    <h2 className="font-display text-[32px] leading-tight text-cocoa">
                      What are you craving?
                    </h2>
                    <p className="mt-2 font-body text-cocoa-soft">Pick up to 3</p>
                    <div className="mt-6 flex flex-col gap-3">
                      {CUISINE_OPTIONS.map((opt) => {
                        const active = answers.cuisines.includes(opt.key);
                        return (
                          <motion.button
                            key={opt.key}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleCuisine(opt.key)}
                            className={`rounded-pill border-[0.5px] px-4 py-3 text-left font-body text-[15px] shadow-warm-sm ${
                              active
                                ? "border-coral bg-peach/35 text-cocoa"
                                : "border-cocoa/15 bg-surface text-cocoa"
                            }`}
                          >
                            {opt.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                )}
                {onboardingIdx === 1 && (
                  <>
                    <h2 className="font-display text-[32px] leading-tight text-cocoa">
                      Any restrictions?
                    </h2>
                    <div className="mt-6 flex flex-col gap-3">
                      {DIETARY_OPTIONS.map((opt) => {
                        const active = answers.dietary.includes(opt.key);
                        return (
                          <motion.button
                            key={opt.key}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleDietary(opt.key)}
                            className={`rounded-pill border-[0.5px] px-4 py-3 text-left font-body text-[15px] shadow-warm-sm ${
                              active
                                ? "border-coral bg-peach/35 text-cocoa"
                                : "border-cocoa/15 bg-surface text-cocoa"
                            }`}
                          >
                            {opt.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                )}
                {onboardingIdx === 2 && (
                  <>
                    <h2 className="font-display text-[32px] leading-tight text-cocoa">
                      How far would you go?
                    </h2>
                    <div className="mt-6 flex flex-col gap-3">
                      {DISTANCE_OPTIONS.map((opt) => (
                        <motion.button
                          key={opt.id}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, distanceId: opt.id }))
                          }
                          className={`rounded-card border-[0.5px] p-4 text-left font-body text-[16px] shadow-warm-sm ${
                            answers.distanceId === opt.id
                              ? "border-coral bg-peach/35"
                              : "border-cocoa/15 bg-surface"
                          }`}
                        >
                          {opt.title}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
                {onboardingIdx === 3 && (
                  <>
                    <h2 className="font-display text-[32px] leading-tight text-cocoa">
                      How patient are you?
                    </h2>
                    <div className="mt-6 flex flex-col gap-3">
                      {WAIT_OPTIONS.map((opt) => (
                        <motion.button
                          key={opt.id}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, waitId: opt.id }))
                          }
                          className={`rounded-card border-[0.5px] p-4 text-left font-body text-[16px] shadow-warm-sm ${
                            answers.waitId === opt.id
                              ? "border-coral bg-peach/35"
                              : "border-cocoa/15 bg-surface"
                          }`}
                        >
                          {opt.title}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
                {onboardingIdx === 4 && (
                  <>
                    <h2 className="font-display text-[32px] leading-tight text-cocoa">
                      What&apos;s the vibe?
                    </h2>
                    <div className="mt-6 flex flex-col gap-3">
                      {BUDGET_OPTIONS.map((opt) => (
                        <motion.button
                          key={opt.id}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, budgetId: opt.id }))
                          }
                          className={`rounded-card border-[0.5px] p-4 text-left font-body text-[16px] shadow-warm-sm ${
                            answers.budgetId === opt.id
                              ? "border-coral bg-peach/35"
                              : "border-cocoa/15 bg-surface"
                          }`}
                        >
                          {opt.title}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-gradient-to-t from-cream via-cream to-transparent px-5 pb-8 pt-10">
              <PrimaryButton
                data-testid="onboarding-next"
                disabled={!canOnboardingProceed()}
                onClick={onboardingNext}
              >
                {onboardingIdx < 4 ? "Next →" : "Done →"}
              </PrimaryButton>
            </div>
          </motion.div>
        )}

        {flowStep === "prefTally" && (
          <motion.div
            key="prefTally"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <Mascot src="/bowlie-stirring.png" alt="" width={120} />
            <motion.div
              className="mt-6"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="font-display text-2xl text-cocoa">
                Tallying preferences from your group...
              </p>
              <p className="mt-2 font-body text-cocoa-soft">
                Bowlie is stirring the deck
              </p>
              <div className="mt-6 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-coral"
                    animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {flowStep === "swipe" && (
          <motion.div
            key="swipe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex min-h-0 flex-1 flex-col"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <p className="font-body text-sm font-semibold text-cocoa">
                Round 1 · {Math.min(cardIndex + 1, deck.length)}/{deck.length}
              </p>
              <motion.p
                key={voteStatus.text}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[55%] text-right font-body text-xs text-cocoa-soft"
              >
                {voteStatus.text}
              </motion.p>
            </div>

            {voteBanner ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-3 text-center font-body text-sm text-cocoa"
              >
                {voteBanner}
              </motion.div>
            ) : null}

            <div className="relative mx-auto min-h-0 w-full max-w-[340px] flex-1 overflow-hidden">
              {deck[cardIndex + 1] ? (
                <StackBackCard restaurant={deck[cardIndex + 1]!} />
              ) : null}
              {deck[cardIndex] ? (
                <SwipeCard
                  key={deck[cardIndex]!.id}
                  restaurant={deck[cardIndex]!}
                  onDone={recordVote}
                />
              ) : null}
            </div>

            <div className="relative z-20 mt-auto shrink-0 border-t-[0.5px] border-cocoa/10 bg-cream/95 px-8 pb-4 pt-4 shadow-warm-sm">
              <div className="flex items-center justify-center gap-8">
                <button
                  type="button"
                  aria-label="Pass"
                  data-testid="vote-no"
                  onClick={() => {
                    tryVibrate(14);
                    recordVote("no");
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-[0.5px] border-coral/45 bg-surface text-2xl text-coral shadow-warm-sm transition-transform active:scale-95"
                >
                  ✕
                </button>
                <button
                  type="button"
                  aria-label="Like"
                  data-testid="vote-yes"
                  onClick={() => {
                    tryVibrate(14);
                    recordVote("yes");
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-[0.5px] border-sage bg-surface text-2xl shadow-warm-sm transition-transform active:scale-95"
                >
                  ❤️
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {flowStep === "voteTally" && (
          <motion.div
            key="voteTally"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 14, -10, 12, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "55% 70%" }}
              >
                <Mascot src="/bowlie-stirring.png" alt="" width={120} />
              </motion.div>
              <motion.div
                className="pointer-events-none absolute -top-4 left-1/2 flex -translate-x-1/2 gap-1 opacity-60"
                aria-hidden
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-3 w-3 rounded-full bg-cream ring-1 ring-coral/30"
                    animate={{ y: [0, -18, -28], opacity: [0.8, 0.5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.35,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            </div>
            <h2 className="mt-12 font-display text-3xl text-cocoa">Counting votes...</h2>
            <p className="mt-2 font-body text-cocoa-soft">Bowlie is doing the math</p>
            <div className="mt-8 flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-sage"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    delay: i * 0.12,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {flowStep === "reveal" && winner && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springSlow}
            className="flex flex-1 flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0, -4, 0] }}
              transition={{ duration: 1.4, repeat: 1, ease: "easeInOut" }}
            >
              <Mascot src="/bowlie-jumping.png" alt="" width={112} />
            </motion.div>
            <p className="mt-2 font-display text-3xl text-cocoa">It&apos;s a match!</p>
            <p
              className="mt-4 text-center font-display text-[38px] leading-tight text-coral"
            >
              {winner.name}
            </p>
            <p className="mt-1 text-center font-hand text-xl text-cocoa-soft italic">
              Finally settled. 🎉
            </p>
            <p className="mt-3 text-center font-body text-cocoa-soft">
              {tallyVotesForRestaurant(winner.id, serenaVotes[winner.id]).yes}/8
              votes · satisfies everyone&apos;s diet &amp; distance
            </p>

            <div className="mt-6 w-full overflow-hidden rounded-card border-[0.5px] border-cocoa/12 bg-surface shadow-warm">
              <div className="relative h-44 w-full">
                <RestaurantImage
                  src={winner.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
              <div className="space-y-1 p-4">
                <p className="font-body text-sm text-cocoa-soft">
                  {winner.subCuisine} · {priceLabel(winner.priceLevel)}
                </p>
                <p className="font-body text-[15px] text-cocoa">{winner.description}</p>
                <p className="font-body text-xs text-cocoa-soft">{winner.address}</p>
                <p className="font-body text-xs text-cocoa-soft">
                  🚶 ~{winner.distanceMin} min
                </p>
              </div>
            </div>

            <div className="mt-8 w-full space-y-3">
              <p className="font-body text-sm font-semibold text-cocoa">Vote breakdown</p>
              {chartRows.map((row, idx) => {
                const isWin = row.restaurantId === winner.id;
                const pct = (row.yes / row.max) * 100;
                return (
                  <div key={row.restaurantId} className="space-y-1">
                    <div className="flex justify-between font-body text-xs text-cocoa">
                      <span>{row.name}</span>
                      <span>
                        {row.yes}/{row.max}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-pill bg-cream ring-1 ring-cocoa/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          ...springSlow,
                          delay: 0.2 + idx * 0.2,
                        }}
                        className={`h-full rounded-pill ${
                          isWin ? "bg-sage" : "bg-coral/70"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 w-full space-y-3">
              <PrimaryButton
                onClick={() => {
                  window.open(winner.mapsUrl, "_blank", "noopener,noreferrer");
                }}
              >
                Open in Maps
              </PrimaryButton>
              <OutlineButton onClick={resetAll}>Start over</OutlineButton>
            </div>
          </motion.div>
        )}

        {flowStep === "noMatch" && (
          <motion.div
            key="noMatch"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 flex-col items-center text-center"
          >
            <Mascot src="/bowlie-sad.png" alt="" width={100} />
            <h2 className="mt-6 font-display text-3xl text-cocoa">
              No agreement found 😅
            </h2>
            <p className="mt-3 font-body text-cocoa-soft">
              Loosen up the filters or just go with cơm tấm
            </p>
            <div className="mt-auto w-full space-y-3 pt-16">
              <PrimaryButton
                onClick={() => {
                  setOnboardingIdx(0);
                  setFlowStep("onboarding");
                }}
              >
                Try again
              </PrimaryButton>
              <OutlineButton onClick={forceReveal}>Show all top voted anyway</OutlineButton>
            </div>
          </motion.div>
        )}
      </>
    </div>
  );
}


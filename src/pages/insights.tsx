// src/pages/insights.tsx
import React, { useMemo, useRef, useState } from "react";
// shadcn/ui (or your equivalents)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
// icons
import {
  Activity,
  Wind,
  Sparkles,
  Soup,
  Gem,
  Sun,
  Moon,
  RefreshCw,
  Watch,
  HeartPulse,
  Brain,
  Gauge,
  Search,
  Check,
} from "lucide-react";

/* ----------------------------- Types & Data ----------------------------- */

export type BodyArea =
  | "head"
  | "throat"
  | "chest"
  | "solar_plexus"
  | "belly"
  | "hips"
  | "legs"
  | "feet";

export type Chakra =
  | "Root"
  | "Sacral"
  | "Solar Plexus"
  | "Heart"
  | "Throat"
  | "Third Eye"
  | "Crown";

type Biometrics = {
  rhr: number;
  hrv: number;
  sleepHours: number;
  remPct: number;
  deepPct: number;
  respRate: number;
  skinTempDelta: number;
  stress: number;
  steps: number;
};

const RECS: Record<
  Chakra,
  {
    color: string;
    mantra: string;
    foodsSentences: string[];
    stretches: string[];
    breath: string;
    microPractices: string[];
    energyInsight: string;
    crystals: string[];
    crystalPlacements: string[];
    poses: string[];
  }
> = {
  Root: {
    color: "#E53935",
    mantra: "I am safe. I am here.",
    foodsSentences: [
      "Warm lentil soup with turmeric and ginger.",
      "Roasted root vegetables with olive oil and sea salt.",
      "Beet juice or roasted beets for grounding minerals.",
      "Ginger tea or golden milk to warm and steady.",
    ],
    stretches: [
      "Knees-to-chest, 5 slow breaths.",
      "Supine hamstring stretch, 30s each side.",
    ],
    breath: "4-4-4-4 Box Breathing (2–3 min).",
    microPractices: [
      "Barefoot 3-minute earth stand.",
      "Slow walk while naming 5 things you see.",
    ],
    energyInsight: "Stability returns when you move slowly and feel your feet.",
    crystals: ["Hematite", "Black Tourmaline", "Red Jasper"],
    crystalPlacements: [
      "Pocket a Hematite stone during errands.",
      "Place Black Tourmaline by the front door for a grounded threshold.",
    ],
    poses: ["Mountain", "Warrior II", "Malasana"],
  },
  Sacral: {
    color: "#FB8C00",
    mantra: "I feel and flow with ease.",
    foodsSentences: [
      "Stewed apricots with cinnamon.",
      "Pumpkin soup with coconut and ginger.",
      "Orange slices with a pinch of sea salt and water.",
      "Coconut yogurt with mango for a soft, soothing snack.",
    ],
    stretches: [
      "Gentle hip circles, 1–2 min.",
      "Bound Angle pose, 60s with soft breath.",
    ],
    breath: "Wave breath to the belly, slow inhales/exhales.",
    microPractices: [
      "Drink a full glass of water with a squeeze of orange.",
      "2-minute sway dance to loosen the hips.",
    ],
    energyInsight: "Permission to feel opens flow and creativity.",
    crystals: ["Carnelian", "Sunstone", "Orange Calcite"],
    crystalPlacements: [
      "Carnelian 2–3 minutes on the lower belly while breathing.",
      "Orange Calcite at the bath edge during a soak.",
    ],
    poses: ["Low Lunge", "Goddess", "Bridge"],
  },
  "Solar Plexus": {
    color: "#FDD835",
    mantra: "I act with confidence.",
    foodsSentences: [
      "Ginger tea with lemon before a task.",
      "Brown rice bowl with sautéed greens and tahini.",
      "Warm miso broth or digestive bitters before meals.",
      "Turmeric rice with cumin for gentle fire.",
    ],
    stretches: [
      "Cat-Cow x 6, focus on belly expansion.",
      "Sphinx pose, 45–60s.",
    ],
    breath: "Kapalabhati (gentle set 30–50 pumps).",
    microPractices: [
      "Write one clear intention on a sticky note.",
      "3 power-stands (30s each).",
    ],
    energyInsight: "Clarity grows when you choose one next step.",
    crystals: ["Citrine", "Tiger's Eye", "Pyrite"],
    crystalPlacements: [
      "Citrine over the navel while visualizing a small sun.",
      "Pyrite cube on your desk to anchor decisive action.",
    ],
    poses: ["Boat", "Plank", "Bow"],
  },
  Heart: {
    color: "#43A047",
    mantra: "I give and receive love.",
    foodsSentences: [
      "Leafy greens with avocado and a squeeze of lime.",
      "Chamomile or lemon balm tea with honey.",
      "Cacao with warm oat milk for soft, open energy.",
      "Rose tea or hibiscus to soothe and brighten.",
    ],
    stretches: [
      "Puppy pose, 45–60s.",
      "Hands interlaced behind back, gentle lift 3 breaths.",
    ],
    breath: "Coherent breathing (5 in / 5 out, 3–5 min).",
    microPractices: [
      "Send one kind text you’ve been meaning to send.",
      "Hand over heart, name 3 things you appreciate.",
    ],
    energyInsight: "Softening the chest invites ease into conversations.",
    crystals: ["Rose Quartz", "Green Aventurine", "Malachite"],
    crystalPlacements: [
      "Rose Quartz at center chest for 2–3 minutes while breathing softly.",
      "Green Aventurine under pillow for a soothing sleep tone.",
    ],
    poses: ["Camel (supported)", "Bridge", "Puppy"],
  },
  Throat: {
    color: "#1E88E5",
    mantra: "I speak my truth clearly.",
    foodsSentences: [
      "Warm pear with a drizzle of raw honey.",
      "Blueberry spinach smoothie with ginger.",
      "Throat-soothing tea: ginger, honey, lemon.",
      "Light soups and broths to soften jaw and throat.",
    ],
    stretches: [
      "Neck side stretch, 20s each side.",
      "Lion’s breath with gentle jaw release.",
    ],
    breath: "Humming exhale (mmm) for 1–2 minutes.",
    microPractices: [
      "Say the one line you’re avoiding, kindly and clearly.",
      "Hum your favorite tune for 60 seconds.",
    ],
    energyInsight: "Clarity lands when sound and honesty meet.",
    crystals: ["Aquamarine", "Blue Lace Agate", "Sodalite"],
    crystalPlacements: [
      "Blue Lace Agate at the throat while journaling one paragraph.",
      "Aquamarine worn as a pendant during hard conversations.",
    ],
    poses: ["Fish (supported)", "Cat-Cow", "Shoulderstand (prep)"],
  },
  "Third Eye": {
    color: "#5E35B1",
    mantra: "I trust my inner sight.",
    foodsSentences: [
      "Purple cabbage slaw with sesame.",
      "Blackberries with a square of dark cacao.",
      "Calming tea: lavender + chamomile before bed.",
      "Blue/purple foods for clarity (blueberries, black rice).",
    ],
    stretches: [
      "Child’s pose, 60–90s.",
      "Seated forward fold, soften the brow 5 breaths.",
    ],
    breath: "Alternate nostril breathing (Nadi Shodhana) 3–5 cycles.",
    microPractices: [
      "Close eyes for 30 seconds; notice 5 sounds.",
      "Write the dream or symbol that keeps returning.",
    ],
    energyInsight: "Quiet attention sharpens your next wise move.",
    crystals: ["Amethyst", "Lapis Lazuli", "Iolite"],
    crystalPlacements: [
      "Amethyst placed between brows while resting 2 minutes.",
      "Lapis on the desk for clear thinking.",
    ],
    poses: ["Child's Pose", "Forward Fold", "Eagle (arms)"],
  },
  Crown: {
    color: "#9C27B0",
    mantra: "I am connected.",
    foodsSentences: [
      "Mild mushroom broth with noodles.",
      "Coconut yogurt with chia and a pinch of cinnamon.",
      "Warm herbal infusions; avoid stimulants late.",
      "Light, simple meals to support deep rest.",
    ],
    stretches: [
      "Supine twist, 5 breaths each side.",
      "Seated meditation posture check, lengthen crown.",
    ],
    breath: "Soft open breathing (count-free) 3 minutes.",
    microPractices: [
      "One quiet minute looking at the sky.",
      "Note three moments of grace today.",
    ],
    energyInsight: "Spaciousness arrives when you let the mind widen.",
    crystals: ["Clear Quartz", "Selenite", "Apophyllite"],
    crystalPlacements: [
      "Selenite above the head while seated for 60 seconds.",
      "Clear Quartz by the window to brighten the room’s tone.",
    ],
    poses: ["Savasana", "Lotus (prep)", "Seated Meditation"],
  },
};

const bodyAreaToChakra: Record<BodyArea, Chakra> = {
  head: "Third Eye",
  throat: "Throat",
  chest: "Heart",
  solar_plexus: "Solar Plexus",
  belly: "Sacral",
  hips: "Root",
  legs: "Root",
  feet: "Root",
};

const AREA_LABELS: Record<BodyArea, string> = {
  head: "Head",
  throat: "Throat",
  chest: "Chest",
  solar_plexus: "Solar Plexus",
  belly: "Belly",
  hips: "Hips",
  legs: "Legs",
  feet: "Feet",
};

/* ------------------------- Glow helpers / UI ------------------------- */

function GlowButton({
  children,
  className = "",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <div className="inline-flex rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[1px] shadow-lg shadow-violet-500/30">
      <Button
        {...props}
        className={
          "rounded-full bg-slate-950/95 px-4 py-2 text-xs sm:text-sm font-medium text-slate-50 hover:bg-slate-900 " +
          className
        }
      >
        {children}
      </Button>
    </div>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center text-xs sm:text-sm font-medium transition-transform ${
        active ? "scale-[1.02]" : "hover:scale-[1.01]"
      }`}
    >
      <span className="inline-flex rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[1px] shadow-lg shadow-violet-500/30">
        <span
          className={`inline-flex min-w-[4.5rem] items-center justify-center rounded-full px-3 py-1.5 ${
            active ? "bg-slate-900" : "bg-slate-950/90"
          } text-slate-50`}
        >
          {children}
        </span>
      </span>
    </button>
  );
}

function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="mr-2 inline-block h-3 w-3 rounded-full align-middle"
      style={{ backgroundColor: color }}
    />
  );
}

/** Generic uniq that preserves element type (fixes Chakra typing) */
const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

type PlanDay = { day: number; morning: string[]; night: string[] };

/* ---------------------- Biometrics scoring + demo ---------------------- */

function scoreChakrasFromBiometrics(b: Biometrics) {
  const scores: Record<Chakra, number> = {
    Root: 0,
    Sacral: 0,
    "Solar Plexus": 0,
    Heart: 0,
    Throat: 0,
    "Third Eye": 0,
    Crown: 0,
  };
  const why: string[] = [];
  if (b.hrv < 35) {
    scores.Root += 2;
    why.push("Low HRV → grounding needed");
  }
  if (b.rhr > 70) {
    scores.Root += 1;
    why.push("Elevated resting HR → stabilize");
  }
  if (b.stress > 65) {
    scores.Root += 1;
    scores.Heart += 1;
    why.push("High stress → Root/Heart support");
  }
  if (b.steps < 3000) {
    scores.Root += 1;
    why.push("Low movement → earth & legs");
  }
  if (b.respRate > 18) {
    scores["Solar Plexus"] += 1;
    why.push("Fast breathing → core regulation");
  }
  if (b.deepPct < 12) {
    scores.Heart += 1;
    why.push("Low deep sleep → coherence");
  }
  if (b.respRate > 17 && b.stress > 50) {
    scores.Throat += 1;
    why.push("Breath/voice tension → throat softening");
  }
  if (b.remPct < 18 || b.sleepHours < 6) {
    scores["Third Eye"] += 2;
    why.push("REM or sleep low → inner sight rest");
  }
  if (b.skinTempDelta > 0.6) {
    scores.Crown += 1;
    why.push("Temp up → rest & spaciousness");
  }
  if (b.sleepHours < 5.5) {
    scores.Crown += 1;
  }
  const top = (Object.keys(scores) as Chakra[]).sort(
    (a, bKey) => scores[bKey] - scores[a]
  )[0] as Chakra;
  return { scores, top, why };
}

async function fetchBiometricsDemo(): Promise<Biometrics> {
  return {
    rhr: 72,
    hrv: 29,
    sleepHours: 5.8,
    remPct: 16,
    deepPct: 11,
    respRate: 19,
    skinTempDelta: 0.2,
    stress: 68,
    steps: 2140,
  };
}

/* ------------------------ Wearables provider picker ------------------------ */

const WEARABLE_PROVIDERS = [
  // Ecosystems
  "Apple Health",
  "Google Fit",
  "Samsung Health",
  // Rings / bands
  "Oura",
  "WHOOP",
  "Fitbit",
  "Garmin",
  "Polar",
  "Coros",
  "Wahoo",
  "Biostrap",
  "Withings",
  "Amazfit / Zepp",
  "Xiaomi Mi",
  "Huawei Health",
  // Bed & recovery
  "Eight Sleep",
  "Emfit QS",
  // Other biosensors
  "Muse",
  "AURA Strap",
  "Ultrahuman Ring",
  "Circular Ring",
  "RingConn",
  "Movano Evie",
  "Amazfit Balance",
];

function WearablePicker({
  open,
  onClose,
  onConnect,
}: {
  open: boolean;
  onClose: () => void;
  onConnect: (chosen: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const [chosen, setChosen] = useState<string[]>([]);

  const filtered = WEARABLE_PROVIDERS.filter((p) =>
    p.toLowerCase().includes(q.toLowerCase())
  );

  const toggle = (p: string) =>
    setChosen((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">
            Connect Wearable(s)
          </h2>
          <GlowButton
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="px-3 py-1 text-xs"
          >
            Close
          </GlowButton>
        </div>

        <div className="mb-3 flex items-center gap-2 rounded-2xl bg-slate-900/80 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search providers…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-0"
          />
        </div>

        <div className="max-h-[50vh] overflow-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-2">
          {filtered.length === 0 ? (
            <p className="p-3 text-sm text-slate-400">No matches.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {filtered.map((p) => {
                const active = chosen.includes(p);
                return (
                  <li key={p}>
                    <Pill active={active} onClick={() => toggle(p)}>
                      <span className="flex items-center gap-1">
                        <span>{p}</span>
                        {active && <Check className="h-3 w-3" />}
                      </span>
                    </Pill>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <GlowButton
            size="sm"
            variant="outline"
            onClick={onClose}
            className="px-4 py-1.5"
          >
            Cancel
          </GlowButton>
          <GlowButton
            size="sm"
            onClick={() => onConnect(chosen)}
            disabled={chosen.length === 0}
            className="px-4 py-1.5 disabled:opacity-50"
          >
            Connect {chosen.length > 0 ? `(${chosen.length})` : ""}
          </GlowButton>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function InsightsPage() {
  // Manual selection
  const [selectedAreas, setSelectedAreas] = useState<BodyArea[]>([]);

  // Biometrics/auto
  const [connected, setConnected] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [bio, setBio] = useState<Biometrics | null>(null);
  const [autoChakra, setAutoChakra] = useState<Chakra | null>(null);
  const [useAuto, setUseAuto] = useState(true);
  const [loadingBio, setLoadingBio] = useState(false);

  // Picker modal
  const [pickerOpen, setPickerOpen] = useState(false);

  // Plan
  const [plan, setPlan] = useState<PlanDay[] | null>(null);
  const planRef = useRef<HTMLDivElement | null>(null);

  const selectedChakrasFromAreas = useMemo(() => {
    const list = Array.from(
      new Set(selectedAreas.map((a) => bodyAreaToChakra[a]))
    );
    return list as Chakra[];
  }, [selectedAreas]);

  const activeChakras = useMemo<Chakra[]>(() => {
    return useAuto && autoChakra
      ? uniq<Chakra>([autoChakra, ...selectedChakrasFromAreas])
      : selectedChakrasFromAreas;
  }, [useAuto, autoChakra, selectedChakrasFromAreas]);

  const foodsSentences = useMemo(
    () => uniq<string>(activeChakras.flatMap((c) => RECS[c].foodsSentences)),
    [activeChakras]
  );
  const stretches = useMemo(
    () => uniq<string>(activeChakras.flatMap((c) => RECS[c].stretches)),
    [activeChakras]
  );
  const microPractices = useMemo(
    () => uniq<string>(activeChakras.flatMap((c) => RECS[c].microPractices)),
    [activeChakras]
  );
  const crystalPlacements = useMemo(
    () => uniq<string>(activeChakras.flatMap((c) => RECS[c].crystalPlacements)),
    [activeChakras]
  );
  const crystals = useMemo(
    () => uniq<string>(activeChakras.flatMap((c) => RECS[c].crystals)),
    [activeChakras]
  );

  const primaryKey: Chakra =
    (useAuto && autoChakra) || activeChakras[0] || "Heart";

  const morningBase = useMemo(() => {
    const r = RECS[primaryKey];
    return [
      r.stretches[0] ?? "Gentle spinal twists in bed.",
      r.breath,
      `Mantra: "${r.mantra}"`,
      r.microPractices[0] ?? "One tiny kindness before phone.",
    ];
  }, [primaryKey]);

  const nightBase = useMemo(() => {
    const r = RECS[primaryKey];
    return [
      "Cat-cow x 6 + knees-to-chest.",
      r.stretches[1] ?? "Supported forward fold (2 min).",
      r.breath,
      "1-sentence journal: ‘One thing I release…’.",
    ];
  }, [primaryKey]);

  const generateTwoWeekPlan = () => {
    const days: PlanDay[] = Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      morning: [
        morningBase[i % morningBase.length],
        morningBase[(i + 1) % morningBase.length],
      ],
      night: [
        nightBase[i % nightBase.length],
        nightBase[(i + 1) % nightBase.length],
      ],
    }));
    setPlan(days);
    setTimeout(
      () =>
        planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0
    );
  };

  const toggleArea = (area: BodyArea) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  // Connect via picker
  const handleConnect = async (chosen: string[]) => {
    setPickerOpen(false);
    if (!chosen.length) return;
    setProviders(chosen);
    setLoadingBio(true);
    try {
      const data = await fetchBiometricsDemo();
      setBio(data);
      const { top } = scoreChakrasFromBiometrics(data);
      setAutoChakra(top);
      setConnected(true);
    } finally {
      setLoadingBio(false);
    }
  };

  const refreshBiometrics = async () => {
    setLoadingBio(true);
    try {
      const data = await fetchBiometricsDemo();
      setBio(data);
      const { top } = scoreChakrasFromBiometrics(data);
      setAutoChakra(top);
    } finally {
      setLoadingBio(false);
    }
  };

  const bioScore = useMemo(
    () => (bio ? scoreChakrasFromBiometrics(bio) : null),
    [bio]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-20 pt-8 md:px-8">
        {/* Header to match Play page vibe */}
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Biometrics
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Body Insights
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Translate your heart rate, sleep, and body sensations into
              grounded micro-practices, food, crystals, and breathwork.
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Body · Breath · Energy
            </p>
          </div>
        </header>

        {/* Biometrics (Auto-Insights) */}
        <Card className="relative mb-2 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl">
          <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative z-10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-50">
                <Watch className="h-4 w-4 text-sky-300" /> Biometrics
                (Auto-Insights)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {!connected ? (
                <>
                  <p className="text-sm text-slate-300">
                    Connect a wearable to auto-detect today’s focus chakra and
                    get instant guidance.
                  </p>
                  <GlowButton onClick={() => setPickerOpen(true)}>
                    <Watch className="mr-1 h-4 w-4" />
                    Connect Wearable(s)
                  </GlowButton>
                  <WearablePicker
                    open={pickerOpen}
                    onClose={() => setPickerOpen(false)}
                    onConnect={handleConnect}
                  />
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full bg-slate-900/80 text-xs text-slate-100">
                      Connected: {providers.join(", ")}
                    </Badge>
                    <Badge className="rounded-full bg-slate-900/80 text-xs text-slate-100">
                      <HeartPulse className="mr-1 h-3 w-3" /> RHR {bio?.rhr} bpm
                      · HRV {bio?.hrv} ms
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-slate-900/80 text-xs text-slate-100"
                    >
                      <Moon className="mr-1 h-3 w-3" /> Sleep {bio?.sleepHours}
                      h · REM {bio?.remPct}% · Deep {bio?.deepPct}%
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-slate-900/80 text-xs text-slate-100"
                    >
                      <Gauge className="mr-1 h-3 w-3" /> Resp {bio?.respRate}/
                      min · Temp {bio?.skinTempDelta.toFixed(1)}°C
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-slate-900/80 text-xs text-slate-100"
                    >
                      <Brain className="mr-1 h-3 w-3" /> Stress {bio?.stress}
                      /100 · Steps {bio?.steps}
                    </Badge>
                    <div className="ml-auto">
                      <GlowButton
                        size="sm"
                        variant="ghost"
                        onClick={refreshBiometrics}
                        className="px-3 py-1 text-xs"
                      >
                        <RefreshCw className="mr-1 h-4 w-4" />
                        {loadingBio ? "Refreshing…" : "Refresh"}
                      </GlowButton>
                    </div>
                  </div>

                  {bioScore && (
                    <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="text-xs font-medium text-slate-300">
                          Auto Focus:
                        </div>
                        <span className="text-xs font-semibold text-slate-100">
                          <ColorDot color={RECS[bioScore.top].color} />{" "}
                          {bioScore.top}
                        </span>
                        <div className="ml-auto">
                          <GlowButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setUseAuto((v) => !v)}
                            className="px-3 py-1 text-[11px]"
                          >
                            {useAuto ? "Using Auto Insights" : "Use Auto"}
                          </GlowButton>
                        </div>
                      </div>
                      <ul className="mt-1 list-disc space-y-1 pl-6 text-xs text-slate-300">
                        {bioScore.why.map((w) => (
                          <li key={w}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </div>
        </Card>

        {/* Manual Body Area Selector */}
        <Card className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl">
          <div className="pointer-events-none absolute -left-14 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative z-10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-50">
                <Activity className="h-4 w-4 text-emerald-300" /> Select where
                you feel it in your body
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(AREA_LABELS) as BodyArea[]).map((area) => (
                  <Pill
                    key={area}
                    active={selectedAreas.includes(area)}
                    onClick={() => toggleArea(area)}
                  >
                    {AREA_LABELS[area]}
                  </Pill>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Tip: you can select more than one area.
              </p>
            </CardContent>
          </div>
        </Card>

        {/* Recommendations */}
        {activeChakras.length === 0 ? (
          <Card className="mt-2 rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl">
            <CardContent className="py-10 text-center text-slate-300">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-slate-900">
                <Sparkles className="h-5 w-5 text-violet-200" />
              </div>
              <p className="text-sm">
                Connect your wearable or select an area above to see stretches,
                breathwork, micro-practices, crystals, and a personalized plan.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-2 space-y-6">
            {activeChakras.map((c) => (
              <Card
                key={c}
                className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl"
              >
                <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

                <div className="relative z-10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-50">
                      <ColorDot color={RECS[c].color} /> {c}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0 text-sm text-slate-200">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <Wind className="h-4 w-4 text-sky-200" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Breath</div>
                        <div className="text-slate-200">{RECS[c].breath}</div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center gap-2 font-medium">
                        <Activity className="h-4 w-4 text-emerald-200" />{" "}
                        Stretches
                      </div>
                      <ul className="list-disc space-y-1 pl-6 text-slate-200">
                        {RECS[c].stretches.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center gap-2 font-medium">
                        <Sparkles className="h-4 w-4 text-fuchsia-200" />{" "}
                        Micro-practices
                      </div>
                      <ul className="list-disc space-y-1 pl-6 text-slate-200">
                        {RECS[c].microPractices.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-slate-200">
                      <span className="font-medium">Energy insight:</span>{" "}
                      {RECS[c].energyInsight}
                    </div>

                    <div>
                      <div className="mb-1 flex items-center gap-2 font-medium">
                        <Gem className="h-4 w-4 text-amber-200" /> Crystals &
                        Placements
                      </div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {crystals.map((name) => (
                          <Badge
                            key={`${c}-${name}`}
                            variant="secondary"
                            className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-100"
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                      <ul className="list-disc space-y-1 pl-6 text-slate-200">
                        {crystalPlacements.map((p) => (
                          <li key={`${c}-${p}`}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}

            {/* Food as Medicine */}
            <Card className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl">
              <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-8 bottom-0 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl" />

              <div className="relative z-10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-50">
                    <Soup className="h-4 w-4 text-amber-200" /> Food as Medicine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <p className="text-sm text-slate-300">
                    Suggestions tuned to your current focus. Try simple meals,
                    drinks, snacks, and remedies that support healing.
                  </p>
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3">
                    <div className="mb-1 text-sm font-medium text-amber-100">
                      Suggested for you
                    </div>
                    <ul className="list-disc space-y-1 pl-6 text-xs text-amber-50">
                      {foodsSentences.length > 0 ? (
                        foodsSentences.map((s) => <li key={s}>{s}</li>)
                      ) : (
                        <>
                          <li>
                            Start with warm, easy-to-digest foods and calming
                            teas.
                          </li>
                          <li>
                            Favor mineral-rich broths and gentle spices (ginger,
                            cinnamon).
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Personalized Plan */}
            <Card className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl">
              <div className="pointer-events-none absolute -left-12 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />

              <div className="relative z-10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-50">
                    <Sun className="h-4 w-4 text-amber-200" /> Personalized Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="mb-3 text-sm text-slate-300">
                    Build a 14-day micro-practice plan from your connected
                    biometrics and any areas you selected.
                  </p>
                  <GlowButton
                    onClick={generateTwoWeekPlan}
                    disabled={activeChakras.length === 0}
                    className="disabled:opacity-40"
                  >
                    Generate 2-week plan
                  </GlowButton>
                </CardContent>
              </div>
            </Card>

            {/* 2-week plan render */}
            {plan && (
              <Card
                ref={planRef}
                className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl"
              >
                <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-8 bottom-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative z-10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-50">
                      <Moon className="h-4 w-4 text-sky-200" /> Your 2-week
                      micro-plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {plan.map((d) => (
                        <div
                          key={d.day}
                          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-200"
                        >
                          <div className="mb-1 text-sm font-medium">
                            Day {d.day}
                          </div>
                          <div>
                            <div className="mb-1 flex items-center gap-2 font-medium text-slate-100">
                              <Sun className="h-4 w-4 text-amber-200" />{" "}
                              Morning
                            </div>
                            <ul className="list-disc space-y-1 pl-6">
                              {d.morning.map((it, i) => (
                                <li key={`m-${d.day}-${i}`}>{it}</li>
                              ))}
                            </ul>
                            <div className="mt-2 mb-1 flex items-center gap-2 font-medium text-slate-100">
                              <Moon className="h-4 w-4 text-sky-200" /> Night
                            </div>
                            <ul className="list-disc space-y-1 pl-6">
                              {d.night.map((it, i) => (
                                <li key={`n-${d.day}-${i}`}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

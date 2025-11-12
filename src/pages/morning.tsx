// src/pages/morning.tsx
"use client";
import { ConnectWearable } from "@/components/ConnectWearable";

import React, { useMemo, useState, useEffect } from "react";
import {
  Activity,
  BedDouble,
  HeartPulse,
  Moon,
  Sunrise,
  StretchHorizontal,
  Wind,
  Flower2, // replacing Lotus
  Soup,
  Dumbbell,
  Sparkles,
  Timer,
  Coffee,
  Info,
  Watch,
  CheckCircle2,
  Gem,
} from "lucide-react";

/** ──────────────────────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────────────────────── */
type SleepSummary = {
  date: string; // ISO date for last night
  durationMin: number; // total sleep minutes
  efficiencyPct: number; // 0–100
  hrvMs?: number; // average HRV (ms)
  hrvTrend?: "up" | "down" | "flat";
  restlessnessPct?: number; // movement/restlessness 0–100
  wakeEvents?: number; // # of wake-ups
  bedtime?: string; // 23:45
  risetime?: string; // 07:03
};

type RecItem = {
  id: string;
  title: string;
  subtitle?: string;
  minutes?: number;
  blurb: string;
  tags?: string[];
  icon?: React.ReactNode;
  link?: string; // optional deep link / guidance page
};

type MorningPlan = {
  stretches: RecItem[];
  breathwork: RecItem[];
  meditations: RecItem[];
  yoga: RecItem[];
  breakfast: RecItem[];
  crystals: RecItem[];
};

type MorningVibe = {
  label: string;
  tagline: string;
  chipClass: string;
};

/** ──────────────────────────────────────────────────────────────
 * Constants / keys
 * ────────────────────────────────────────────────────────────── */
const MORNING_SEEN_KEY = "gw_morning_seen_date";
const MORNING_REMINDER_KEY = "gw_morning_reminder_enabled";

/** ──────────────────────────────────────────────────────────────
 * Mock Sleep Fetch (replace with wearable integration)
 * ────────────────────────────────────────────────────────────── */
function useMockSleep(): SleepSummary {
  const [preset] = useState<"great" | "okay" | "rough">("okay");

  if (preset === "great") {
    return {
      date: new Date().toISOString().slice(0, 10),
      durationMin: 455,
      efficiencyPct: 93,
      hrvMs: 62,
      hrvTrend: "up",
      restlessnessPct: 8,
      wakeEvents: 1,
      bedtime: "22:45",
      risetime: "06:20",
    };
  }
  if (preset === "rough") {
    return {
      date: new Date().toISOString().slice(0, 10),
      durationMin: 320,
      efficiencyPct: 77,
      hrvMs: 34,
      hrvTrend: "down",
      restlessnessPct: 28,
      wakeEvents: 5,
      bedtime: "01:10",
      risetime: "06:30",
    };
  }
  return {
    date: new Date().toISOString().slice(0, 10),
    durationMin: 390,
    efficiencyPct: 86,
    hrvMs: 45,
    hrvTrend: "flat",
    restlessnessPct: 15,
    wakeEvents: 2,
    bedtime: "23:40",
    risetime: "06:50",
  };
}

/** ──────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────── */
function minutesToHMM(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function greetingNow() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function id(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Derive a “today’s vibe” from sleep summary */
function getMorningVibe(s: SleepSummary): MorningVibe {
  const lowDuration = s.durationMin < 390; // <6.5h
  const lowEfficiency = s.efficiencyPct < 85;
  const highRestless = (s.restlessnessPct ?? 0) > 20;
  const manyWakes = (s.wakeEvents ?? 0) >= 3;
  const hrvDown = s.hrvTrend === "down";
  const hrvLow = (s.hrvMs ?? 0) < 40;

  const flags = [
    lowDuration,
    lowEfficiency,
    highRestless,
    manyWakes,
    hrvDown,
    hrvLow,
  ].filter(Boolean).length;

  if (flags <= 1) {
    return {
      label: "Well-Rested",
      tagline: "Your system feels resourced — you can gently lean into the day.",
      chipClass:
        "border-emerald-400/70 bg-emerald-500/15 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    };
  }
  if (flags <= 3) {
    return {
      label: "Steady",
      tagline: "You’re okay — a few mindful choices will keep your energy smooth.",
      chipClass:
        "border-sky-400/70 bg-sky-500/15 text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.35)]",
    };
  }
  if (flags <= 4) {
    return {
      label: "Tired",
      tagline: "Today is a soft day. Gentle movement and nourishment are medicine.",
      chipClass:
        "border-amber-400/70 bg-amber-500/15 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.35)]",
    };
  }
  return {
    label: "Deeply Depleted",
    tagline:
      "Your only job is care. Move slowly, say no where you can, and refill.",
    chipClass:
      "border-rose-400/70 bg-rose-500/15 text-rose-100 shadow-[0_0_20px_rgba(244,114,182,0.35)]",
  };
}

/** Map sleep → needs buckets, then craft plan */
function buildMorningPlan(s: SleepSummary): MorningPlan {
  const lowDuration = s.durationMin < 390; // <6.5h
  const lowEfficiency = s.efficiencyPct < 85;
  const highRestless = (s.restlessnessPct ?? 0) > 20;
  const manyWakes = (s.wakeEvents ?? 0) >= 3;
  const hrvDown = s.hrvTrend === "down";
  const hrvLow = (s.hrvMs ?? 0) < 40;

  const needsCalm = lowEfficiency || highRestless || manyWakes;
  const needsEnergy = lowDuration || hrvDown || hrvLow;
  const needsGentle = lowDuration || manyWakes || highRestless;

  // — Stretches —
  const stretches: RecItem[] = [
    {
      id: id("Neck + Shoulder Unwind"),
      title: "Neck + Shoulder Unwind",
      minutes: needsGentle ? 3 : 5,
      blurb: needsGentle
        ? "Gentle side bends and shoulder rolls to release sleep stiffness without spiking cortisol."
        : "Free up the neck/upper back so breathing feels spacious.",
      tags: ["gentle", "release"],
      icon: <StretchHorizontal className="w-4 h-4" />,
    },
    {
      id: id("Low Back Reset"),
      title: "Low Back Reset",
      minutes: 3,
      blurb:
        "Supine knees-to-chest + easy twists; calm the lumbar and wring out residual tension.",
      tags: ["twist", "restorative"],
      icon: <Dumbbell className="w-4 h-4" />,
    },
  ];

  // — Breathwork —
  const breathwork: RecItem[] = needsCalm
    ? [
        {
          id: id("Extended Exhale (4-6)"),
          title: "Extended Exhale (4–6)",
          minutes: 4,
          blurb:
            "Inhale 4, exhale 6. Downshifts the nervous system and steadies a restless night.",
          tags: ["parasympathetic", "downshift"],
          icon: <Wind className="w-4 h-4" />,
        },
        {
          id: id("Box Breath"),
          title: "Box Breath",
          minutes: 3,
          blurb:
            "Inhale 4, hold 4, exhale 4, hold 4. Evens the mind when sleep was choppy.",
          tags: ["focus", "balance"],
          icon: <Timer className="w-4 h-4" />,
        },
      ]
    : needsEnergy
    ? [
        {
          id: id("Balancing Nadi Shodhana"),
          title: "Nadi Shodhana",
          minutes: 4,
          blurb:
            "Alternate-nostril breathing to balance hemispheres and lift energy without jitters.",
          tags: ["balance", "clarity"],
          icon: <Wind className="w-4 h-4" />,
        },
        {
          id: id("3 Rounds of Breath of Fire"),
          title: "Breath of Fire (gentle)",
          minutes: 2,
          blurb:
            "Short, gentle kapalabhati rounds to spark alertness—skip if you feel anxious.",
          tags: ["energize"],
          icon: <Activity className="w-4 h-4" />,
        },
      ]
    : [
        {
          id: id("Coherent Breathing (5:5)"),
          title: "Coherent Breathing (5:5)",
          minutes: 5,
          blurb:
            "Inhale 5, exhale 5. Smooths HRV and sets an easy baseline for the day.",
          tags: ["steady", "HRV"],
          icon: <HeartPulse className="w-4 h-4" />,
        },
      ];

  // — Meditations —
  const meditations: RecItem[] = [
    {
      id: id("2-Minute Arrival"),
      title: "2-Minute Arrival",
      minutes: 2,
      blurb:
        "Eyes soft, feel feet → breath → chest. Name one intention for today.",
      tags: ["mindful", "short"],
      icon: <Sparkles className="w-4 h-4" />,
    },
    needsCalm
      ? {
          id: id("Body Scan (short)"),
          title: "Body Scan (short)",
          minutes: 5,
          blurb:
            "Soften jaw, throat, chest, belly. Let the body feel safe to wake.",
          tags: ["calm", "ground"],
          icon: <Flower2 className="w-4 h-4" />,
        }
      : {
          id: id("Focused Clarity"),
          title: "Focused Clarity",
          minutes: 4,
          blurb:
            "Single-point attention on breath—sharpen focus after an OK night.",
          tags: ["focus"],
          icon: <Flower2 className="w-4 h-4" />,
        },
  ].filter(Boolean) as RecItem[];

  // — Yoga —
  const yoga: RecItem[] = needsGentle
    ? [
        {
          id: id("Cat–Cow + Puppy"),
          title: "Cat–Cow → Puppy Pose",
          minutes: 4,
          blurb:
            "Warm the spine with Cat–Cow. Melt heart in Puppy to open breath without strain.",
          tags: ["gentle", "spine"],
          icon: <StretchHorizontal className="w-4 h-4" />,
        },
        {
          id: id("Supported Forward Fold"),
          title: "Supported Uttanasana",
          minutes: 2,
          blurb:
            "Hinge from hips, support hands on blocks/chair; release hamstrings + back line.",
          tags: ["restorative"],
          icon: <StretchHorizontal className="w-4 h-4" />,
        },
      ]
    : [
        {
          id: id("Sun Salutation A x3"),
          title: "Sun Salutation A ×3",
          minutes: 6,
          blurb:
            "Three steady rounds to circulate blood, brighten mood, and cue an alert body.",
          tags: ["energize", "flow"],
          icon: <Sunrise className="w-4 h-4" />,
        },
        {
          id: id("Chair Pose + Bridge"),
          title: "Utkatasana + Setu Bandha",
          minutes: 4,
          blurb:
            "Light leg/hip activation with a heart-opening bridge to wake posterior chain.",
          tags: ["strength", "open"],
          icon: <Dumbbell className="w-4 h-4" />,
        },
      ];

  // — Breakfast —
  const breakfast: RecItem[] = needsEnergy
    ? [
        {
          id: id("Protein Oats"),
          title: "Protein Oats",
          blurb:
            "Warm oats with chia + nut butter; add berries. Steady glucose, steady focus.",
          tags: ["protein", "fiber", "berries"],
          icon: <Coffee className="w-4 h-4" />,
        },
        {
          id: id("Hydration + Minerals"),
          title: "Hydration + Minerals",
          blurb:
            "Water with pinch of sea salt + lemon. Rehydrate after short or restless sleep.",
          tags: ["electrolytes"],
          icon: <Soup className="w-4 h-4" />,
        },
      ]
    : needsCalm
    ? [
        {
          id: id("Warm Cinnamon Quinoa"),
          title: "Warm Cinnamon Quinoa",
          blurb:
            "Soothing, easy-to-digest bowl with almond milk; calm stomach after choppy sleep.",
          tags: ["soothing", "GF"],
          icon: <Soup className="w-4 h-4" />,
        },
        {
          id: id("Green Tea"),
          title: "Green Tea",
          blurb:
            "Gentle lift with L-theanine for calm focus vs. a hard caffeine spike.",
          tags: ["calm focus"],
          icon: <Coffee className="w-4 h-4" />,
        },
      ]
    : [
        {
          id: id("Eggs + Greens Wrap"),
          title: "Eggs + Greens Wrap",
          blurb:
            "Simple protein + greens + avocado in a wrap; satiating and clean fuel.",
          tags: ["protein", "healthy fats"],
          icon: <Soup className="w-4 h-4" />,
        },
        {
          id: id("Fruit + Yogurt"),
          title: "Fruit + Yogurt",
          blurb:
            "Probiotic support and light carbs for an ‘okay’ night—keeps energy stable.",
          tags: ["probiotic", "light"],
          icon: <Soup className="w-4 h-4" />,
        },
      ];

  // — Crystals to Carry —
  const crystals: RecItem[] = needsEnergy
    ? [
        {
          id: id("Citrine"),
          title: "Citrine",
          blurb:
            "Bright, solar energy to boost vitality and motivation after low sleep.",
          tags: ["energy", "solar"],
          icon: <Gem className="w-4 h-4" />,
        },
        {
          id: id("Carnelian"),
          title: "Carnelian",
          blurb:
            "Warms the sacral center—gentle lift for creativity, mood, and momentum.",
          tags: ["vitality", "sacral"],
          icon: <Gem className="w-4 h-4" />,
        },
      ]
    : needsCalm
    ? [
        {
          id: id("Amethyst"),
          title: "Amethyst",
          blurb:
            "Soothes mental chatter and eases nervous tension after a restless night.",
          tags: ["calm", "third-eye"],
          icon: <Gem className="w-4 h-4" />,
        },
        {
          id: id("Lepidolite"),
          title: "Lepidolite",
          blurb:
            "Supports emotional balance; helpful when sleep was fragmented or anxious.",
          tags: ["balance", "soften"],
          icon: <Gem className="w-4 h-4" />,
        },
      ]
    : [
        {
          id: id("Clear Quartz"),
          title: "Clear Quartz",
          blurb:
            "Amplifies intention and brings clarity—great companion for a balanced day.",
          tags: ["clarity", "amplify"],
          icon: <Gem className="w-4 h-4" />,
        },
        {
          id: id("Green Aventurine"),
          title: "Green Aventurine",
          blurb:
            "Encourages optimism and soft heart-opening—smooth support after an okay night.",
          tags: ["heart", "optimism"],
          icon: <Gem className="w-4 h-4" />,
        },
      ];

  return { stretches, breathwork, meditations, yoga, breakfast, crystals };
}

/** ──────────────────────────────────────────────────────────────
 * UI bits
 * ────────────────────────────────────────────────────────────── */
function Chip({
  icon,
  children,
  title,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-200 backdrop-blur"
    >
      {icon}
      {children}
    </span>
  );
}

function MetricRow({ sleep }: { sleep: SleepSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip icon={<BedDouble className="w-3.5 h-3.5" />} title="Total sleep">
        {minutesToHMM(sleep.durationMin)}
      </Chip>
      <Chip icon={<Moon className="w-3.5 h-3.5" />} title="Efficiency">
        {sleep.efficiencyPct}% eff.
      </Chip>
      <Chip icon={<HeartPulse className="w-3.5 h-3.5" />} title="HRV">
        {sleep.hrvMs ? `${sleep.hrvMs} ms` : "HRV —"}
      </Chip>
      <Chip icon={<Activity className="w-3.5 h-3.5" />} title="Restlessness">
        {sleep.restlessnessPct ?? "—"}% restlessness
      </Chip>
      <Chip icon={<Timer className="w-3.5 h-3.5" />} title="Wake events">
        {sleep.wakeEvents ?? 0} wakes
      </Chip>
      <Chip icon={<Watch className="w-3.5 h-3.5" />} title="Bed / Rise">
        {sleep.bedtime ?? "—"} → {sleep.risetime ?? "—"}
      </Chip>
    </div>
  );
}

function Section({ title, items }: { title: string; items: RecItem[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));

  return (
    <section className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl transition hover:border-violet-400/60 hover:bg-slate-900/90">
      <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-sky-200 bg-clip-text text-sm font-semibold uppercase tracking-[0.16em] text-transparent">
            {title}
          </h3>
        </div>
        <ul className="space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm transition hover:border-violet-400/70 hover:bg-slate-900/95"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400/30 via-violet-400/30 to-sky-400/30 p-[1px] shadow-lg shadow-violet-500/30">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950">
                    {it.icon}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-50">
                    {it.title}
                  </div>
                  {it.subtitle && (
                    <div className="text-xs text-slate-400">{it.subtitle}</div>
                  )}
                  <div className="mt-1 text-xs text-slate-200">
                    {it.blurb}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {it.minutes ? (
                      <Chip title="Estimated minutes">~{it.minutes} min</Chip>
                    ) : null}
                    {it.tags?.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>
              </div>
              <button
                aria-label={done[it.id] ? "Mark as not done" : "Mark as done"}
                onClick={() => toggle(it.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-400/80 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                  done[it.id]
                    ? "bg-emerald-400/95 text-slate-950 shadow-lg shadow-emerald-500/40"
                    : "bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 text-slate-950 shadow-md shadow-fuchsia-500/40 hover:brightness-110"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {done[it.id] ? "Done" : "Do"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** ──────────────────────────────────────────────────────────────
 * Page
 * ────────────────────────────────────────────────────────────── */
export default function MorningPage() {
  const sleep = useMockSleep();
  const plan = useMemo(() => buildMorningPlan(sleep), [sleep]);
  const vibe = useMemo(() => getMorningVibe(sleep), [sleep]);

  const [reminderOn, setReminderOn] = useState(false);

  // Mark this morning as "seen" for today
  useEffect(() => {
    if (typeof window === "undefined") return;
    const todayStr = new Date().toISOString().slice(0, 10);
    window.localStorage.setItem(MORNING_SEEN_KEY, todayStr);
  }, []);

  // Load reminder preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(MORNING_REMINDER_KEY);
    setReminderOn(saved === "true");
  }, []);

  const toggleReminder = () => {
    setReminderOn((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          MORNING_REMINDER_KEY,
          next ? "true" : "false"
        );
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-20 pt-8 md:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Morning Ritual
            </p>
            <h1 className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-semibold text-slate-50 md:text-3xl">
              {greetingNow()}
              <span className="text-sm font-normal text-slate-400 md:text-base">
                — here’s what your body is asking for
              </span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Based on how you slept, we’ve woven together stretches, breath,
              meditation, movement, nourishment, and crystals to meet you where
              you actually are today.
            </p>
          </div>

          <div className="space-y-3 text-right">
            {/* Today’s vibe chip */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${vibe.chipClass}`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Today’s Vibe · {vibe.label}</span>
            </div>
            <p className="text-xs text-slate-400">{vibe.tagline}</p>

            {/* Reminder toggle */}
            <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
              <button
                type="button"
                onClick={toggleReminder}
                className={`relative h-5 w-9 rounded-full border transition ${
                  reminderOn
                    ? "border-emerald-300 bg-emerald-400/70"
                    : "border-slate-600 bg-slate-800"
                }`}
                aria-pressed={reminderOn}
                aria-label="Toggle morning reminder preference"
              >
                <span
                  className={`absolute top-[2px] h-4 w-4 rounded-full bg-slate-950 shadow transition-transform ${
                    reminderOn ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span>Remind me most mornings</span>
            </div>
          </div>
        </header>

        {/* Sleep metrics + connect wearable */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl shadow-slate-950/70">
          <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-200 backdrop-blur">
                <BedDouble className="h-3.5 w-3.5" />
                <span className="uppercase tracking-[0.18em]">
                  Sleep summary — {sleep.date}
                </span>
              </div>
              <MetricRow sleep={sleep} />
            </div>

            {/* Connect wearable dialog button */}
            <div className="flex items-start">
              <ConnectWearable />
            </div>
          </div>

          <p className="relative z-10 mt-3 flex items-center gap-1 text-[11px] text-slate-400">
            <Info className="h-3.5 w-3.5" />
            This is mock data for now. Once a wearable is connected, your actual
            sleep metrics will shape this morning ritual.
          </p>
        </section>

        {/* Recommendations grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Section title="Body Stretches" items={plan.stretches} />
          <Section title="Breathwork" items={plan.breathwork} />
          <Section title="Meditations" items={plan.meditations} />
          <Section title="Yoga Poses" items={plan.yoga} />
          <Section title="Breakfast & Hydration" items={plan.breakfast} />
          <Section title="Crystals to Carry" items={plan.crystals} />
        </div>
      </div>
    </main>
  );
}

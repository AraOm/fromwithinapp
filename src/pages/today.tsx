// src/pages/today.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ConnectWearable from "@/components/ConnectWearable";
import ZenPlaylists from "@/components/ZenPlaylists";

import {
  Activity,
  BedDouble,
  Coffee,
  Droplet,
  Flower2,
  Gem,
  HeartPulse,
  Info,
  Moon,
  PenSquare,
  Sparkles,
  Sun,
  Sunrise,
  Wind,
  ArrowRight,
  Soup,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────────────────────── */

type SleepSummary = {
  date: string;
  durationMin: number;
  efficiencyPct: number;
  hrvMs?: number;
  hrvTrend?: "up" | "down" | "flat";
  restlessnessPct?: number;
  wakeEvents?: number;
};

type MorningVibe = {
  label: string;
  tagline: string;
  chipClass: string;
};

type RecItem = {
  id: string;
  title: string;
  blurb: string;
  minutes?: number;
  tags?: string[];
  icon?: React.ReactNode;
};

type TodayPlan = {
  movement: RecItem[];
  breath: RecItem[];
  nourish: RecItem[];
  plantAllies: RecItem[];
};

/* ──────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────── */

function id(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function greetingNow() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function minutesToHMM(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

/** TEMP: replace with real wearable data when ready */
function useMockSleep(): SleepSummary {
  return {
    date: new Date().toISOString().slice(0, 10),
    durationMin: 390,
    efficiencyPct: 86,
    hrvMs: 45,
    hrvTrend: "flat",
    restlessnessPct: 15,
    wakeEvents: 2,
  };
}

/** Derive vibe from sleep summary */
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
        "border-emerald-400/70 bg-emerald-500/15 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.45)]",
    };
  }
  if (flags <= 3) {
    return {
      label: "Steady",
      tagline: "You’re okay — a few mindful choices keep your energy smooth.",
      chipClass:
        "border-sky-400/70 bg-sky-500/15 text-sky-100 shadow-[0_0_25px_rgba(56,189,248,0.45)]",
    };
  }
  if (flags <= 4) {
    return {
      label: "Tired",
      tagline: "Today is a soft day. Gentle movement and nourishment are medicine.",
      chipClass:
        "border-amber-400/70 bg-amber-500/15 text-amber-100 shadow-[0_0_25px_rgba(251,191,36,0.45)]",
    };
  }
  return {
    label: "Deeply Depleted",
    tagline:
      "Your only job is care. Move slowly, say no where you can, and refill.",
    chipClass:
      "border-rose-400/70 bg-rose-500/15 text-rose-100 shadow-[0_0_25px_rgba(244,114,182,0.5)]",
  };
}

/** Build a super-curated, “just tell me what to do” plan */
function buildTodayPlan(s: SleepSummary): TodayPlan {
  const lowDuration = s.durationMin < 390;
  const lowEfficiency = s.efficiencyPct < 85;
  const highRestless = (s.restlessnessPct ?? 0) > 20;
  const manyWakes = (s.wakeEvents ?? 0) >= 3;
  const hrvDown = s.hrvTrend === "down";
  const hrvLow = (s.hrvMs ?? 0) < 40;

  const needsCalm = lowEfficiency || highRestless || manyWakes;
  const needsEnergy = lowDuration || hrvDown || hrvLow;
  const needsGentle = lowDuration || manyWakes || highRestless;

  const movement: RecItem[] = needsGentle
    ? [
        {
          id: id("cat-cow + neck rolls"),
          title: "Cat–Cow + Neck Rolls",
          minutes: 4,
          blurb:
            "On hands and knees, alternate gently arching and rounding the spine for 6–8 rounds. Finish with slow neck circles, letting the jaw soften.",
          tags: ["gentle", "spine", "nervous system"],
          icon: <Activity className="w-4 h-4" />,
        },
      ]
    : [
        {
          id: id("sun salutes x3"),
          title: "3 Soft Sun Salutations",
          minutes: 6,
          blurb:
            "Move slowly through 3 rounds of Sun Salutation A, matching each movement to your breath. Think fluid, not forceful.",
          tags: ["energize", "flow"],
          icon: <Sunrise className="w-4 h-4" />,
        },
      ];

  const breath: RecItem[] = needsCalm
    ? [
        {
          id: id("4-6 exhale"),
          title: "Extended Exhale (4–6)",
          minutes: 3,
          blurb:
            "Inhale for 4, exhale for 6 through the nose. Keep the breath soft and shoulders relaxed. Repeat for a few minutes to downshift.",
          tags: ["calm", "HRV", "parasympathetic"],
          icon: <Wind className="w-4 h-4" />,
        },
      ]
    : needsEnergy
    ? [
        {
          id: id("nadi shodhana"),
          title: "Nadi Shodhana (Alternate Nostril)",
          minutes: 4,
          blurb:
            "Close right nostril and inhale left, then close left and exhale right. Inhale right, exhale left. Continue for several rounds to balance both hemispheres.",
          tags: ["clarity", "balance"],
          icon: <Wind className="w-4 h-4" />,
        },
      ]
    : [
        {
          id: id("coherent breathing"),
          title: "Coherent Breathing (5 in / 5 out)",
          minutes: 5,
          blurb:
            "Inhale for 5 counts, exhale for 5 through the nose. Imagine your heart and breath moving in one smooth wave.",
          tags: ["steady", "coherence"],
          icon: <HeartPulse className="w-4 h-4" />,
        },
      ];

  const nourish: RecItem[] = needsEnergy
    ? [
        {
          id: id("protein oats"),
          title: "Protein + Fiber Breakfast",
          blurb:
            "Think warm oats or quinoa with chia, nuts, and berries — or tofu scramble with greens. Slow, steady fuel instead of a spike & crash.",
          tags: ["protein", "fiber", "steady energy"],
          icon: <Coffee className="w-4 h-4" />,
        },
      ]
    : needsCalm
    ? [
        {
          id: id("warm soothing bowl"),
          title: "Warm Soothing Bowl",
          blurb:
            "Gentle options like soup, stewed apples, or congee. Warm, soft food tells your nervous system it’s safe to soften.",
          tags: ["soothing", "grounding"],
          icon: <Coffee className="w-4 h-4" />,
        },
      ]
    : [
        {
          id: id("simple balanced plate"),
          title: "Simple Balanced Plate",
          blurb:
            "Pair greens, a whole grain, and a protein (beans, tofu, lentils). Avoid overcomplication — clarity loves simplicity.",
          tags: ["balance", "focus"],
          icon: <Coffee className="w-4 h-4" />,
        },
      ];

  const plantAllies: RecItem[] = needsEnergy
    ? [
        {
          id: id("uplifting oils"),
          title: "Uplifting Oils · Solar",
          blurb:
            "Diffuser or palm inhalation: sweet orange, lemon, or peppermint. Apply 1–2 drops in carrier oil, rub palms, and inhale 3 bright breaths.",
          minutes: 1,
          tags: ["Uplifting", "essential oil", "focus"],
          icon: <Droplet className="w-4 h-4" />,
        },
        {
          id: id("green tea or tulsi"),
          title: "Green Tea or Tulsi",
          blurb:
            "A mug of green tea or tulsi (holy basil) to wake gently without jolting the nervous system.",
          tags: ["gentle energy", "adaptogen"],
          icon: <Flower2 className="w-4 h-4" />,
        },
      ]
    : needsCalm
    ? [
        {
          id: id("grounding oils"),
          title: "Grounding Oils · Earth",
          blurb:
            "Cedarwood, vetiver, or frankincense on the soles of your feet or wrists (always diluted). Inhale 3 slow breaths feeling your feet heavy.",
          minutes: 1,
          tags: ["Grounding", "nervous system"],
          icon: <Droplet className="w-4 h-4" />,
        },
        {
          id: id("heart tea"),
          title: "Heart-Softening Tea",
          blurb:
            "Rose, hawthorn, or chamomile in a warm mug. Sip with one hand on your heart and ask, “How can I be 1% kinder to myself today?”",
          tags: ["Heart-Opening", "soothing"],
          icon: <Flower2 className="w-4 h-4" />,
        },
      ]
    : [
        {
          id: id("balancing herbs"),
          title: "Balancing Herbs",
          blurb:
            "Tulsi, chamomile, or rooibos — choose one and make it a small ritual. Smell the steam, take three slow breaths, then sip.",
          tags: ["steady", "ritual"],
          icon: <Flower2 className="w-4 h-4" />,
        },
        {
          id: id("soft diffuser blend"),
          title: "Soft Diffuser Blend",
          blurb:
            "Lavender + a touch of citrus in the diffuser. Let the scent hold you while you do one simple task at a time.",
          tags: ["clarity", "soft focus"],
          icon: <Droplet className="w-4 h-4" />,
        },
      ];

  return { movement, breath, nourish, plantAllies };
}

/* ──────────────────────────────────────────────────────────────
 * Small UI Bits
 * ────────────────────────────────────────────────────────────── */

function GlowChip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${className}`}
    >
      {children}
    </span>
  );
}

function MiniChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-200">
      {children}
    </span>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/85 p-5 shadow-xl shadow-slate-950/80 transition hover:border-violet-500/60 hover:bg-slate-900/95">
      <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400/40 via-violet-400/40 to-sky-400/40 p-[2px] shadow-lg shadow-violet-500/40">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950">
              {icon}
            </div>
          </div>
          <h2 className="bg-gradient-to-r from-violet-100 via-fuchsia-100 to-sky-100 bg-clip-text text-sm font-semibold uppercase tracking-[0.16em] text-transparent">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
 * AI Insight helper
 * ────────────────────────────────────────────────────────────── */

async function fetchTodayInsight(): Promise<string> {
  try {
    const res = await fetch("/api/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "day",
        intent:
          "Return one short, warm 1–2 paragraph energy insight for today with 2–3 tiny, realistic actions. Tone: calm, luxurious, grounded, From Within brand.",
      }),
    });

    if (!res.ok) throw new Error("Failed");
    const data = await res.json().catch(() => null);
    const text =
      data?.prompt || data?.message || data?.insight || data?.result || "";
    if (typeof text === "string" && text.trim()) return text.trim();
  } catch {
    // ignore
  }

  return (
    "Your system is asking for gentle consistency today. Choose one small ritual — a few breaths, a stretch, or a cup of something soothing — and let that be enough. You don’t have to fix everything at once; you just have to meet yourself honestly, right here."
  );
}

/* ──────────────────────────────────────────────────────────────
 * Page
 * ────────────────────────────────────────────────────────────── */

export default function TodayEnergyPage() {
  const sleep = useMockSleep();
  const vibe = useMemo(() => getMorningVibe(sleep), [sleep]);
  const plan = useMemo(() => buildTodayPlan(sleep), [sleep]);

  const [insight, setInsight] = useState<string>("Loading your insight…");
  const [loadingInsight, setLoadingInsight] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingInsight(true);
      const text = await fetchTodayInsight();
      if (mounted) {
        setInsight(text);
        setLoadingInsight(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const todayStr = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    []
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Cosmic background orb */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[130vh] w-[130vh] rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.35),_rgba(129,140,248,0.28),_rgba(56,189,248,0.18),_transparent_70%)] blur-3xl" />
      </div>
      <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 -z-10 h-80 w-80 rounded-full bg-sky-500/18 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-20 pt-8 md:px-8">
        {/* Hero */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Today
            </p>
            <h1 className="mt-1 flex flex-wrap items-baseline gap-2 text-2xl font-semibold text-slate-50 md:text-3xl">
              {greetingNow()}
              <span className="text-xs font-normal uppercase tracking-[0.2em] text-slate-400">
                • {todayStr}
              </span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              A single, luxurious snapshot of your field right now — how you’re
              sleeping, what your energy is whispering, and the 3–4 things that
              actually matter today.
            </p>
          </div>

          <div className="space-y-3 text-right">
            <GlowChip className={vibe.chipClass}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Today’s Vibe · {vibe.label}</span>
            </GlowChip>
            <p className="text-xs text-slate-400">{vibe.tagline}</p>
          </div>
        </header>

        {/* Snapshot + wearable */}
        <SectionCard
          title="Body Snapshot"
          icon={<BedDouble className="w-4 h-4 text-slate-50" />}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-200 backdrop-blur">
                <Moon className="h-3.5 w-3.5" />
                <span className="uppercase tracking-[0.18em]">
                  Sleep · {sleep.date}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-200">
                <MiniChip>
                  <BedDouble className="mr-1 h-3.5 w-3.5" />
                  {minutesToHMM(sleep.durationMin)} total
                </MiniChip>
                <MiniChip>
                  <Moon className="mr-1 h-3.5 w-3.5" />
                  {sleep.efficiencyPct}% efficiency
                </MiniChip>
                <MiniChip>
                  <HeartPulse className="mr-1 h-3.5 w-3.5" />
                  HRV {sleep.hrvMs ? `${sleep.hrvMs} ms` : "—"}
                </MiniChip>
                <MiniChip>
                  <Activity className="mr-1 h-3.5 w-3.5" />
                  {(sleep.restlessnessPct ?? 0)}% restlessness
                </MiniChip>
                <MiniChip>Wakes: {sleep.wakeEvents ?? 0}</MiniChip>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <ConnectWearable />
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Info className="h-3 w-3" />
                This snapshot uses demo data until a wearable is connected.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Insight of the Day */}
        <SectionCard
          title="Insight of the Day"
          icon={<Sparkles className="w-4 h-4 text-slate-50" />}
        >
          <div className="space-y-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-100">
              {insight}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/checkin" className="group inline-flex">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/40 transition group-hover:shadow-violet-400/70">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/95 px-4 py-2 text-xs font-medium text-slate-50">
                    <PenSquare className="h-3.5 w-3.5" />
                    Journal with this
                  </span>
                </span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  setLoadingInsight(true);
                  const text = await fetchTodayInsight();
                  setInsight(text);
                  setLoadingInsight(false);
                }}
                className="text-[11px] text-sky-300 underline-offset-2 hover:underline"
              >
                {loadingInsight ? "Refreshing…" : "New insight"}
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Rituals Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard
            title="Move & Unwind"
            icon={<Activity className="w-4 h-4 text-emerald-200" />}
          >
            <ul className="space-y-3 text-sm text-slate-200">
              {plan.movement.map((m) => (
                <li
                  key={m.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3"
                >
                  <div className="flex items-center gap-2 text-slate-50">
                    {m.icon}
                    <span className="text-sm font-medium">{m.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-200">{m.blurb}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.minutes && <MiniChip>~{m.minutes} min</MiniChip>}
                    {m.tags?.map((t) => (
                      <MiniChip key={t}>{t}</MiniChip>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Breath & Nervous System"
            icon={<Wind className="w-4 h-4 text-sky-200" />}
          >
            <ul className="space-y-3 text-sm text-slate-200">
              {plan.breath.map((b) => (
                <li
                  key={b.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3"
                >
                  <div className="flex items-center gap-2 text-slate-50">
                    {b.icon}
                    <span className="text-sm font-medium">{b.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-200">{b.blurb}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {b.minutes && <MiniChip>~{b.minutes} min</MiniChip>}
                    {b.tags?.map((t) => (
                      <MiniChip key={t}>{t}</MiniChip>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Nourish & Support"
            icon={<Soup className="w-4 h-4 text-amber-200" />}
          >
            <ul className="space-y-3 text-sm text-slate-200">
              {plan.nourish.map((n) => (
                <li
                  key={n.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3"
                >
                  <div className="flex items-center gap-2 text-slate-50">
                    {n.icon}
                    <span className="text-sm font-medium">{n.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-200">{n.blurb}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {n.minutes && <MiniChip>~{n.minutes} min</MiniChip>}
                    {n.tags?.map((t) => (
                      <MiniChip key={t}>{t}</MiniChip>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Plant Allies · Crystals & Oils"
            icon={<Gem className="w-4 h-4 text-emerald-200" />}
          >
            <ul className="space-y-3 text-sm text-slate-200">
              {plan.plantAllies.map((p) => (
                <li
                  key={p.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3"
                >
                  <div className="flex items-center gap-2 text-slate-50">
                    {p.icon}
                    <span className="text-sm font-medium">{p.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-200">{p.blurb}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.minutes && <MiniChip>~{p.minutes} min</MiniChip>}
                    {p.tags?.map((t) => (
                      <MiniChip key={t}>{t}</MiniChip>
                    ))}
                  </div>
                </li>
              ))}
              <li className="mt-1 text-[10px] text-slate-500">
                Always dilute essential oils properly and check with your
                practitioners where needed — this is educational, not medical
                advice.
              </li>
            </ul>
          </SectionCard>
        </div>

        {/* Moments of Zen – Spotify Playlists */}
        <ZenPlaylists />

        {/* Quick Links */}
        <section className="mt-4 flex flex-wrap gap-4">
          <Link
            href="/morning"
            className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/40 px-5 py-3 text-xs font-medium text-slate-100 shadow-[0_0_12px_rgba(255,255,255,0.06)] backdrop-blur-sm transition-all hover:bg-slate-800/60 md:text-sm"
          >
            <Sun className="h-4 w-4" />
            Full Morning Ritual
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/insights"
            className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/40 px-5 py-3 text-xs font-medium text-slate-100 shadow-[0_0_12px_rgba(255,255,255,0.06)] backdrop-blur-sm transition-all hover:bg-slate-800/60 md:text-sm"
          >
            <HeartPulse className="h-4 w-4" />
            Body Insights &amp; Chakra Plan
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/energy/month"
            className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/40 px-5 py-3 text-xs font-medium text-slate-100 shadow-[0_0_12px_rgba(255,255,255,0.06)] backdrop-blur-sm transition-all hover:bg-slate-800/60 md:text-sm"
          >
            <Moon className="h-4 w-4" />
            Monthly Cosmic Flow
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </main>
  );
}

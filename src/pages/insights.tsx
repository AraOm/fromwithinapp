// src/pages/insights.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  Brain,
  Gem,
  HeartPulse,
  Info,
  Moon,
  Sparkles,
  Sun,
  Wind,
  ArrowRight,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────────────────────── */

type InsightResponse = {
  message?: string;
  insight?: string;
  text?: string;
};

type ChakraCard = {
  id: string;
  name: string;
  color: string;
  focus: string;
  body: string;
  micro: string;
};

/* ──────────────────────────────────────────────────────────────
 * Static chakra data (can evolve later)
 * ────────────────────────────────────────────────────────────── */

const CHAKRAS: ChakraCard[] = [
  {
    id: "root",
    name: "Root · Muladhara",
    color: "from-rose-500 via-red-500 to-orange-500",
    focus: "Safety, belonging, stability",
    body: "Feet, legs, pelvis, lower spine",
    micro:
      "Press your feet into the floor for 30 seconds and feel the weight dropping down. One honest exhale with the thought, “I am supported enough for this moment.”",
  },
  {
    id: "sacral",
    name: "Sacral · Svadhisthana",
    color: "from-orange-500 via-amber-400 to-rose-400",
    focus: "Emotion, pleasure, fluidity",
    body: "Hips, low belly, reproductive organs",
    micro:
      "Rock your hips slowly in a small circle while seated or standing. Let the breath move like a tide in the low belly.",
  },
  {
    id: "solar",
    name: "Solar Plexus · Manipura",
    color: "from-amber-400 via-yellow-400 to-lime-400",
    focus: "Confidence, will, digestion",
    body: "Stomach, diaphragm, mid-spine",
    micro:
      "Place a warm hand on your upper belly. Inhale gently into the hand, exhale with the words, “I’m allowed to take up space.”",
  },
  {
    id: "heart",
    name: "Heart · Anahata",
    color: "from-emerald-400 via-teal-400 to-sky-400",
    focus: "Love, connection, compassion",
    body: "Chest, lungs, upper back, arms",
    micro:
      "Roll the shoulders up, back, and down three times. Then rest one hand on your heart and name one person (or being) you’re grateful for.",
  },
  {
    id: "throat",
    name: "Throat · Vishuddha",
    color: "from-sky-400 via-blue-400 to-indigo-400",
    focus: "Expression, truth, boundaries",
    body: "Throat, neck, jaw, shoulders",
    micro:
      "Stretch the neck gently side to side, then whisper one simple true sentence you’ve been holding back — just for you.",
  },
  {
    id: "third-eye",
    name: "Third Eye · Ajna",
    color: "from-indigo-400 via-violet-400 to-fuchsia-400",
    focus: "Insight, intuition, perspective",
    body: "Eyes, brow, temples, head",
    micro:
      "Soften your gaze or close your eyes. Imagine a cool indigo light between your brows and ask, “What would future-me thank me for today?”",
  },
  {
    id: "crown",
    name: "Crown · Sahasrara",
    color: "from-fuchsia-400 via-purple-400 to-slate-200",
    focus: "Connection, meaning, spaciousness",
    body: "Top of head, nervous system as a whole",
    micro:
      "Lengthen your spine, lift the crown of your head. Imagine a soft stream of light pouring down through you and out through the soles of your feet.",
  },
];

/* ──────────────────────────────────────────────────────────────
 * AI helper
 * ────────────────────────────────────────────────────────────── */

async function fetchBodyInsight(): Promise<string> {
  try {
    const res = await fetch("/api/energy/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent:
          "Return a concise, 1–2 paragraph body + energy insight that feels like a luxury nervous-system mentor. Include 2–3 tiny, realistic actions.",
      }),
    });

    if (!res.ok) throw new Error("Request failed");
    const data: InsightResponse = await res.json();

    const text =
      data.message || data.insight || data.text || JSON.stringify(data);

    if (text && typeof text === "string") return text.trim();
  } catch (e) {
    // ignore, fall through to default
  }

  return (
    "Your system is asking for softness over performance today. Instead of fixing every sensation, try staying close to one: your breath, the weight of your body, or the feeling of your feet on the floor. Let your nervous system set the pace — your clarity will follow."
  );
}

/* ──────────────────────────────────────────────────────────────
 * Page
 * ────────────────────────────────────────────────────────────── */

export default function InsightsPage() {
  const [insight, setInsight] = useState<string>("Loading your insight…");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const text = await fetchBodyInsight();
      if (mounted) {
        setInsight(text);
        setLoading(false);
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
      {/* soft cosmic background */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[130vh] w-[130vh] rounded-full bg-[radial-gradient(circle_at_center,_rgba(129,140,248,0.3),_rgba(244,114,182,0.28),_rgba(56,189,248,0.15),_transparent_70%)] blur-3xl" />
      </div>
      <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-72 w-72 rounded-full bg-fuchsia-500/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 -z-10 h-80 w-80 rounded-full bg-sky-500/18 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Body Insights
            </p>
            <h1 className="mt-1 flex flex-wrap items-baseline gap-2 text-2xl font-semibold text-slate-50 md:text-3xl">
              Your Field Today
              <span className="text-xs font-normal uppercase tracking-[0.2em] text-slate-400">
                • {todayStr}
              </span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              A luxury check-in for your body, chakras, and nervous system —
              translated into tiny, livable adjustments instead of perfection
              projects.
            </p>
          </div>

          <div className="space-y-2 text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/80 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
              Nervous-System First
            </span>
            <p className="text-xs text-slate-500">
              Pair this with the{" "}
              <Link
                href="/energy/today"
                className="text-sky-300 underline-offset-2 hover:underline"
              >
                Today
              </Link>{" "}
              page for a full energy snapshot.
            </p>
          </div>
        </header>

        {/* AI insight card */}
        <section className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/85 p-6 shadow-xl shadow-slate-950/80">
          <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                  <Brain className="h-5 w-5 text-slate-50" />
                </div>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
                  Insight Of The Moment
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  AI-assisted, but always in service of your inner voice.
                </p>
              </div>
            </div>

            <div className="mt-2 flex-1 space-y-3 text-sm text-slate-100 md:mt-0">
              <p className="whitespace-pre-line leading-relaxed">{insight}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/checkin" className="group inline-flex">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/40 transition group-hover:shadow-violet-400/70">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/95 px-4 py-2 text-xs font-medium text-slate-50">
                      <Activity className="h-3.5 w-3.5" />
                      Log how your body feels
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    const text = await fetchBodyInsight();
                    setInsight(text);
                    setLoading(false);
                  }}
                  className="text-[11px] text-sky-300 underline-offset-2 hover:underline"
                >
                  {loading ? "Refreshing…" : "New insight"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Chakra grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Chakra Body Map
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Use this as a menu, not a to-do list. Start where your body is
                already talking.
              </p>
            </div>
            <div className="hidden text-right text-[11px] text-slate-500 md:block">
              <p>Notice where you feel heavy, tight, buzzy, or numb.</p>
              <p>Pick one card below and try the micro-ritual.</p>
            </div>
          </div>

          <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CHAKRAS.map((c) => (
              <article
                key={c.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/85 p-4 text-sm shadow-lg shadow-slate-950/70 transition hover:-translate-y-0.5 hover:border-violet-500/60"
              >
                <div
                  className={`pointer-events-none absolute inset-x-10 top-0 h-24 rounded-full bg-gradient-to-r ${c.color} opacity-25 blur-3xl`}
                />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-[13px] font-semibold text-slate-50">
                        {c.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">{c.focus}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 ring-1 ring-slate-700/80">
                      <Gem className="h-4 w-4 text-slate-100" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Body focus: {c.body}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-200">
                    {c.micro}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Gentle footer links */}
        <section className="mt-4 flex flex-wrap gap-3 text-[11px] md:text-xs">
          <Link
            href="/morning"
            className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-950/85 px-3 py-1 text-slate-200 hover:border-violet-400/80 hover:text-slate-50"
          >
            <Sun className="h-3.5 w-3.5" />
            Morning Ritual
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/energy/month"
            className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-950/85 px-3 py-1 text-slate-200 hover:border-sky-400/80 hover:text-slate-50"
          >
            <Moon className="h-3.5 w-3.5" />
            Energy Calendar
            <ArrowRight className="h-3 w-3" />
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-800/80 bg-slate-950/85 px-3 py-1 text-slate-400">
            <Info className="h-3.5 w-3.5" />
            Educational, not medical advice. Always listen to your care team and
            your own body.
          </span>
        </section>
      </div>
    </main>
  );
}

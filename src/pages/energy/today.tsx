"use client";

import React from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Sparkles,
  HeartPulse,
  Wind,
  Clock,
} from "lucide-react";

export default function TodayEnergyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        {/* Back link */}
        <div>
          <Link
            href="/energy-calendar"
            className="text-xs font-medium text-sky-300 hover:text-sky-100"
          >
            ← Back to Energy Calendar
          </Link>
        </div>

        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Today’s Frequency
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Today’s Energy
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              A quick read on the sky, how it touches your field, and one
              simple ritual to align with it.
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Cosmic Snapshot
            </p>
            <p className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Sun · Moon · You
            </p>
          </div>
        </header>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cosmic snapshot */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Sun className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Cosmic Snapshot
                  </h2>
                  <p className="text-xs text-slate-300">
                    Use this as a poetic mirror, even before we wire in real-time
                    astro data.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-slate-200">
                    <Sun className="h-4 w-4 text-amber-300" />
                    Sun
                  </span>
                  <span className="text-xs text-slate-300">
                    In your core self, identity & life-force themes are highlighted.
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-slate-200">
                    <Moon className="h-4 w-4 text-sky-300" />
                    Moon
                  </span>
                  <span className="text-xs text-slate-300">
                    Emotional tides, intuition, and body wisdom are louder today.
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-slate-200">
                    <Clock className="h-4 w-4 text-fuchsia-300" />
                    Today’s Vibe
                  </span>
                  <span className="text-xs text-slate-300">
                    Think “soft recalibration” rather than pushing or forcing.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* How it lands in your field */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
            <div className="pointer-events-none absolute -right-12 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-violet-400 via-sky-400 to-emerald-400 p-[2px] shadow-lg shadow-violet-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <HeartPulse className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    How It Feels In Your Field
                  </h2>
                  <p className="text-xs text-slate-300">
                    Check in with your body and aura instead of just your mind.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p>
                  Notice where your body is already telling the story:
                </p>
                <ul className="space-y-1">
                  <li>• Tight jaw or forehead → mental overload, future worry.</li>
                  <li>• Heavy chest → heart processing old stories.</li>
                  <li>• Fluttery belly → threshold energy, something new forming.</li>
                </ul>

                <div className="mt-3 flex flex-wrap gap-2">
                  {["Soft focus", "Slow decisions", "Nervous system first", "Drink water"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-wide text-sky-200"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Ritual card */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl">
          <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-rose-400 via-amber-300 to-violet-400 p-[2px] shadow-lg shadow-rose-500/30">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                  <Sparkles className="h-5 w-5 text-slate-50" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-50">
                  Micro-Ritual For Today
                </h2>
                <p className="text-xs text-slate-300">
                  A 3-step reset you can do in under 5 minutes.
                </p>
              </div>
            </div>

            <div className="mt-2 flex-1 text-sm text-slate-200 md:mt-0">
              <ol className="space-y-3">
                <li>
                  <span className="font-semibold text-sky-200">1. Breathe (3 rounds)</span>
                  <p className="text-xs text-slate-300">
                    Inhale gently through the nose for 4, hold for 2, exhale slowly for 6.
                    Imagine a soft glow around your heart expanding on each exhale.
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-sky-200">2. Place your hands</span>
                  <p className="text-xs text-slate-300">
                    One hand on your heart, one on your belly. Whisper,{" "}
                    <span className="italic text-sky-100">
                      “I am allowed to move at the speed of my nervous system.”
                    </span>
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-sky-200">3. Choose one word</span>
                  <p className="text-xs text-slate-300">
                    Pick a single word for your day (e.g.,{" "}
                    <span className="italic">“soften,” “trust,” “focus,” “play”</span>) and let
                    every decision orbit around that word.
                  </p>
                </li>
              </ol>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400">
                <Wind className="h-3 w-3" />
                Nervous system–friendly, no perfection required.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Camera,
  Grid3X3,
  ScrollText,
  Wand2,
} from "lucide-react";

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Playground
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Play
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Explore aura photography, crystal identification, virtual grids,
              and sacred quests — simple portals into deeper energy work.
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Aura · Crystals · Rituals
            </p>
          </div>
        </header>

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Aura Photography (Sim) */}
          <Link
            href="/aura"
            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90"
          >
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Sparkles className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Aura Photography (Sim)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Upload a selfie; AI overlays aura colors and angel codes
                    from mood, journals, and biometrics.
                  </p>
                </div>
              </div>

              <p className="text-xs font-medium text-sky-200 group-hover:text-sky-100">
                Open →
              </p>
            </div>
          </Link>

          {/* Crystal Identifier */}
          <Link
            href="/crystal-identifier"
            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90"
          >
            <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-amber-300 via-fuchsia-400 to-sky-400 p-[2px] shadow-lg shadow-amber-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Camera className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    ✨ Crystal Identifier
                  </h2>
                  <p className="text-xs text-slate-300">
                    Snap a crystal photo → AI identifies the stone, chakra
                    alignment, and key uses.
                  </p>
                </div>
              </div>

              <p className="text-xs font-medium text-sky-200 group-hover:text-sky-100">
                Open →
              </p>
            </div>
          </Link>

          {/* Virtual Crystal Grids */}
          <Link
            href="/grids"
            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90"
          >
            <div className="pointer-events-none absolute -left-12 top-2 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-4 bottom-0 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-violet-400 via-sky-400 to-emerald-400 p-[2px] shadow-lg shadow-violet-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Grid3X3 className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Crystal Grids (Virtual)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Generate Seed of Life, Star of David, or Merkaba layouts;
                    AI suggests stones, placements, and intentions.
                  </p>
                </div>
              </div>

              <p className="text-xs font-medium text-sky-200 group-hover:text-sky-100">
                Open →
              </p>
            </div>
          </Link>

          {/* Sacred Quests */}
          <Link
            href="/quests"
            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90"
          >
            <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-rose-400 via-amber-300 to-violet-400 p-[2px] shadow-lg shadow-rose-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <ScrollText className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Sacred Quests
                  </h2>
                  <p className="text-xs text-slate-300">
                    7–21 day paths weaving journaling, small actions, and
                    rituals tailored to your current energy themes.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Wand2 className="h-4 w-4" />
                  Guided micro-rituals
                </span>
                <span className="font-medium text-sky-200 group-hover:text-sky-100">
                  Open →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

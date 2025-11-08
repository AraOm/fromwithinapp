"use client";

import React from "react";
import Link from "next/link";
import { Sun, Moon, CalendarDays, Sparkles, Star, Clock } from "lucide-react";

export default function EnergyCalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Cosmic Flow
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Energy Calendar
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Track lunar cycles, eclipses, retrogrades, and energy portals —
              and see how they align with your personal field.
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Moon · Stars · Energy
            </p>
          </div>
        </header>

        {/* Energy Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Today’s Energy */}
          <Link
            href="/energy/today"
            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90"
          >
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Sun className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Today’s Energy
                  </h2>
                  <p className="text-xs text-slate-300">
                    View current planetary positions, moon phase, and how this
                    influences your aura & focus today.
                  </p>
                </div>
              </div>

              <p className="text-xs font-medium text-sky-200 group-hover:text-sky-100">
                Open →
              </p>
            </div>
          </Link>

          {/* Month View */}
          <Link
            href="/energy/month"
            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90"
          >
            <div className="pointer-events-none absolute -left-12 top-2 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-4 bottom-0 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-violet-400 via-sky-400 to-emerald-400 p-[2px] shadow-lg shadow-violet-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <CalendarDays className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Monthly Flow
                  </h2>
                  <p className="text-xs text-slate-300">
                    Calendar of lunar phases, solar flares, and planetary
                    alignments with energy color coding.
                  </p>
                </div>
              </div>

              <p className="text-xs font-medium text-sky-200 group-hover:text-sky-100">
                Open →
              </p>
            </div>
          </Link>

          {/* Retrogrades & Eclipses */}
          <Link
            href="/energy/retrogrades"
            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90"
          >
            <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-rose-400 via-amber-300 to-violet-400 p-[2px] shadow-lg shadow-rose-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Moon className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Retrogrades & Eclipses
                  </h2>
                  <p className="text-xs text-slate-300">
                    Track cosmic shifts and learn how to ground your energy
                    during planetary turbulence.
                  </p>
                </div>
              </div>

              <p className="text-xs font-medium text-sky-200 group-hover:text-sky-100">
                Open →
              </p>
            </div>
          </Link>

          {/* Personal Alignments */}
          <Link
            href="/energy/personal"
            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90"
          >
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-sky-400 p-[2px] shadow-lg shadow-fuchsia-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Star className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Personal Alignments
                  </h2>
                  <p className="text-xs text-slate-300">
                    Log your energy peaks, insights, and receive AI reflections
                    on cosmic resonance patterns.
                  </p>
                </div>
              </div>

              <p className="text-xs font-medium text-sky-200 group-hover:text-sky-100">
                Open →
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

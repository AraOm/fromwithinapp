"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, Moon, Sparkles, Star } from "lucide-react";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthlyFlowPage() {
  // Just a symbolic sample month layout — you can later plug real dates in.
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const newMoonDay = 5;
  const fullMoonDay = 19;
  const eclipseDay = 23;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
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
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Monthly Flow
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Lunar & Cosmic Rhythm
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              A bird’s-eye view of the month: new moons, full moons, portals, and
              “anchor days” for your rituals and rest.
            </p>
          </div>

          {/* Month badge */}
          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Sample Month
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-xs text-slate-200">
              <CalendarDays className="h-4 w-4 text-sky-300" />
              Your Current Cycle
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          {/* Calendar grid */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl">
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                      <Moon className="h-5 w-5 text-slate-50" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-50">
                      Month View
                    </h2>
                    <p className="text-xs text-slate-300">
                      Use this as your ritual map. Full calendar logic comes later.
                    </p>
                  </div>
                </div>
              </div>

              {/* Weekday labels */}
              <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-wide text-slate-400">
                {weekdayLabels.map((label) => (
                  <div key={label}>{label}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-2 text-xs">
                {days.map((day) => {
                  const isNewMoon = day === newMoonDay;
                  const isFullMoon = day === fullMoonDay;
                  const isEclipse = day === eclipseDay;

                  const isSpecial = isNewMoon || isFullMoon || isEclipse;

                  return (
                    <button
                      key={day}
                      className={`group relative flex h-16 flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/70 text-slate-200 transition
                        ${isSpecial ? "hover:border-violet-400/70 hover:bg-slate-900/90" : "hover:border-sky-500/50 hover:bg-slate-900"}
                      `}
                    >
                      {isSpecial && (
                        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 via-violet-500/10 to-sky-500/10 blur-xl" />
                      )}
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <span className="text-sm font-semibold">{day}</span>
                        {isNewMoon && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-sky-200">
                            ● New Moon
                          </span>
                        )}
                        {isFullMoon && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-violet-200">
                            ◐ Full Moon
                          </span>
                        )}
                        {isEclipse && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-amber-200">
                            ✶ Eclipse
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Key portals / meaning */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl">
            <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-emerald-400 via-sky-400 to-fuchsia-400 p-[2px] shadow-lg shadow-emerald-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Star className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Key Portals This Month
                  </h2>
                  <p className="text-xs text-slate-300">
                    Anchor days for ritual, reflection, or simply extra gentleness.
                  </p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li>
                  <span className="font-semibold text-sky-200">New Moon (Day 5)</span>
                  <p>
                    Seed intentions. Journal a single sentence beginning with{" "}
                    <span className="italic text-slate-100">“I’m ready to…”</span>
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-violet-200">Full Moon (Day 19)</span>
                  <p>
                    Release & reveal. Write down 3 things you’re willing to stop
                    carrying in your body.
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-amber-200">Eclipse Portal (Day 23)</span>
                  <p>
                    Big timeline shifts. Keep schedule light, hydrate, and avoid
                    over-explaining yourself to people who don’t feel safe.
                  </p>
                </li>
              </ul>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400">
                <Sparkles className="h-3 w-3" />
                This is a symbolic layout until we plug in real ephemeris data.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

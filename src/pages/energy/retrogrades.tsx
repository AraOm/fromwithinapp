"use client";

import React from "react";
import Link from "next/link";
import { Moon, Sparkles, AlertTriangle, Star } from "lucide-react";

type SkyEvent = {
  id: string;
  date: string;
  label: string;
  type: "Retrograde" | "Eclipse" | "Portal";
  planetOrNode: string;
  theme: string;
  guidance: string;
};

const events: SkyEvent[] = [
  {
    id: "1",
    date: "Sample · Week 1",
    label: "Mercury Retrograde Shadow",
    type: "Retrograde",
    planetOrNode: "Mercury",
    theme: "Review, revisiting conversations, tech quirks",
    guidance:
      "Speak slower, read twice before sending, and don’t panic if plans need rearranging.",
  },
  {
    id: "2",
    date: "Sample · Week 2",
    label: "Lunar Eclipse Vibes",
    type: "Eclipse",
    planetOrNode: "Moon / Nodes",
    theme: "Emotional endings, karmic storylines closing",
    guidance:
      "Let old roles fall away. Take extra alone time, avoid forcing clarity from others.",
  },
  {
    id: "3",
    date: "Sample · Week 3",
    label: "Saturn Retrograde Glow",
    type: "Retrograde",
    planetOrNode: "Saturn",
    theme: "Boundaries, long-term commitments, soul-level responsibility",
    guidance:
      "Revisit where you over-give. Simplify commitments to what actually feels aligned.",
  },
  {
    id: "4",
    date: "Sample · Week 4",
    label: "Solar Portal Day",
    type: "Portal",
    planetOrNode: "Sun",
    theme: "Creative charge, visibility, expression",
    guidance:
      "Share a small piece of your truth: a text, a post, or a whisper to yourself in the mirror.",
  },
];

export default function RetrogradesPage() {
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
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Cosmic Reroutes
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Retrogrades & Eclipses
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Not “everything falls apart” but “time to listen more closely.”
              These are built-in review portals.
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Sample Stream
            </p>
            <p className="bg-gradient-to-r from-rose-300 via-amber-300 to-violet-300 bg-clip-text text-sm font-semibold text-transparent">
              Big Sky Moments
            </p>
          </div>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-300">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
            Retrograde (review, revise, re-align)
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            Eclipse (sudden shifts, endings & beginnings)
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-sky-300" />
            Portal (amplified energy, manifestation windows)
          </div>
        </div>

        {/* Events list */}
        <div className="space-y-4">
          {events.map((event) => {
            const isRetrograde = event.type === "Retrograde";
            const isEclipse = event.type === "Eclipse";
            const isPortal = event.type === "Portal";

            return (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/95"
              >
                <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full bg-gradient-to-br p-[2px] shadow-lg
                        ${
                          isRetrograde
                            ? "from-fuchsia-400 via-violet-400 to-sky-400 shadow-fuchsia-500/30"
                            : isEclipse
                            ? "from-amber-300 via-rose-400 to-violet-400 shadow-amber-500/30"
                            : "from-sky-300 via-emerald-300 to-fuchsia-400 shadow-sky-500/30"
                        }
                      `}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                        {isEclipse ? (
                          <AlertTriangle className="h-5 w-5 text-amber-200" />
                        ) : isRetrograde ? (
                          <Moon className="h-5 w-5 text-fuchsia-200" />
                        ) : (
                          <Star className="h-5 w-5 text-sky-200" />
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        {event.date}
                      </p>
                      <h2 className="text-sm font-semibold text-slate-50 md:text-base">
                        {event.label}
                      </h2>
                      <p className="mt-1 text-xs text-slate-300">
                        <span className="font-semibold text-sky-200">
                          {event.planetOrNode}
                        </span>{" "}
                        · {event.theme}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 max-w-md text-xs text-slate-200 md:mt-0">
                    <p>{event.guidance}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] uppercase tracking-wide text-slate-400">
                      <Sparkles className="h-3 w-3" />
                      Use this as reflective guidance until live astro data is plugged in.
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// src/pages/energy/month.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Moon,
  Star,
  Sparkles,
  ChevronLeft,
  Activity,
  HeartPulse,
  Brain,
} from "lucide-react";

type PortalType = "new-moon" | "full-moon" | "eclipse" | "none";

type DayInfo = {
  day: number;
  portalType: PortalType;
};

// Biometrics summary for a day (you'll wire this to your wearable backend)
type BiometricDaySummary = {
  day: number; // 1–31 for current month
  sleepHours?: number | null;
  hrvMs?: number | null;
  readiness?: "low" | "medium" | "high";
  stressLevel?: "calm" | "wired" | "drained";
  note?: string;
};

type BiometricsResponse = {
  summaries: BiometricDaySummary[];
};

// Simple symbolic month: New Moon (5), Full Moon (19), Eclipse (23)
const DAYS: DayInfo[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  if (day === 5) return { day, portalType: "new-moon" };
  if (day === 19) return { day, portalType: "full-moon" };
  if (day === 23) return { day, portalType: "eclipse" };
  return { day, portalType: "none" };
});

function getLunarDetails(day: DayInfo) {
  switch (day.portalType) {
    case "new-moon":
      return {
        title: `New Moon · Day ${day.day}`,
        tag: "Seed Intentions",
        color: "text-sky-200",
        description:
          "Fresh start energy. Beautiful for setting intentions, beginning a new habit, or quietly resetting your nervous system.",
      };
    case "full-moon":
      return {
        title: `Full Moon · Day ${day.day}`,
        tag: "Release & Reveal",
        color: "text-fuchsia-200",
        description:
          "Amplified emotions and clarity. Perfect for releasing old stories, celebrating progress, and seeing what’s been hidden.",
      };
    case "eclipse":
      return {
        title: `Eclipse Portal · Day ${day.day}`,
        tag: "Big Timeline Shift",
        color: "text-amber-200",
        description:
          "Eclipse energy can feel wobbly, intense, or fated. This is a moment to simplify plans, hydrate, and avoid over-explaining yourself.",
      };
    default:
      return {
        title: `Everyday Flow · Day ${day.day}`,
        tag: "Gentle Rhythm",
        color: "text-slate-200",
        description:
          "A regular day in the cosmic rhythm. Subtle shifts, everyday magic. Perfect for steady routines and micro-rituals.",
      };
  }
}

export default function MonthlyFlowPage() {
  const [selectedDay, setSelectedDay] = useState<DayInfo>(DAYS[4]); // default: day 5 (New Moon)

  // biometrics per day (optional: once backend is ready)
  const [biometricsMap, setBiometricsMap] = useState<
    Record<number, BiometricDaySummary>
  >({});
  const [loadingBio, setLoadingBio] = useState(false);
  const [bioError, setBioError] = useState<string | null>(null);

  // AI insights per day
  const [aiInsights, setAiInsights] = useState<Record<number, string>>({});
  const [aiLoadingDay, setAiLoadingDay] = useState<number | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // ─────────────────────────────────────────
  // 1) Load monthly biometrics (can be mock for now)
  // ─────────────────────────────────────────
  useEffect(() => {
    async function loadBiometrics() {
      try {
        setLoadingBio(true);
        setBioError(null);

        const res = await fetch("/api/energy/monthly-biometrics");
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
        const data: BiometricsResponse = await res.json();
        const map: Record<number, BiometricDaySummary> = {};
        data.summaries.forEach((s) => {
          if (s.day >= 1 && s.day <= 31) {
            map[s.day] = s;
          }
        });
        setBiometricsMap(map);
      } catch (err) {
        console.error(err);
        setBioError("Unable to load wearable data for this month.");
      } finally {
        setLoadingBio(false);
      }
    }

    // Safe even if the API is not built yet: you'll just see an error message.
    loadBiometrics();
  }, []);

  // ─────────────────────────────────────────
  // 2) Call AI whenever a new day is selected
  //    (with simple caching per day)
  // ─────────────────────────────────────────
  useEffect(() => {
    const currentDay = selectedDay.day;
    if (aiInsights[currentDay]) return; // already have it

    async function loadInsight() {
      try {
        setAiLoadingDay(currentDay);
        setAiError(null);

        const biometrics = biometricsMap[currentDay] ?? null;

        const res = await fetch("/api/energy/insight", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day: currentDay,
            portalType: selectedDay.portalType,
            biometrics,
          }),
        });

        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }

        const data: { message: string } = await res.json();

        setAiInsights((prev) => ({
          ...prev,
          [currentDay]: data.message,
        }));
      } catch (err) {
        console.error(err);
        setAiError("AI ritual guidance is unavailable right now.");
      } finally {
        setAiLoadingDay(null);
      }
    }

    loadInsight();
  }, [selectedDay, biometricsMap, aiInsights]);

  const lunar = getLunarDetails(selectedDay);
  const selectedBio = biometricsMap[selectedDay.day];
  const aiText = aiInsights[selectedDay.day];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        {/* Top Back / Title Row */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/energy-calendar"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Energy Calendar
          </Link>
          <div className="text-right">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">
              Cosmic Flow
            </p>
            <p className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-300 bg-clip-text text-xs font-semibold text-transparent">
              Lunar · Biometrics · AI
            </p>
          </div>
        </div>

        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Lunar &amp; Cosmic Rhythm
          </h1>
          <p className="max-w-xl text-sm text-slate-300">
            A bird’s-eye view of the month that blends lunar portals, your
            wearable data, and AI insight — so rituals match both the sky and
            your nervous system.
          </p>
        </header>

        {/* Main Layout */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Month Calendar */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-violet-400 via-sky-400 to-indigo-400 p-[2px] shadow-lg shadow-violet-500/40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                      <Moon className="h-5 w-5 text-slate-50" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-50">
                      Month View
                    </h2>
                    <p className="text-xs text-slate-300">
                      Use this as your ritual map. Full calendar logic comes
                      later.
                    </p>
                  </div>
                </div>

                <button className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1 text-[0.65rem] font-medium text-slate-300 backdrop-blur">
                  <Sparkles className="h-3 w-3 text-sky-300" />
                  Sample Month · Your Current Cycle
                </button>
              </div>

              {/* Weekday labels */}
              <div className="grid grid-cols-7 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-500">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-3">
                {DAYS.map((dayInfo) => {
                  const isSelected = selectedDay.day === dayInfo.day;
                  const isSpecial = dayInfo.portalType !== "none";
                  const bio = biometricsMap[dayInfo.day];

                  // Tiny color hint from readiness
                  let ringClass = "";
                  if (bio?.readiness === "high") ringClass = "ring-emerald-400/70";
                  else if (bio?.readiness === "low") ringClass = "ring-amber-400/70";

                  let badge: React.ReactNode = null;
                  if (dayInfo.portalType === "new-moon") {
                    badge = (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[0.65rem] text-sky-200">
                        <Moon className="h-3 w-3" />
                        New Moon
                      </span>
                    );
                  } else if (dayInfo.portalType === "full-moon") {
                    badge = (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-[0.65rem] text-fuchsia-200">
                        <Moon className="h-3 w-3" />
                        Full Moon
                      </span>
                    );
                  } else if (dayInfo.portalType === "eclipse") {
                    badge = (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[0.65rem] text-amber-200">
                        <Star className="h-3 w-3" />
                        Eclipse
                      </span>
                    );
                  }

                  return (
                    <button
                      key={dayInfo.day}
                      type="button"
                      onClick={() => setSelectedDay(dayInfo)}
                      className={[
                        "flex h-20 flex-col items-center justify-center rounded-2xl border text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70",
                        isSelected
                          ? "border-sky-400/80 bg-slate-900/80 shadow-[0_0_0_1px_rgba(56,189,248,0.6),0_18px_45px_rgba(15,23,42,0.95)]"
                          : isSpecial
                          ? "border-slate-700/70 bg-slate-900/60 hover:border-slate-500/80 hover:bg-slate-900"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/70",
                        ringClass ? `ring-1 ${ringClass}` : "",
                      ].join(" ")}
                    >
                      <span
                        className={
                          isSelected
                            ? "text-base font-semibold text-sky-100"
                            : "text-base font-medium text-slate-100"
                        }
                      >
                        {dayInfo.day}
                      </span>
                      {badge}
                    </button>
                  );
                })}
              </div>

              {loadingBio && (
                <p className="mt-2 text-[0.7rem] text-slate-500">
                  Syncing with your wearable signals…
                </p>
              )}
              {bioError && (
                <p className="mt-2 text-[0.7rem] text-amber-300">{bioError}</p>
              )}
            </div>
          </section>

          {/* Right-hand Details + AI */}
          <aside className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
            <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative z-10 space-y-5">
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-sky-400 p-[2px] shadow-lg shadow-fuchsia-500/40">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Star className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Key Portals This Day
                  </h2>
                  <p className="text-xs text-slate-300">
                    Lunar context, body signals, and AI ritual guidance.
                  </p>
                </div>
              </div>

              {/* Lunar overview */}
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
                  Lunar Snapshot
                </p>
                <h3 className="text-sm font-semibold text-slate-50">
                  {lunar.title}
                </h3>
                <p
                  className={`text-xs font-medium ${
                    lunar.color ?? "text-slate-200"
                  }`}
                >
                  {lunar.tag}
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  {lunar.description}
                </p>
              </div>

              {/* Biometrics summary */}
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
                  Body Check-In
                </p>

                {selectedBio ? (
                  <div className="space-y-1.5 text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-emerald-300" />
                      <span>
                        Readiness:{" "}
                        <span className="font-semibold">
                          {selectedBio.readiness ?? "balanced"}
                        </span>
                      </span>
                    </div>
                    {selectedBio.sleepHours != null && (
                      <div className="flex items-center gap-2">
                        <Moon className="h-3.5 w-3.5 text-sky-300" />
                        <span>
                          Sleep:{" "}
                          <span className="font-semibold">
                            {selectedBio.sleepHours.toFixed(1)}h
                          </span>
                        </span>
                      </div>
                    )}
                    {selectedBio.hrvMs != null && (
                      <div className="flex items-center gap-2">
                        <HeartPulse className="h-3.5 w-3.5 text-fuchsia-300" />
                        <span>
                          HRV:{" "}
                          <span className="font-semibold">
                            {Math.round(selectedBio.hrvMs)} ms
                          </span>
                        </span>
                      </div>
                    )}
                    {selectedBio.stressLevel && (
                      <div className="flex items-center gap-2">
                        <Brain className="h-3.5 w-3.5 text-amber-300" />
                        <span>
                          Stress signal:{" "}
                          <span className="font-semibold">
                            {selectedBio.stressLevel}
                          </span>
                        </span>
                      </div>
                    )}
                    {selectedBio.note && (
                      <p className="mt-1 text-[0.7rem] text-slate-400">
                        Note: {selectedBio.note}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No wearable data for this day yet. The AI ritual will still
                    respond based on the lunar pattern.
                  </p>
                )}
              </div>

              {/* AI Insight */}
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
                  AI Ritual Guidance
                </p>

                {aiLoadingDay === selectedDay.day && (
                  <p className="text-xs text-slate-400">
                    Listening to today’s lunar field and your body… ✨
                  </p>
                )}

                {aiError && (
                  <p className="text-xs text-amber-300">{aiError}</p>
                )}

                {!aiError && aiText && (
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-200">
                    {aiText}
                  </p>
                )}

                {!aiError &&
                  !aiText &&
                  aiLoadingDay !== selectedDay.day && (
                    <p className="text-xs text-slate-400">
                      Tap a day in the calendar to receive a personalized lunar
                      ritual.
                    </p>
                  )}
              </div>

              {/* Static highlight list (like your mock) */}
              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-300">
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
                  This Month’s Highlights
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-sky-200">
                      New Moon (Day 5)
                    </p>
                    <p>Seed intentions. Journal one sentence: “I’m ready to…”</p>
                  </div>
                  <div>
                    <p className="font-semibold text-fuchsia-200">
                      Full Moon (Day 19)
                    </p>
                    <p>
                      Release &amp; reveal. Write 3 things you’re willing to
                      stop carrying in your body.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-200">
                      Eclipse Portal (Day 23)
                    </p>
                    <p>
                      Big timeline shifts. Keep schedule light, hydrate, and
                      avoid over-explaining yourself to people who don’t feel
                      safe.
                    </p>
                  </div>
                </div>

                <p className="mt-2 rounded-full bg-slate-900/80 px-3 py-2 text-[0.7rem] text-slate-400">
                  ✶ This is a symbolic layout for now. Real ephemeris + full
                  retrograde timelines can plug into the same AI flow later.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


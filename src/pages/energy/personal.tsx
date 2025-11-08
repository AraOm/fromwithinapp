"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Brain,
  HeartPulse,
  Sparkles,
  Activity,
} from "lucide-react";

const bodyAreas = [
  "Head / Mind",
  "Throat",
  "Chest / Heart",
  "Solar Plexus",
  "Belly",
  "Hips / Low Back",
  "Legs / Feet",
];

const focusWords = ["Rest", "Clarity", "Courage", "Softness", "Expression", "Play"];

export default function PersonalAlignmentsPage() {
  const [selectedBodyArea, setSelectedBodyArea] = useState<string | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [reflection, setReflection] = useState<string | null>(null);

  function generateReflection() {
    // This is just a poetic placeholder; later we’ll swap in real AI via your backend.
    const areaText = selectedBodyArea
      ? `Your body is speaking through your ${selectedBodyArea.toLowerCase()}. `
      : "";
    const focusText = selectedFocus
      ? `Today’s medicine word feels like “${selectedFocus.toLowerCase()}.” `
      : "";
    const notesText = notes
      ? "Whatever you wrote is already a spell. Let it be enough for now."
      : "You don’t have to write a lot for this to count. Even noticing how you feel is a full practice.";

    setReflection(
      `${areaText}${focusText}${notesText} Imagine a soft sphere of light around this part of your body, pulsing gently in and out with your breath.`
    );
  }

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
              Your Inner Sky
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Personal Alignments
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Less “What’s my horoscope?” and more “What is my body and energy
              actually saying today?”
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Energetic Log
            </p>
            <p className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Body · Emotion · Intention
            </p>
          </div>
        </header>

        {/* Layout: left input, right reflection */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input side */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl">
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <Brain className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Check-in
                  </h2>
                  <p className="text-xs text-slate-300">
                    One quick snapshot of today’s inner weather.
                  </p>
                </div>
              </div>

              {/* Body area */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Where do you feel it most?
                </p>
                <div className="flex flex-wrap gap-2">
                  {bodyAreas.map((area) => {
                    const active = selectedBodyArea === area;
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() =>
                          setSelectedBodyArea((prev) => (prev === area ? null : area))
                        }
                        className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wide transition
                          ${
                            active
                              ? "bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 text-slate-950"
                              : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                          }
                        `}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus word */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  If today had a focus word…
                </p>
                <div className="flex flex-wrap gap-2">
                  {focusWords.map((word) => {
                    const active = selectedFocus === word;
                    return (
                      <button
                        key={word}
                        type="button"
                        onClick={() =>
                          setSelectedFocus((prev) => (prev === word ? null : word))
                        }
                        className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wide transition
                          ${
                            active
                              ? "bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-400 text-slate-950"
                              : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                          }
                        `}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Anything your heart wants to say?
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="Stream-of-consciousness is welcome here. No grammar, no perfection."
                />
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={generateReflection}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-violet-500/40 transition hover:opacity-90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Reflection
              </button>
            </div>
          </section>

          {/* Reflection side */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl">
            <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-emerald-400 via-sky-400 to-fuchsia-400 p-[2px] shadow-lg shadow-emerald-500/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                    <HeartPulse className="h-5 w-5 text-slate-50" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Reflection
                  </h2>
                  <p className="text-xs text-slate-300">
                    Later, this will come from your AI guide. For now, it’s a
                    gentle, built-in reminder.
                  </p>
                </div>
              </div>

              <div className="flex-1 rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-200">
                {reflection ? (
                  <p>{reflection}</p>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-xs text-slate-400">
                    <Activity className="h-5 w-5 text-sky-300" />
                    <p>
                      Once you choose a body area, a focus word, and (optionally) write
                      a few notes, tap{" "}
                      <span className="font-semibold text-sky-200">
                        “Generate Reflection”
                      </span>{" "}
                      and let this space mirror you back to yourself.
                    </p>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500">
                Future version: this will sync with your chakra logs, aura readings,
                and Golden Lion Mentor so you can see patterns over weeks and months.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

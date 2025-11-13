// src/pages/home.tsx
import React, { useEffect, useMemo, useState } from "react";

// --- Types ---
type SleepData = {
  score: number;      // 0–100
  hours: number;      // e.g. 6.8
  source?: string;    // provider name
  updatedAt: number;  // ms
};

type SubscriptionStatus = "trialing" | "active" | "canceled" | "incomplete";

// --- Helpers ---
function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

// --- Recommendation Logic (unchanged) ---
function getPlan(sleep: SleepData | null) {
  const score = sleep?.score ?? 70;

  if (score >= 80) {
    return {
      label: "Well-Rested",
      affirmation:
        "I greet this day with clarity, gratitude, and steady strength.",
      stretches:
        "5–8 min gentle flow: neck rolls, shoulder circles, spinal waves, low lunge + heart opener.",
      breakfast:
        "Greek yogurt (or coconut yogurt) with berries + chia; or veggie omelet.",
      drinks:
        "12–16 oz water on rising; then lemon water. Optional: light green tea.",
      meditation:
        "5 min gratitude breath: inhale ‘thank you’, exhale ‘I am supported’.",
      color: "border-emerald-400/50 bg-emerald-500/10",
      statusChip: "bg-emerald-500/20 text-emerald-100 border-emerald-400/40",
    };
  } else if (score >= 60) {
    return {
      label: "Steady",
      affirmation:
        "My energy builds with every mindful breath and kind choice.",
      stretches:
        "8–10 min reset: cat-cow, thoracic twists, hamstring flossing, low squat breath.",
      breakfast:
        "Warm oats with walnuts + cinnamon + banana; or avocado toast with egg.",
      drinks:
        "Warm lemon water; then herbal adaptogen or matcha if desired.",
      meditation: "7–10 min box breathing (4-4-4-4) to sharpen focus.",
      color: "border-sky-400/50 bg-sky-500/10",
      statusChip: "bg-sky-500/20 text-sky-100 border-sky-400/40",
    };
  } else if (score >= 40) {
    return {
      label: "Tired",
      affirmation:
        "I move gently and nourish myself; restoration is productive.",
      stretches:
        "10–12 min yin: long hip openers (figure-4), hamstring strap, sphinx, supported child’s pose.",
      breakfast:
        "Chia pudding with almond butter; or protein smoothie with spinach + berries.",
      drinks:
        "Electrolyte water + ginger tea. Avoid heavy caffeine spikes.",
      meditation:
        "10 min body scan; end with 3 slow sighs (longer exhale).",
      color: "border-amber-400/60 bg-amber-500/10",
      statusChip: "bg-amber-500/25 text-amber-100 border-amber-400/50",
    };
  }
  return {
    label: "Exhausted",
    affirmation:
      "I’m gentle with myself. Rest and care are my priorities today.",
    stretches:
      "10–15 min very gentle: cat-cow, child’s pose, legs-up-the-wall (5–8 min).",
    breakfast:
      "Easy-to-digest: warm miso or veggie soup; or smoothie with banana, oats, protein.",
    drinks:
      "Coconut water or electrolytes; chamomile or lemon balm tea.",
    meditation: "15 min Yoga Nidra or guided rest. Schedule mini breaks.",
    color: "border-rose-400/60 bg-rose-500/10",
    statusChip: "bg-rose-500/25 text-rose-100 border-rose-400/50",
  };
}

// --- Small UI bits ---
function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 shadow-sm shadow-slate-900/60">
      <div className="mb-1 text-xs uppercase tracking-[0.16em] text-slate-400">
        {title}
      </div>
      <div className="text-sm text-slate-100">{text}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
      {children}
    </span>
  );
}

// --- Page ---
export default function HomePage() {
  // In the real app these come from your API (Supabase/Edge Function).
  const [sleep, setSleep] = useState<SleepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [wearableHealthy, setWearableHealthy] = useState(true); // flips to false if token refresh fails
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>("active");
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null);

  // Fake fetch to simulate live data (replace with real fetch)
  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      try {
        // Example: const res = await fetch("/api/me/sleep"); const json = await res.json();
        // Simulate a score/hours
        const score = clamp(Math.round(60 + Math.random() * 35));
        const hours = Math.round((5 + Math.random() * 3.5) * 10) / 10;

        if (!canceled) {
          setSleep({
            score,
            hours,
            source: "Oura", // replace with user.profile.wearable_provider
            updatedAt: Date.now(),
          });

          // Simulate subscription
          // setSubStatus("trialing"); // uncomment to preview trial chip
          // setTrialEndDate("Nov 19, 2025");
        }
      } catch (_) {
        if (!canceled) {
          // If your token refresh fails, flip the banner
          setWearableHealthy(false);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    load();
    return () => {
      canceled = true;
    };
  }, []);

  const plan = useMemo(() => getPlan(sleep), [sleep]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <h1 className="sr-only">Home</h1>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        {/* Optional banners */}
        {!wearableHealthy && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
            We lost connection to your wearable.{" "}
            <button
              className="underline decoration-amber-300/70 underline-offset-2"
              onClick={() => (window.location.href = "/onboarding?reconnect=1")}
            >
              Reconnect now
            </button>
            .
          </div>
        )}

        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Home Base
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-50 md:text-3xl">
              From Within · Morning
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Your rest sets the tone. We read your sleep and weave a tiny
              ritual: stretches, breakfast, drinks, and meditation tuned to your energy.
            </p>
          </div>

          <div className="mt-1 text-right md:mt-0 space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Rest · Rhythm · Ritual
            </p>

            {/* Trial chip (only show when trialing) */}
            {subStatus === "trialing" && (
              <Chip>
                {trialEndDate ? `Trial · Renews ${trialEndDate}` : "Trial · 7 days"}
              </Chip>
            )}
          </div>
        </header>

        {/* Sleep summary */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl shadow-slate-950/70">
          <div className="pointer-events-none absolute -left-16 top-0 h-44 w-44 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative z-10 grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Sleep Score
              </div>
              <div className="mt-1 text-3xl font-semibold">
                {loading ? "…" : sleep ? sleep.score : "—"}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                0–100 snapshot of how your body recovered.
              </p>
            </div>

            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Hours Slept
              </div>
              <div className="mt-1 text-3xl font-semibold">
                {loading ? "…" : sleep ? sleep.hours : "—"}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Not about perfection—just honest data to work with.
              </p>
            </div>

            <div className="text-sm text-slate-300">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Source
              </div>
              <div className="mt-1 text-sm font-medium text-slate-100">
                {loading ? "…" : sleep?.source || "—"}
              </div>
              {sleep?.updatedAt && (
                <div className="mt-1 text-xs text-slate-500">
                  updated {new Date(sleep.updatedAt).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section
          className={`relative overflow-hidden rounded-3xl border p-5 shadow-xl shadow-slate-950/70 ${plan.color}`}
        >
          <div className="pointer-events-none absolute -left-20 top-0 h-44 w-44 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${plan.statusChip}`}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                Status · {plan.label}
              </span>
              <span className="text-xs text-slate-200/80">
                Tiny adjustments today = easier energy tomorrow.
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card title="Affirmation" text={plan.affirmation} />
              <Card title="Morning Stretches" text={plan.stretches} />
              <Card title="Breakfast" text={plan.breakfast} />
              <Card title="Drinks" text={plan.drinks} />
              <Card title="Meditation" text={plan.meditation} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

import React, { useEffect, useMemo, useState } from "react";

// ---- storage keys ----
const WEARABLE_KEY = "gw_wearable";
const SLEEP_KEY = "gw_sleep";

// ---- available wearables ----
const WEARABLES = [
  "Apple Watch (Apple Health)",
  "Fitbit",
  "Oura Ring",
  "WHOOP",
  "Garmin",
  "Samsung Galaxy Watch (Samsung Health)",
  "Google Fit",
  "Polar",
  "Withings",
  "Amazfit",
  "Suunto",
  "Coros",
];

// ---- Types ----
type SleepData = {
  score: number; // 0–100
  hours: number; // e.g. 6.8
  source?: string; // wearable/provider name or "Manual"
  updatedAt: number;
};

// ---- Helpers ----
function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

// ---- Recommendation Logic ----
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
      // dark-theme accent
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

// ---- Small card component ----
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

// ---- Page ----
export default function HomePage() {
  const [wearable, setWearable] = useState<string | null>(null);
  const [showPair, setShowPair] = useState(false);

  const [sleep, setSleep] = useState<SleepData | null>(null);

  // Manual modal
  const [showManual, setShowManual] = useState(false);
  const [manualScore, setManualScore] = useState(70);
  const [manualHours, setManualHours] = useState(7);

  // Load from localStorage
  useEffect(() => {
    try {
      const w = localStorage.getItem(WEARABLE_KEY);
      if (w) setWearable(w);
      const s = localStorage.getItem(SLEEP_KEY);
      if (s) setSleep(JSON.parse(s));
    } catch {
      // ignore
    }
  }, []);

  // Persist
  useEffect(() => {
    if (sleep) localStorage.setItem(SLEEP_KEY, JSON.stringify(sleep));
  }, [sleep]);

  useEffect(() => {
    if (wearable) localStorage.setItem(WEARABLE_KEY, wearable);
  }, [wearable]);

  // Simulated fetch from wearable (until real API is wired)
  const fetchFromWearable = () => {
    const score = clamp(Math.round(60 + Math.random() * 35));
    const hours = Math.round((5 + Math.random() * 3.5) * 10) / 10; // 5–8.5h
    setSleep({
      score,
      hours,
      source: wearable || undefined,
      updatedAt: Date.now(),
    });
  };

  const plan = useMemo(() => getPlan(sleep), [sleep]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <h1 className="sr-only">Home</h1>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Home Base
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-50 md:text-3xl">
              From Within · Morning
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Your rest sets the tone. We read your sleep (or manual check-in)
              and weave a tiny ritual: stretches, breakfast, drinks, and
              meditation tuned to your current energy.
            </p>
          </div>

          <div className="mt-1 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Rest · Rhythm · Ritual
            </p>
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
                {sleep ? sleep.score : "—"}
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
                {sleep ? sleep.hours : "—"}
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
                {sleep?.source || (wearable ? wearable : "Not paired")}
              </div>
              {sleep?.updatedAt && (
                <div className="mt-1 text-xs text-slate-500">
                  updated {new Date(sleep.updatedAt).toLocaleTimeString()}
                </div>
              )}
              {!sleep && (
                <p className="mt-2 text-xs text-slate-400">
                  Pair a wearable or add sleep manually to unlock your full
                  morning plan.
                </p>
              )}
            </div>

            {/* Controls row — emoji button + manual button */}
            <div className="md:col-span-3 mt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (wearable) {
                    fetchFromWearable();
                  } else {
                    setShowPair(true);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/70 bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-fuchsia-500/40 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-400/80 focus:ring-offset-2 focus:ring-offset-slate-950"
                title={wearable ? `Fetch from ${wearable}` : "Pair wearable"}
                aria-label={wearable ? `Fetch from ${wearable}` : "Pair wearable"}
              >
                <span role="img" aria-hidden="true">
                  ⌚️
                </span>
                {wearable ? `Fetch from ${wearable}` : "Pair wearable"}
              </button>

              <button
                onClick={() => setShowManual(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-100 shadow-sm shadow-slate-900/60 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400/80 focus:ring-offset-2 focus:ring-offset-slate-950"
                title="Enter sleep manually"
              >
                <span role="img" aria-hidden="true">
                  ✍️
                </span>
                Add sleep manually
              </button>
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

      {/* Pair wearable modal */}
      {showPair && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowPair(false)}
        >
          <div
            className="w-[min(680px,92vw)] rounded-2xl border border-slate-700 bg-slate-950 p-5 text-slate-100 shadow-2xl shadow-black/70"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">Pair your wearable</div>
              <button
                onClick={() => setShowPair(false)}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <p className="mb-4 text-sm text-slate-300">
              Choose your device or platform. This demo saves your choice
              locally. We can wire real integrations next.
            </p>

            <div className="grid gap-2 md:grid-cols-2">
              {WEARABLES.map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    setWearable(w);
                    setShowPair(false);
                  }}
                  className={`text-left rounded-xl border px-3 py-2 text-sm transition ${
                    wearable === w
                      ? "border-violet-400 bg-slate-900"
                      : "border-slate-700 bg-slate-950 hover:border-violet-400 hover:bg-slate-900"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {wearable && (
              <div className="mt-4 text-sm text-slate-300">
                Paired:{" "}
                <span className="font-medium text-slate-50">{wearable}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual sleep modal */}
      {showManual && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowManual(false)}
        >
          <div
            className="w-[min(520px,92vw)] rounded-2xl border border-slate-700 bg-slate-950 p-5 text-slate-100 shadow-2xl shadow-black/70"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">Add sleep manually</div>
              <button
                onClick={() => setShowManual(false)}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3">
              <label className="text-sm">
                Sleep score (0–100)
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={manualScore}
                  onChange={(e) =>
                    setManualScore(
                      clamp(parseInt(e.target.value || "0", 10))
                    )
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                />
              </label>

              <label className="text-sm">
                Hours slept
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={24}
                  value={manualHours}
                  onChange={(e) =>
                    setManualHours(parseFloat(e.target.value || "0"))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                />
              </label>

              <button
                onClick={() => {
                  setSleep({
                    score: clamp(manualScore),
                    hours: Math.max(0, Math.min(24, manualHours)),
                    source: "Manual",
                    updatedAt: Date.now(),
                  });
                  setShowManual(false);
                }}
                className="mt-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-fuchsia-500/40 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-400/80 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

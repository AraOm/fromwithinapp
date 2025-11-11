// src/pages/welcome.tsx
import React, { use State } from "react";
import { useRouter } from "next/router";

const ONBOARD_KEY = "gw_has_onboarded";

export default function WelcomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"gentle" | "deep" | "track">("gentle");
  const [morningTime, setMorningTime] = useState("07:30");

  const handleBegin = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARD_KEY, "true");
      window.localStorage.setItem("gw_mode", mode);
      window.localStorage.setItem("gw_morning_time", morningTime);
    }
    // ⬇️ CHANGE IS HERE: go to home instead of /morning
    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 pb-16 pt-10 md:pt-16">
        {/* Header */}
        <header className="text-center">
          <div className="text-3xl text-slate-100"></div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-50 md:text-3xl">
            Welcome to From Within
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            A gentle space to track your energy, explore your aura, and build
            tiny rituals that actually fit your life.
          </p>
        </header>

        {/* Card */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/85 p-5 shadow-xl shadow-slate-950/70">
          <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative z-10 space-y-5">
            {/* Q1: How do you want to use this? */}
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                How do you want to use From Within?
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                You can change this anytime. It just tunes how we speak to you.
              </p>

              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => setMode("gentle")}
                  className={`w-full rounded-2xl border px-3 py-2 text-left text-sm transition ${
                    mode === "gentle"
                      ? "border-violet-400 bg-slate-900"
                      : "border-slate-700 bg-slate-950 hover:border-violet-400/70 hover:bg-slate-900/90"
                  }`}
                >
                  <div className="font-medium text-slate-50">
                    Gentle check-ins
                  </div>
                  <div className="text-xs text-slate-400">
                    Light touch: mood logs, small nudges, no overwhelm.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("deep")}
                  className={`w-full rounded-2xl border px-3 py-2 text-left text-sm transition ${
                    mode === "deep"
                      ? "border-violet-400 bg-slate-900"
                      : "border-slate-700 bg-slate-950 hover:border-violet-400/70 hover:bg-slate-900/90"
                  }`}
                >
                  <div className="font-medium text-slate-50">
                    Deep energetic work
                  </div>
                  <div className="text-xs text-slate-400">
                    Aura, chakras, tarot, rituals, and deeper reflections.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("track")}
                  className={`w-full rounded-2xl border px-3 py-2 text-left text-sm transition ${
                    mode === "track"
                      ? "border-violet-400 bg-slate-900"
                      : "border-slate-700 bg-slate-950 hover:border-violet-400/70 hover:bg-slate-900/90"
                  }`}
                >
                  <div className="font-medium text-slate-50">
                    Just tracking my rhythms
                  </div>
                  <div className="text-xs text-slate-400">
                    Sleep, mood, and energy patterns, with minimal “woo”.
                  </div>
                </button>
              </div>
            </div>

            {/* Q2: Morning window */}
            <div className="border-t border-slate-800 pt-4">
              <h2 className="text-sm font-semibold text-slate-50">
                When do you usually start your day?
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                We&apos;ll use this as a reference for a morning ritual reminder
                later on.
              </p>

              <div className="mt-3 flex items-center gap-3">
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="w-28 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                />
                <span className="text-xs text-slate-400">
                  You can change this in settings anytime.
                </span>
              </div>
            </div>

            {/* Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBegin}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-fuchsia-500/40 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-400/80 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Begin From Within
              </button>
            </div>
          </div>
        </section>

        <p className="text-center text-[11px] text-slate-500">
          No pressure, no streaks, no shame. Just small honest check-ins with
          your own energy.
        </p>
      </div>
    </main>
  );
}

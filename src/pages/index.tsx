// src/pages/index.tsx
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { AuthButtons } from "@/components/AuthButtons";

// Local storage keys
const ONBOARD_KEY = "gw_has_onboarded";
const MORNING_SEEN_KEY = "gw_morning_seen_date";

// Morning window (local time)
const MORNING_START_HOUR = 4; // 4 AM
const MORNING_END_HOUR = 11;  // 11 AM (non-inclusive)

export default function HomePage() {
  const router = useRouter();

  const tiles = [
    {
      href: "/morning",
      title: "Morning Ritual",
      description: "Stretches, breath, and nourishment.",
      icon: "☀️",
    },
    {
      href: "/checkin",
      title: "Check-In",
      description: "Log mood, notes, voice.",
      icon: "🜃",
    },
    {
      href: "/mentor",
      title: "Mentor",
      description: "AI companion & guidance.",
      icon: "☪︎",
    },
    {
      href: "/insights",
      title: "Insights",
      description: "Body & energy guidance.",
      icon: "〰️",
    },
    {
      href: "/community",
      title: "Community",
      description: "Share & join events.",
      icon: "ૐ",
    },
    {
      href: "/tarot",
      title: "Tarot",
      description: "Daily pulls & spreads.",
      icon: "🀧",
    },
    {
      href: "/learning",
      title: "Learning",
      description: "Chakras, Reiki, crystals.",
      icon: "𓂀",
    },
    {
      href: "/energy-calendar",
      title: "Energy Calendar",
      description: "Lunar & cosmic rhythms.",
      icon: "𖦹",
    },
    {
      href: "/play",
      title: "Play",
      description: "Quests, grids, fun.",
      icon: "𓀪",
    },
  ];

  // Smart redirect logic: onboarding only (no auto-morning redirect for beta)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasOnboarded = window.localStorage.getItem(ONBOARD_KEY) === "true";

    // 1) New user → Welcome page
    if (!hasOnboarded) {
      router.replace("/welcome");
      return;
    }

    // 2) For beta, DO NOT auto-redirect to /morning.
    // Users will tap the Morning tile themselves from home.
    // (Leaving constants in place so we can re-enable later if we want.)
  }, [router]);

  const handleResetOrientation = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ONBOARD_KEY);
    router.replace("/welcome");
  };

  return (
    // Match Play page: dark cosmic gradient
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-6 md:px-8 md:pt-10">
        {/* Top bar with Auth + trial/subscribe */}
        <div className="mb-4 flex w-full items-center justify-end">
          <AuthButtons />
        </div>

        {/* Main card / phone surface */}
        <div className="w-full max-w-4xl rounded-[32px] border border-slate-800 bg-slate-950/80 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.8)] backdrop-blur md:p-8">
          {/* Logo + title */}
          <div className="flex flex-col items-center gap-1 pb-6">
            {/* Icon above title */}
            <div className="mb-2 flex items-center justify-center">
              <Image
                src="/fw-icon.png" // ✅ Corrected path
                alt="From Within icon"
                width={90}
                height={90}
                className="rounded-2xl shadow-[0_0_50px_0_rgba(236,72,153,0.65)]"
              />
            </div>

            <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
              From Within
            </h1>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
              Your energy companion
            </p>
          </div>

          {/* Aura rectangle with soft glowing vertical oval */}
          <div className="mb-4 w-full">
            {/* outer border gradient */}
            <div className="relative rounded-[2.5rem] bg-[conic-gradient(from_160deg_at_10%_0%,#7dd3fc,#f9a8d4,#a855f7,#7dd3fc)] p-[2px] shadow-[0_30px_80px_rgba(6,0,40,0.9)]">
              {/* inner panel with deep cosmic background */}
              <div className="relative overflow-hidden rounded-[2.3rem] bg-[radial-gradient(circle_at_0%_0%,#1e293b_0%,#020617_70%)]">
                {/* vertical glowing aura oval */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-72 w-40 rounded-full bg-[radial-gradient(circle_at_center,#ffe082_0%,#fb8ac0_30%,#7dd3fc_65%,transparent_100%)] opacity-95 blur-[36px] sm:h-80 sm:w-52" />
                </div>

                {/* text over aura */}
                <p className="relative z-10 px-6 py-10 text-center text-sm font-medium text-slate-50 md:px-10 md:py-14 md:text-lg">
                  Your home base. Choose the path you&apos;d like to explore.
                </p>
              </div>
            </div>
          </div>

          {/* Orientation controls */}
          <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            {/* New here link */}
            <Link
              href="/welcome"
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/70 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-100 shadow-sm shadow-sky-500/30 hover:bg-sky-500/20 hover:text-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span className="uppercase tracking-[0.18em] text-[10px] text-sky-200">
                New here
              </span>
              <span>Start with a gentle orientation →</span>
            </Link>

            {/* Reset orientation button */}
            <button
              type="button"
              onClick={handleResetOrientation}
              className="text-[11px] text-slate-200 underline-offset-4 hover:text-slate-50 hover:underline"
            >
              Reset orientation (clear my intro answers)
            </button>
          </div>

          {/* Tiles grid */}
          <section className="grid gap-4 sm:grid-cols-2">
            {tiles.map(({ href, title, description, icon }) => (
              <Link
                key={href}
                href={href}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-left shadow-md shadow-slate-950/60 transition hover:-translate-y-[2px] hover:border-violet-500/60 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {/* soft background glow */}
                <div className="pointer-events-none absolute -left-10 top-0 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-6 bottom-0 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />

                <div className="relative z-10 mb-3 flex items-start gap-3">
                  {/* icon bubble */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 text-base shadow-lg shadow-fuchsia-500/40">
                    <span className="leading-none text-slate-950">{icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-50">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-300">
                      {description}
                    </p>
                  </div>
                </div>

                <span className="relative z-10 text-xs font-medium text-sky-200 group-hover:text-sky-100">
                  Open →
                </span>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

// src/pages/studio/index.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Wand2, BookOpen, Gem } from "lucide-react";

type StudioTileProps = {
  href: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
};

function StudioTile({
  href,
  title,
  subtitle,
  badge,
  icon,
}: StudioTileProps) {
  return (
    <Link
      href={href}
      className={`
        group relative overflow-hidden
        rounded-3xl border border-slate-800 bg-slate-950/80
        px-5 py-5 md:px-6 md:py-6
        shadow-[0_24px_80px_rgba(0,0,0,0.9)]
        transition
        hover:-translate-y-[2px]
        hover:border-violet-400/70
        hover:bg-slate-900/90
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-violet-400/70
        focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
      `}
    >
      {/* background glows */}
      <div className="pointer-events-none absolute -left-14 top-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-fuchsia-500/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950">
              {icon}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-50 md:text-base">
              {title}
            </h2>
            <p className="mt-1 text-xs text-slate-300 md:text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {badge}
          </span>
          <span className="font-medium text-sky-200 group-hover:text-sky-100">
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function StudioHubPage() {
  const tiles: StudioTileProps[] = [
    {
      href: "/play",
      title: "Playground",
      subtitle:
        "Aura simulations, crystal identification, virtual grids, and sacred quests.",
      badge: "Experimental magic & rituals",
      icon: <Sparkles className="h-5 w-5 text-slate-50" />,
    },
    {
      href: "/learning",
      title: "Learn & Remember",
      subtitle:
        "Bite-sized lessons on chakras, Reiki, meditation, astrology, and crystals.",
      badge: "Guided lessons & reference",
      icon: (
        <div className="flex items-center gap-1">
          <BookOpen className="h-4 w-4 text-slate-50" />
          <Gem className="h-4 w-4 text-sky-100" />
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Studio
            </p>
            <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
              Studio
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Your experimental lab for aura imagery, crystal magic, sacred
              quests, and glowing lessons. Come here to play, explore, and
              deepen your practice.
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Play · Learn · Create
            </p>
          </div>
        </header>

        {/* Tiles */}
        <section className="grid gap-4 md:grid-cols-2">
          {tiles.map((tile) => (
            <StudioTile key={tile.href} {...tile} />
          ))}
        </section>
      </div>
    </main>
  );
}

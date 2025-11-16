// src/pages/guide/index.tsx
"use client";

import Link from "next/link";
import React from "react";

type GuideTileProps = {
  href: string;
  title: string;
  subtitle: string;
  emoji: string;
};

function GuideTile({ href, title, subtitle, emoji }: GuideTileProps) {
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
      {/* soft background glows */}
      <div className="pointer-events-none absolute -left-10 top-0 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 flex items-start gap-3">
        {/* icon bubble */}
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 shadow-lg shadow-fuchsia-500/40">
          <span className="text-xl leading-none text-slate-950">{emoji}</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-50 md:text-base">
            {title}
          </h2>
          <p className="mt-1 text-xs text-slate-300 md:text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="relative z-10 mt-4 text-xs font-medium text-sky-200 group-hover:text-sky-100">
        Open →
      </div>
    </Link>
  );
}

export default function GuideHubPage() {
  const tiles: GuideTileProps[] = [
    {
      href: "/mentor",
      title: "Mentor",
      subtitle: "Chat with your spiritual guide for grounding and clarity.",
      emoji: "☪︎",
    },
    {
      href: "/tarot",
      title: "Tarot",
      subtitle: "Draw cards, explore spreads, and mirror your inner world.",
      emoji: "🀧",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 md:px-8">
        {/* Header */}
        <header className="mb-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
            Guidance
          </p>
          <h1 className="mt-1 text-3xl font-semibold md:text-4xl text-slate-50">
            Guide
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-300">
            One sanctuary for your From Within mentor and tarot. Ask questions,
            receive reflections, and let your inner coach speak.
          </p>
        </header>

        {/* FROM WITHIN / Spiritual Guide label */}
        <div className="mb-6 text-center">
          <div className="text-[0.7rem] tracking-[0.35em] text-slate-500 uppercase">
            From Within
          </div>
          <div className="mt-1 text-lg font-semibold">
            <span className="bg-gradient-to-r from-fuchsia-300 via-pink-300 to-sky-300 bg-clip-text text-transparent">
              Guidance Portal
            </span>
          </div>
        </div>

        {/* Tiles */}
        <section className="grid gap-4 md:grid-cols-2">
          {tiles.map((tile) => (
            <GuideTile key={tile.href} {...tile} />
          ))}
        </section>
      </div>
    </main>
  );
}

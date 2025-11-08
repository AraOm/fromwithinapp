// src/components/VirtualCrystalGrid.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gem, Sparkles } from "lucide-react";

/* ──────────────────────────────────────────
 * Types
 * ────────────────────────────────────────── */
type LayoutStyle = "seedOfLife" | "starOfDavid" | "merkaba";

type Crystal = {
  id: string;
  name: string;
  keyword: string;
  chakra: string;
  emoji: string;
  image: string; // path to crystal image
};

type GridPosition =
  | "center"
  | "north"
  | "south"
  | "east"
  | "west"
  | "ne"
  | "nw"
  | "se"
  | "sw";

type GridSlot = {
  position: GridPosition;
  crystal: Crystal;
  meaning: string;
};

type GeneratedGrid = {
  dateKey: string;
  intention: string;
  theme: string;
  mantra: string;
  layoutStyle: LayoutStyle;
  slots: GridSlot[];
};

/* ──────────────────────────────────────────
 * Crystal Library
 * ────────────────────────────────────────── */
const CRYSTALS: Crystal[] = [
  {
    id: "amethyst",
    name: "Amethyst",
    keyword: "Calm intuition",
    chakra: "Third Eye",
    emoji: "💜",
    image: "/crystals/amethyst.png",
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    keyword: "Heart softness",
    chakra: "Heart",
    emoji: "💗",
    image: "/crystals/rose-quartz.png",
  },
  {
    id: "clear-quartz",
    name: "Clear Quartz",
    keyword: "Amplify clarity",
    chakra: "Crown",
    emoji: "🤍",
    image: "/crystals/clear-quartz.png",
  },
  {
    id: "citrine",
    name: "Citrine",
    keyword: "Solar abundance",
    chakra: "Solar Plexus",
    emoji: "💛",
    image: "/crystals/citrine.png",
  },
  {
    id: "black-tourmaline",
    name: "Black Tourmaline",
    keyword: "Protection + grounding",
    chakra: "Root",
    emoji: "⬛️",
    image: "/crystals/black-tourmaline.png",
  },
  {
    id: "selenite",
    name: "Selenite",
    keyword: "Auric cleanse",
    chakra: "Crown",
    emoji: "✨",
    image: "/crystals/selenite.png",
  },
  {
    id: "lapis",
    name: "Lapis Lazuli",
    keyword: "Truth voice",
    chakra: "Throat",
    emoji: "💙",
    image: "/crystals/lapis.png",
  },
  {
    id: "carnelian",
    name: "Carnelian",
    keyword: "Creative fire",
    chakra: "Sacral",
    emoji: "🧡",
    image: "/crystals/carnelian.png",
  },
  {
    id: "aventurine",
    name: "Green Aventurine",
    keyword: "Gentle luck",
    chakra: "Heart",
    emoji: "💚",
    image: "/crystals/aventurine.png",
  },
  {
    id: "labradorite",
    name: "Labradorite",
    keyword: "Mystic shield",
    chakra: "Third Eye",
    emoji: "🌌",
    image: "/crystals/labradorite.png",
  },
];

/* ──────────────────────────────────────────
 * Random helpers (AI “choosing”)
 * ────────────────────────────────────────── */

function randomChoice<T>(arr: T[]): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function positionMeaning(position: GridPosition): string {
  switch (position) {
    case "center":
      return "Core intention of your day.";
    case "north":
      return "Higher guidance + spiritual focus.";
    case "south":
      return "Grounding, body, and real-world action.";
    case "east":
      return "New beginnings, inspiration, and ideas.";
    case "west":
      return "Emotions, release, and integration.";
    case "ne":
      return "Future vision + subtle guidance.";
    case "nw":
      return "Ancestors + wisdom behind you.";
    case "se":
      return "Momentum + practical steps.";
    case "sw":
      return "Healing old patterns and stabilizing.";
    default:
      return "Energy placement.";
  }
}

/* ──────────────────────────────────────────
 * Layout metadata + coords
 * ────────────────────────────────────────── */

const layoutMeta: Record<
  LayoutStyle,
  { label: string; subtitle: string }
> = {
  seedOfLife: {
    label: "Seed of Life",
    subtitle: "Central source with 8 surrounding petals of intention.",
  },
  starOfDavid: {
    label: "Star of David",
    subtitle: "Interlocking triangles of above & below, inner & outer.",
  },
  merkaba: {
    label: "Merkaba Light Body",
    subtitle: "Star-tetrahedron pattern for multidimensional travel + protection.",
  },
};

const positionLabel: Record<GridPosition, string> = {
  center: "Center",
  north: "North",
  south: "South",
  east: "East",
  west: "West",
  ne: "NE",
  nw: "NW",
  se: "SE",
  sw: "SW",
};

const layoutCoords: Record<
  LayoutStyle,
  Record<GridPosition, { top: string; left: string }>
> = {
  /* Seed of Life */
  seedOfLife: {
    center: { top: "50%", left: "50%" },
    north: { top: "18%", left: "50%" },
    south: { top: "82%", left: "50%" },
    ne: { top: "33%", left: "76%" },
    se: { top: "67%", left: "76%" },
    sw: { top: "67%", left: "24%" },
    nw: { top: "33%", left: "24%" },
    east: { top: "50%", left: "86%" },
    west: { top: "50%", left: "14%" },
  },

  /* Star of David */
  starOfDavid: {
    center: { top: "50%", left: "50%" },
    north: { top: "12%", left: "50%" },
    south: { top: "88%", left: "50%" },
    ne: { top: "28%", left: "76%" },
    se: { top: "72%", left: "76%" },
    sw: { top: "72%", left: "24%" },
    nw: { top: "28%", left: "24%" },
    east: { top: "50%", left: "78%" },
    west: { top: "50%", left: "22%" },
  },

  /* Merkaba */
  merkaba: {
    center: { top: "50%", left: "50%" },
    north: { top: "18%", left: "50%" },
    south: { top: "82%", left: "50%" },
    ne: { top: "30%", left: "80%" },
    se: { top: "70%", left: "80%" },
    sw: { top: "70%", left: "20%" },
    nw: { top: "30%", left: "20%" },
    east: { top: "50%", left: "86%" },
    west: { top: "50%", left: "14%" },
  },
};

/* ──────────────────────────────────────────
 * Generate grid (fresh each click)
 * ────────────────────────────────────────── */

function generateGrid(): GeneratedGrid {
  const positions: GridPosition[] = [
    "nw",
    "north",
    "ne",
    "west",
    "center",
    "east",
    "sw",
    "south",
    "se",
  ];

  const chosenCrystals = shuffleAndPick(CRYSTALS, positions.length);

  const slots: GridSlot[] = positions.map((position, index) => ({
    position,
    crystal: chosenCrystals[index],
    meaning: positionMeaning(position),
  }));

  const intentionOptions = [
    {
      intention: "Golden Alignment & Courage",
      theme: "Today supports lion-hearted truth, courage, and aligned action.",
      mantra: "I move through the day with brave, golden honesty.",
    },
    {
      intention: "Heart-Led Receiving",
      theme: "The grid opens your field to gentle support, love, and nourishment.",
      mantra: "I am worthy of receiving easeful, heart-centered support.",
    },
    {
      intention: "Psychic Clarity & Protection",
      theme: "Your intuition is amplified while your field stays clear and protected.",
      mantra: "My inner sight is sharp, and my energy is sovereign.",
    },
    {
      intention: "Creative Flow & Joy",
      theme: "The day is ripe for playful creation, movement, and self-expression.",
      mantra: "I let joy and creativity move freely through me.",
    },
  ];

  const chosenTheme = randomChoice(intentionOptions);

  const layoutStyles: LayoutStyle[] = ["seedOfLife", "starOfDavid", "merkaba"];
  const layoutStyle = randomChoice(layoutStyles); // 🔮 AI-style layout choice

  const dateKey = new Date().toISOString().slice(0, 10);

  return {
    dateKey,
    intention: chosenTheme.intention,
    theme: chosenTheme.theme,
    mantra: chosenTheme.mantra,
    layoutStyle,
    slots,
  };
}

/* ──────────────────────────────────────────
 * Component
 * ────────────────────────────────────────── */

const VirtualCrystalGrid: React.FC = () => {
  const [grid, setGrid] = useState<GeneratedGrid | null>(null);

  const handleGenerate = () => {
    const newGrid = generateGrid();
    setGrid(newGrid);
  };

  const getSafeLayoutStyle = (layoutStyle: LayoutStyle | undefined) => {
    if (!layoutStyle) return "seedOfLife" as LayoutStyle;
    if (!(layoutStyle in layoutMeta)) return "seedOfLife" as LayoutStyle;
    return layoutStyle;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-rose-400 to-sky-400 shadow-lg shadow-amber-500/40">
            <Gem className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Virtual Crystal Grid
            </h1>
            <p className="text-sm text-slate-300">
              Tap once for a {" "}
              <span className="font-medium text-amber-300"></span> {" "}
              <span className="font-medium text-amber-300">
                sacred geometry layout
              </span>{" "}
              .
            </p>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:scale-[1.02] hover:shadow-amber-400/40 active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          Generate grid
        </button>

        {/* If no grid yet */}
        {!grid && (
          <p className="text-sm text-slate-400">
            Each tap generates a new{" "}
            <span className="text-amber-200">
               Seed of Life, Star of David, or Merkaba
            </span>{" "}
            layout with 9 crystals in a sacred mandala.
          </p>
        )}

        {/* Grid display */}
        {grid && (
          <div className="space-y-5">
            {(() => {
              const safeLayoutStyle = getSafeLayoutStyle(grid.layoutStyle);
              const layoutInfo = layoutMeta[safeLayoutStyle];

              return (
                <>
                  {/* Intention + layout card */}
                  <div className="rounded-3xl border border-amber-400/30 bg-slate-900/80 p-4 shadow-xl shadow-amber-500/20 backdrop-blur">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="text-xs uppercase tracking-[0.2em] text-amber-300/80">
                          Grid Snapshot
                        </div>
                        <h2 className="text-lg font-semibold text-amber-100">
                          {grid.intention}
                        </h2>
                        <p className="text-sm text-slate-200">{grid.theme}</p>
                        <p className="mt-2 text-xs text-amber-200">
                          Pattern:{" "}
                          <span className="font-semibold">
                            {layoutInfo.label}
                          </span>{" "}
                          — {layoutInfo.subtitle}
                        </p>
                      </div>
                      <div className="text-xs text-right text-slate-400 shrink-0">
                        {grid.dateKey}
                        <br />
                        <span className="text-[11px] text-amber-300/80">
                          AI-chosen sacred layout
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm italic text-amber-100/90">
                      Mantra:{" "}
                      <span className="not-italic">“{grid.mantra}”</span>
                    </p>
                  </div>

                  {/* Sacred geometry mandala */}
                  <div className="mx-auto max-w-md">
                    <div className="relative aspect-square rounded-full border border-amber-300/40 bg-radial from-slate-900 via-slate-950 to-black shadow-[0_0_50px_rgba(251,191,36,0.25)] overflow-hidden">
                      {/* Concentric circles */}
                      <div className="pointer-events-none absolute inset-8 rounded-full border border-amber-200/15" />
                      <div className="pointer-events-none absolute inset-16 rounded-full border border-amber-200/10" />
                      <div className="pointer-events-none absolute inset-24 rounded-full border border-amber-200/5" />

                      {/* Cross lines */}
                      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-amber-200/10 via-amber-200/20 to-amber-200/10" />
                      <div className="pointer-events-none absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-gradient-to-r from-amber-200/10 via-amber-200/20 to-amber-200/10" />

                      {/* Diagonals */}
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-b from-amber-200/10 via-amber-200/20 to-amber-200/10" />
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gradient-to-b from-amber-200/10 via-amber-200/20 to-amber-200/10" />

                      {/* Crystal nodes */}
                      {grid.slots.map((slot) => {
                        const coordsMap =
                          layoutCoords[safeLayoutStyle] ??
                          layoutCoords["seedOfLife"];
                        const coords =
                          coordsMap[slot.position] ??
                          layoutCoords["seedOfLife"][slot.position];

                        return (
                          <div
                            key={slot.position}
                            className="absolute flex flex-col items-center text-center"
                            style={{
                              top: coords.top,
                              left: coords.left,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {/* Crystal image in a glowing orb */}
                            <div className="relative mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/80 shadow-[0_0_20px_rgba(251,191,36,0.35)] border border-amber-200/40 overflow-hidden">
                              <Image
                                src={slot.crystal.image}
                                alt={slot.crystal.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                              <div className="pointer-events-none absolute inset-0 rounded-full bg-radial from-transparent via-transparent to-amber-200/20" />
                              {/* Emoji fallback */}
                              <span className="relative z-10 text-2xl mix-blend-screen">
                                {slot.crystal.emoji}
                              </span>
                            </div>

                            {/* Labels */}
                            <div className="rounded-full bg-slate-950/70 px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] text-amber-200/80 backdrop-blur">
                              {positionLabel[slot.position]}
                            </div>
                            <div className="mt-0.5 text-xs font-semibold text-slate-50">
                              {slot.crystal.name}
                            </div>
                            <div className="mt-0.5 max-w-[7rem] text-[11px] text-slate-300/90">
                              {slot.crystal.keyword}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-xs text-center text-slate-400">
                      Visualize yourself sitting at the{" "}
                      <span className="text-amber-200">center stone</span>.
                      Inhale for 4, hold for 4, exhale for 6. Feel the chosen{" "}
                      <span className="text-amber-200">
                        {layoutInfo.label}
                      </span>{" "}
                      pattern spinning gently around your field like a living
                      light ship.
                    </p>
                  </div>
                </>
              );
            })()}

            {/* Legend / how-to */}
            <div className="mt-4 grid gap-3 rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-200 md:grid-cols-2">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300/80">
                  How to work with this grid
                </h3>
                <ul className="mt-1 space-y-1.5">
                  <li>• Screenshot the grid you like.</li>
                  <li>• Recreate it physically if you have similar stones.</li>
                  <li>
                    • Sit in the middle of your layout and repeat the mantra
                    3–9 times.
                  </li>
                  <li>
                    • Notice which geometry calls you: petals, points, or
                    diagonals.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300/80">
                  Future evolution
                </h3>
                <p className="mt-1">
                  Later we can let{" "}
                  <span className="font-medium">
                    your chakra logs, aura, and HRV
                  </span>{" "}
                  influence which geometry the AI chooses.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualCrystalGrid;

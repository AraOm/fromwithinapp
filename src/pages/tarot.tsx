"use client";

import React, { useEffect, useMemo, useState } from "react";
import { buildFullDeck, type TarotCard } from "@/lib/tarotDeck";

/* ──────────────────────────────────────────────────────────────
   Shared glow button (matches Play page style)
   ────────────────────────────────────────────────────────────── */

type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  size?: "sm" | "md";
};

function GlowButton({
  active = true,
  size = "md",
  className = "",
  children,
  ...props
}: GlowButtonProps) {
  const padding =
    size === "sm"
      ? "px-3 py-1.5 text-xs md:text-sm"
      : "px-4 py-2 text-sm md:text-base";

  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center
        rounded-full bg-gradient-to-br
        from-fuchsia-400 via-violet-400 to-sky-400
        p-[2px] shadow-lg shadow-violet-500/30
        transition
        hover:shadow-[0_0_35px_rgba(129,140,248,0.8)]
        ${!active || props.disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      <span
        className={`
          flex w-full items-center justify-center
          rounded-full bg-slate-950
          ${padding}
          font-medium text-slate-50
        `}
      >
        {children}
      </span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────
   Types, data, helpers
   ────────────────────────────────────────────────────────────── */

type SpreadKey = "single" | "three" | "celtic";

type DrawnCard = TarotCard & {
  id: string;
  reversed: boolean;
  position?: string;
};

const SPREADS: Record<
  SpreadKey,
  { label: string; positions: string[]; maxCards: number }
> = {
  single: {
    label: "Single Card",
    positions: ["Message of the Moment"],
    maxCards: 1,
  },
  three: {
    label: "3-Card (Past / Present / Future)",
    positions: ["Past", "Present", "Future"],
    maxCards: 3,
  },
  celtic: {
    label: "Celtic Cross (10)",
    positions: [
      "1 • Significator",
      "2 • Crossing",
      "3 • Foundation",
      "4 • Recent Past",
      "5 • Crowning",
      "6 • Near Future",
      "7 • Self / Attitude",
      "8 • Environment",
      "9 • Hopes & Fears",
      "10 • Outcome",
    ],
    maxCards: 10,
  },
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function shuffle<T>(arr: T[], passes = 2): T[] {
  const a = [...arr];
  for (let p = 0; p < passes; p++) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
  return a;
}

// Suit/arcana tints
const SUIT_TINT: Record<string, string> = {
  Major: "border-fuchsia-400/70 shadow-[0_0_40px_rgba(217,70,239,0.4)]",
  Wands: "border-amber-400/70 shadow-[0_0_32px_rgba(251,191,36,0.35)]",
  Cups: "border-sky-400/70 shadow-[0_0_32px_rgba(56,189,248,0.35)]",
  Swords: "border-indigo-400/70 shadow-[0_0_32px_rgba(129,140,248,0.35)]",
  Pentacles: "border-emerald-400/70 shadow-[0_0_32px_rgba(52,211,153,0.35)]",
};
function tintFor(card: TarotCard) {
  return card.arcana === "Major"
    ? SUIT_TINT.Major
    : SUIT_TINT[card.suit || "Swords"] ?? "border-slate-600";
}

function dayWalkthrough(firstCard?: DrawnCard, q?: string) {
  const theme = firstCard?.name.split(" ")[0];
  const qLine = q?.trim()
    ? `Anchor to your question “<em>${q.trim()}</em>”.`
    : "Hold a simple intention as you move.";
  return [
    theme
      ? `1) Open with the theme of <strong>${theme}</strong> — notice where it appears today.`
      : "1) Take three slow breaths to center.",
    `2) ${qLine}`,
    "3) Mid-day: pause for 60 seconds and realign to your intention.",
    "4) Evening: write one lesson and one gratitude.",
  ];
}

/* ──────────────────────────────────────────────────────────────
   OVERALL READING
   ────────────────────────────────────────────────────────────── */

function concise(text?: string, max = 180): string {
  if (!text) return "";
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function summarizeTheme(cards: DrawnCard[]) {
  const counts = {
    Wands: 0,
    Cups: 0,
    Swords: 0,
    Pentacles: 0,
    Major: 0,
    Minor: 0,
    reversed: 0,
  };
  for (const c of cards) {
    if (c.arcana === "Major") counts.Major++;
    else counts.Minor++;
    if (c.suit && counts.hasOwnProperty(c.suit)) (counts as any)[c.suit]++;
    if (c.reversed) counts.reversed++;
  }

  const suitEntries: [string, number][] = [
    ["Wands", counts.Wands],
    ["Cups", counts.Cups],
    ["Swords", counts.Swords],
    ["Pentacles", counts.Pentacles],
  ];
  const dominantSuit = [...suitEntries].sort((a, b) => b[1] - a[1])[0]?.[0] as
    | "Wands"
    | "Cups"
    | "Swords"
    | "Pentacles"
    | undefined;

  let suitLine = "";
  if (dominantSuit === "Wands")
    suitLine = "Action and momentum want to move this forward.";
  if (dominantSuit === "Cups")
    suitLine = "Emotions, relationships, and intuition are central.";
  if (dominantSuit === "Swords")
    suitLine = "Mindset, clarity, and communication are key.";
  if (dominantSuit === "Pentacles")
    suitLine = "Practical steps, health, and resources lead the way.";

  const majorWeight =
    counts.Major > Math.max(1, Math.floor(cards.length * 0.4))
      ? "Major Arcana dominate—this is a meaningful, fate-tinged moment."
      : "";

  const revRatio = counts.reversed / Math.max(1, cards.length);
  const reversalLine =
    revRatio >= 0.5
      ? "There’s inner resistance to release, but adjustment brings the breakthrough."
      : revRatio > 0
      ? "A few reversals point to course-corrections—small tweaks go far."
      : "";

  return { majorWeight, suitLine, reversalLine };
}

function extractKeyPositions(cards: DrawnCard[]) {
  const byPos = (needle: string) =>
    cards.find((c) => c.position?.toLowerCase().includes(needle));

  const present = byPos("present") || byPos("significator") || byPos("1");
  const challenge =
    byPos("challenge") || byPos("crossing") || byPos("2") || byPos("past");
  const advice = byPos("advice") || byPos("self") || byPos("attitude");
  const outcome = byPos("outcome") || byPos("final") || byPos("future");

  return { present, challenge, advice, outcome };
}

function buildOverallReading(cards: DrawnCard[], question?: string): string {
  if (!cards || !cards.length) return "";

  const { majorWeight, suitLine, reversalLine } = summarizeTheme(cards);
  const { present, challenge, advice, outcome } = extractKeyPositions(cards);

  const anchor = present || cards[0];
  const tension = challenge || cards[1] || cards[0];
  const guidance = advice || cards[2] || cards[0];
  const result = outcome || cards[cards.length - 1];

  const anchorMeaning = concise(
    anchor?.reversed ? anchor?.meaningReversed : anchor?.meaningUpright
  );
  const challengeMeaning = concise(
    tension?.reversed ? tension?.meaningReversed : tension?.meaningUpright
  );
  const adviceMeaning = concise(
    guidance?.reversed ? guidance?.meaningReversed : guidance?.meaningUpright
  );
  const outcomeMeaning = concise(
    result?.reversed ? result?.meaningReversed : result?.meaningUpright
  );

  const qLine = question?.trim() ? `Question: ${question.trim()}. ` : "";

  const parts = [
    qLine +
      (majorWeight ||
        suitLine ||
        "This spread highlights a clear thread through your situation."),
    anchorMeaning
      ? `At the core (${anchor?.name}): ${anchorMeaning}`
      : undefined,
    challengeMeaning
      ? `Primary tension (${tension?.name}): ${challengeMeaning}`
      : undefined,
    adviceMeaning
      ? `Guidance (${guidance?.name}): ${adviceMeaning}`
      : undefined,
    outcomeMeaning
      ? `Likely outcome (${result?.name}): ${outcomeMeaning}`
      : undefined,
    reversalLine || undefined,
  ].filter(Boolean) as string[];

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function OverallReading({
  cards,
  question,
}: {
  cards: DrawnCard[];
  question?: string;
}) {
  const summary = buildOverallReading(cards, question);
  if (!summary) return null;

  return (
    <section
      aria-label="Overall Reading"
      className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.85)]"
    >
      <h3 className="mb-2 text-base font-semibold text-slate-50">
        Overall Reading
      </h3>
      <p className="text-sm leading-relaxed text-slate-200">{summary}</p>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Compact Card Face
   ────────────────────────────────────────────────────────────── */

function CardFace({ card }: { card: DrawnCard }) {
  const tint = tintFor(card);
  return (
    <div
      className={`aspect-[3/5] w-[110px] sm:w-[130px] md:w-[150px] max-w-[150px]
                  rounded-2xl border bg-slate-950/70 backdrop-blur
                  flex items-center justify-center text-center text-sm font-medium text-slate-100
                  ${tint}`}
      style={{ transform: card.reversed ? "rotate(180deg)" : "none" }}
    >
      <span className="px-2">
        {card.name}
        <br />
        <span className="text-[11px] text-slate-400">
          {card.arcana}
          {card.suit ? ` • ${card.suit}` : ""}
        </span>
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Celtic Cross
   ────────────────────────────────────────────────────────────── */

function CelticCross({ cards }: { cards: DrawnCard[] }) {
  if (cards.length < 10) return null;

  return (
    <div className="w-full">
      {/* Small screens: stacked list */}
      <div className="space-y-3 md:hidden">
        {cards.map((c) => (
          <div
            key={c.id}
            className="rounded-3xl border border-slate-800 bg-slate-950/80 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.85)]"
          >
            <div className="mb-1 text-sm font-semibold text-slate-50">
              {c.position}
            </div>
            <div className="flex items-center gap-3">
              <CardFace card={c} />
              <div>
                <p className="text-sm text-slate-200">
                  {c.reversed ? c.meaningReversed : c.meaningUpright}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* md+ : absolute slots */}
      <div className="hidden md:block">
        <div
          className="relative mx-auto"
          style={
            {
              ["--cw" as any]: "150px",
              ["--ch" as any]: "240px",
              ["--gap" as any]: "16px",
              width: "calc(var(--cw) * 5 + var(--gap) * 4)",
              height: "calc(var(--ch) * 4 + var(--gap) * 3)",
            } as React.CSSProperties
          }
        >
          {/* 1 + 2 (crossing) */}
          <Slot style={{ left: calcCol(3), top: calcRow(2) }}>
            <Labeled label={cards[0].position!}>
              <CardFace card={cards[0]} />
            </Labeled>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) rotate(90deg)",
                zIndex: 10,
              }}
            >
              <Labeled label={cards[1].position!} rotateLabel>
                <CardFace card={cards[1]} />
              </Labeled>
            </div>
          </Slot>

          {/* 5 Crowning */}
          <Slot style={{ left: calcCol(3), top: calcRow(1) }}>
            <Labeled label={cards[4].position!}>
              <CardFace card={cards[4]} />
            </Labeled>
          </Slot>

          {/* 3 Foundation */}
          <Slot style={{ left: calcCol(3), top: calcRow(3) }}>
            <Labeled label={cards[2].position!}>
              <CardFace card={cards[2]} />
            </Labeled>
          </Slot>

          {/* 4 Recent Past */}
          <Slot style={{ left: calcCol(2), top: calcRow(2) }}>
            <Labeled label={cards[3].position!}>
              <CardFace card={cards[3]} />
            </Labeled>
          </Slot>

          {/* 6 Near Future */}
          <Slot style={{ left: calcCol(4), top: calcRow(2) }}>
            <Labeled label={cards[5].position!}>
              <CardFace card={cards[5]} />
            </Labeled>
          </Slot>

          {/* Staff 7–10 */}
          <Slot style={{ left: calcCol(5), top: calcRow(1) }}>
            <Labeled label={cards[6].position!}>
              <CardFace card={cards[6]} />
            </Labeled>
          </Slot>
          <Slot style={{ left: calcCol(5), top: calcRow(2) }}>
            <Labeled label={cards[7].position!}>
              <CardFace card={cards[7]} />
            </Labeled>
          </Slot>
          <Slot style={{ left: calcCol(5), top: calcRow(3) }}>
            <Labeled label={cards[8].position!}>
              <CardFace card={cards[8]} />
            </Labeled>
          </Slot>
          <Slot style={{ left: calcCol(5), top: calcRow(4) }}>
            <Labeled label={cards[9].position!}>
              <CardFace card={cards[9]} />
            </Labeled>
          </Slot>
        </div>
      </div>
    </div>
  );
}

// helpers for positions
function calcCol(col: number) {
  return `calc((var(--cw) + var(--gap)) * ${col - 1})`;
}
function calcRow(row: number) {
  return `calc((var(--ch) + var(--gap)) * ${row - 1})`;
}
function Slot({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: "var(--cw)",
        height: "var(--ch)",
        ...style,
      }}
      className="flex items-center justify-center"
    >
      <div className="relative flex h-[var(--ch)] w-[var(--cw)] items-center justify-center">
        {children}
      </div>
    </div>
  );
}
function Labeled({
  label,
  rotateLabel = false,
  children,
}: {
  label: string;
  rotateLabel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <div
        className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-slate-300 ${
          rotateLabel ? "-rotate-90 origin-center" : ""
        }`}
      >
        {label}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */

export default function TarotPage() {
  const fullDeck = useMemo(() => buildFullDeck(), []);
  const [spreadKey, setSpreadKey] = useState<SpreadKey | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    setDrawn([]);
  }, [spreadKey]);

  const canDraw = !!spreadKey && !isShuffling;

  async function handleDraw() {
    if (!spreadKey) return;
    const def = SPREADS[spreadKey];
    setIsShuffling(true);
    await new Promise((r) => setTimeout(r, 1600));
    const sample = shuffle(fullDeck, 3).slice(0, def.maxCards);
    const withMeta: DrawnCard[] = sample.map((c, i) => ({
      ...c,
      id: uid(),
      reversed: Math.random() < 0.5,
      position: def.positions[i],
    }));
    setDrawn(withMeta);
    setIsShuffling(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 md:px-8">
        {/* Hero header */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Divination
            </p>
            <h1 className="mt-1 text-3xl font-semibold md:text-4xl text-slate-50">
              Tarot
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-300">
              Ask a question, choose a spread, and receive intuitive guidance.
              Tarot is a mirror for your inner world—not a fixed prediction.
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="uppercase tracking-[0.25em]">From Within</p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Cards · Spreads · Guidance
            </p>
          </div>
        </header>

        {/* Spread selector + Question + Draw */}
        <section className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(SPREADS) as SpreadKey[]).map((k) => {
              const active = spreadKey === k;
              return (
                <GlowButton
                  key={k}
                  type="button"
                  size="sm"
                  active={active}
                  onClick={() => setSpreadKey(k)}
                >
                  {SPREADS[k].label}
                </GlowButton>
              );
            })}
          </div>

          <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-end">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Optional question / focus"
              className="w-full rounded-full border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 md:w-80"
            />
            <GlowButton
              type="button"
              onClick={handleDraw}
              disabled={!canDraw}
              active={canDraw}
            >
              {isShuffling ? "Shuffling…" : "Draw"}
            </GlowButton>
          </div>
        </section>

        {/* CARDS AREA */}
        <section className="mb-6">
          {drawn.length === 0 ? (
            <div
              className={`grid h-32 place-items-center rounded-3xl border border-slate-800 bg-slate-950/80 text-sm text-slate-400 shadow-[0_20px_70px_rgba(0,0,0,0.85)] ${
                isShuffling ? "animate-pulse" : ""
              }`}
            >
              {spreadKey ? "Ready to draw…" : "Choose a spread to begin"}
            </div>
          ) : spreadKey === "celtic" ? (
            <>
              <CelticCross cards={drawn} />
              <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
                <h3 className="mb-2 text-base font-semibold text-slate-50">
                  Meanings
                </h3>
                <ol className="space-y-2 text-sm">
                  {drawn.map((c) => (
                    <li key={c.id}>
                      <strong>{c.position}:</strong>{" "}
                      <span className="text-slate-200">
                        {c.reversed ? c.meaningReversed : c.meaningUpright}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div
              className={`grid justify-center gap-4 ${
                spreadKey === "three"
                  ? "grid-cols-3 max-md:grid-cols-1"
                  : "grid-cols-1"
              }`}
            >
              {drawn.map((card) => (
                <article
                  key={card.id}
                  className="flex flex-col items-center rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 shadow-[0_22px_80px_rgba(0,0,0,0.9)]"
                >
                  <div className="mb-2 flex w-full items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-50">
                      {card.position ?? "Card"}
                    </h3>
                    <span className="text-[0.7rem] text-slate-400">
                      {card.reversed ? "Reversed" : "Upright"}
                    </span>
                  </div>
                  <CardFace card={card} />
                  <div className="mt-3 space-y-1 text-center">
                    <h4 className="text-sm font-semibold text-slate-50">
                      Meaning
                    </h4>
                    <p className="text-sm text-slate-200">
                      {card.reversed
                        ? card.meaningReversed
                        : card.meaningUpright}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Overall Reading */}
        {drawn.length > 0 && (
          <OverallReading cards={drawn} question={question} />
        )}

        {/* Divider */}
        <div className="my-6 h-6 rounded-full border border-slate-800 bg-gradient-to-r from-violet-500/20 via-sky-500/15 to-fuchsia-500/20" />

        {/* Guidance + Walkthrough */}
        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
            <h3 className="mb-2 text-base font-semibold text-slate-50">
              Guidance
            </h3>
            {drawn.length === 0 ? (
              <p className="text-sm text-slate-300">
                Draw cards to see focused guidance for today.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {question?.trim() && (
                  <li className="text-indigo-200">
                    <strong>Question:</strong> <em>{question.trim()}</em>
                  </li>
                )}
                {drawn.slice(0, 3).map((c) => (
                  <li key={c.id}>
                    <strong>{c.position ?? c.name}:</strong>{" "}
                    <span className="text-slate-200">
                      {(c.reversed
                        ? c.guidanceReversed
                        : c.guidanceUpright) ??
                        (c.reversed
                          ? "Notice resistance; soften your stance."
                          : "Lean into the opening that’s appearing.")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
            <h3 className="mb-2 text-base font-semibold text-slate-50">
              Walk through your day
            </h3>
            <ol className="list-inside list-decimal space-y-2 text-sm text-slate-200">
              {dayWalkthrough(drawn[0], question).map((line, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}

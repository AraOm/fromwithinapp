"use client";

import React from "react";
import Link from "next/link";
import { learningCatalog, type Category, type Lesson } from "@/learn";
import {
  Sparkles,
  BookOpen,
  Brain,
  Stars,
  Gem,
  ArrowRight,
} from "lucide-react";

// ──────────────────────────────────────────────────────────────
// Shared Glow Button
// ──────────────────────────────────────────────────────────────
type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

function GlowButton({ className = "", children, ...props }: GlowButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/40 transition hover:shadow-sky-500/50 hover:brightness-110 ${className}`}
    >
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────
// Category Meta
// ──────────────────────────────────────────────────────────────
const categoryMeta: Record<
  string,
  {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    blurA: string;
    blurB: string;
    ringGradient: string;
  }
> = {
  chakras: {
    icon: Sparkles,
    blurA: "bg-fuchsia-500/10",
    blurB: "bg-sky-500/10",
    ringGradient: "from-fuchsia-400 via-violet-400 to-sky-400",
  },
  reiki: {
    icon: Gem,
    blurA: "bg-rose-500/10",
    blurB: "bg-emerald-500/10",
    ringGradient: "from-rose-300 via-amber-300 to-violet-400",
  },
  meditation: {
    icon: Brain,
    blurA: "bg-emerald-500/10",
    blurB: "bg-sky-500/10",
    ringGradient: "from-emerald-300 via-sky-300 to-cyan-300",
  },
  astrology: {
    icon: Stars,
    blurA: "bg-indigo-500/10",
    blurB: "bg-violet-500/10",
    ringGradient: "from-indigo-300 via-violet-300 to-fuchsia-300",
  },
  crystals: {
    icon: Gem,
    blurA: "bg-amber-500/10",
    blurB: "bg-sky-500/10",
    ringGradient: "from-amber-300 via-fuchsia-300 to-sky-300",
  },
};

// ──────────────────────────────────────────────────────────────
// Page Component
// ──────────────────────────────────────────────────────────────
export default function LearningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Learning
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Learn & Remember
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Bite-sized lessons on chakras, Reiki, meditation, astrology, and
              crystals — glowing portals into deeper understanding.
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Chakras · Reiki · Meditation · Stars · Crystals
            </p>
          </div>
        </header>

        {/* Category Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {learningCatalog.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Category Card
// ──────────────────────────────────────────────────────────────
function CategoryCard({ category }: { category: Category }) {
  const meta = categoryMeta[category.slug] ?? categoryMeta["chakras"];
  const Icon = meta.icon;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90">
      {/* Blurred glows */}
      <div
        className={`pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full ${meta.blurA} blur-3xl`}
      />
      <div
        className={`pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full ${meta.blurB} blur-3xl`}
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`rounded-full bg-gradient-to-br ${meta.ringGradient} p-[2px] shadow-lg shadow-violet-500/30`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
              <Icon className="h-5 w-5 text-slate-50" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              {category.title}
            </h2>
            <p className="text-xs text-slate-300">{category.tagline}</p>
          </div>
        </div>

        {/* Lesson List */}
        <div className="mt-2 space-y-2">
          {category.lessons.slice(0, 3).map((lesson) => (
            <LessonRow
              key={lesson.slug}
              categorySlug={category.slug}
              lesson={lesson}
            />
          ))}
        </div>

        {/* Category Open */}
        <div className="mt-3 flex justify-end">
          <Link href={`/learn/${category.slug}`}>
            <GlowButton>
              Open {category.title}
              <ArrowRight className="h-3 w-3" />
            </GlowButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Lesson Row
// ──────────────────────────────────────────────────────────────
function LessonRow({
  categorySlug,
  lesson,
}: {
  categorySlug: string;
  lesson: Lesson;
}) {
  return (
    <div className="flex items-start justify-between gap-2 rounded-2xl bg-slate-900/70 px-3 py-2 text-xs text-slate-200 ring-1 ring-slate-800/80 backdrop-blur-sm">
      <div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-sky-200" />
          <p className="font-medium text-slate-50">{lesson.title}</p>
        </div>
        <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-300">
          {lesson.summary}
        </p>
      </div>

      <Link href={`/learn/${categorySlug}/${lesson.slug}`}>
        <GlowButton className="whitespace-nowrap">
          Open
          <ArrowRight className="h-3 w-3" />
        </GlowButton>
      </Link>
    </div>
  );
}

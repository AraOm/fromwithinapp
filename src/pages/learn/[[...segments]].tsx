// src/pages/learn/[[...segments]].tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  learningCatalog,
  getCategory,
  getLesson,
  type Category,
  type Lesson,
} from "@/learn";
import {
  Sparkles,
  Brain,
  Stars,
  Gem,
  BookOpen,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Shared Glow Button (matches Play page vibe)
   ───────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────
   Category visual meta (colors + icons)
   ───────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────
   Main catch-all page
   ───────────────────────────────────────────── */

export default function LearnPage() {
  const router = useRouter();
  const segmentsParam = router.query.segments;

  let segments: string[] = [];
  if (typeof segmentsParam === "string") {
    segments = [segmentsParam];
  } else if (Array.isArray(segmentsParam)) {
    segments = segmentsParam as string[];
  }

  // /learn  → show category grid
  if (segments.length === 0) {
    return (
      <PageShell
        title="Learn & Remember"
        subtitle="Bite-sized lessons on chakras, Reiki, meditation, astrology, and crystals — glowing portals into deeper understanding."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {learningCatalog.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </PageShell>
    );
  }

  // /learn/[category]
  if (segments.length === 1) {
    const categorySlug = segments[0];
    const category = getCategory(categorySlug);

    if (!category) {
      return (
        <PageShell title="Not found" subtitle="That learning path doesn’t exist (yet).">
          <BackToLearning />
        </PageShell>
      );
    }

    return (
      <PageShell
        title={category.title}
        subtitle={category.tagline}
        showBack
        backHref="/learn"
      >
        <div className="space-y-3">
          {category.lessons.map((lesson) => (
            <LessonRow
              key={lesson.slug}
              categorySlug={category.slug}
              lesson={lesson}
            />
          ))}
        </div>
      </PageShell>
    );
  }

  // /learn/[category]/[lesson]
  const [categorySlug, lessonSlug] = segments;
  const category = categorySlug ? getCategory(categorySlug) : undefined;
  const lesson =
    categorySlug && lessonSlug ? getLesson(categorySlug, lessonSlug) : undefined;

  if (!category || !lesson) {
    return (
      <PageShell title="Not found" subtitle="That lesson isn’t available.">
        <BackToLearning />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={lesson.title}
      subtitle={category.title}
      showBack
      backHref={`/learn/${category.slug}`}
    >
      <article className="prose prose-invert max-w-none text-sm text-slate-100 prose-headings:text-slate-50 prose-strong:text-sky-200 prose-ul:marker:text-sky-300">
        {lesson.content}
      </article>
    </PageShell>
  );
}

/* ─────────────────────────────────────────────
   Shared layout wrapper
   ───────────────────────────────────────────── */

function PageShell({
  title,
  subtitle,
  children,
  showBack,
  backHref,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBack?: boolean;
  backHref?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-20 pt-8 md:px-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            {showBack && backHref && (
              <Link href={backHref} className="mb-2 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
                <ArrowLeft className="h-3 w-3" />
                Back
              </Link>
            )}
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Learning
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-xl text-sm text-slate-300">{subtitle}</p>
            )}
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

        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Components: Category Card + Lesson Row
   ───────────────────────────────────────────── */

function CategoryCard({ category }: { category: Category }) {
  const meta = categoryMeta[category.slug] ?? categoryMeta["chakras"];
  const Icon = meta.icon;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90">
      {/* soft glowing blobs */}
      <div
        className={`pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full ${meta.blurA} blur-3xl`}
      />
      <div
        className={`pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full ${meta.blurB} blur-3xl`}
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
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

        <div className="mt-2 space-y-1.5 text-[11px] text-slate-300">
          {category.lessons.slice(0, 3).map((lesson) => (
            <div key={lesson.slug} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300/80" />
              <span className="line-clamp-1">{lesson.title}</span>
            </div>
          ))}
        </div>

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
        {lesson.durationMin && (
          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-400">
            ~ {lesson.durationMin} min
          </p>
        )}
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

/* ─────────────────────────────────────────────
   Simple "back" helper for error states
   ───────────────────────────────────────────── */

function BackToLearning() {
  return (
    <Link href="/learn">
      <GlowButton>
        <ArrowLeft className="h-3 w-3" />
        Back to Learning
      </GlowButton>
    </Link>
  );
}

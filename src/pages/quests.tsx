// src/pages/quests.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Heart,
  Shield,
  Gem,
  Sparkles,
} from "lucide-react";

/* ──────────────────────────────────────────
 * Types
 * ────────────────────────────────────────── */
type QuestDay = {
  day: number;
  title: string;
  theme: string;
  ritual: string;
  prompt: string;
  affirmation: string;
  minutes?: number;
};

type Quest = {
  id: string;
  title: string;
  durationLabel: string;
  summary: string;
  chakra?: string;
  icon: "root" | "heart";
  days: QuestDay[];
};

/* ──────────────────────────────────────────
 * Data – initial sample Quests
 * ────────────────────────────────────────── */

const rootHealingDays: QuestDay[] = [
  {
    day: 1,
    title: "Arriving in Your Body",
    theme: "Safety in the present moment.",
    ritual:
      "Place both feet on the floor or ground. Press your hands on your thighs. Take 10 slow breaths, feeling the weight of your body supported.",
    prompt:
      "What makes you feel physically safe right now? List 3 things, no matter how small.",
    affirmation: "I am held. I am here. I am safe enough to breathe.",
    minutes: 5,
  },
  {
    day: 2,
    title: "Roots Below You",
    theme: "Connecting to the earth field.",
    ritual:
      "Visualize roots growing from the soles of your feet deep into the earth. With each exhale, send any tension down the roots.",
    prompt:
      "If the Earth could speak to you as a loving guardian, what would she say about your safety and belonging?",
    affirmation: "I am rooted, supported, and connected to something bigger.",
    minutes: 7,
  },
  {
    day: 3,
    title: "Rewriting the Story of Safety",
    theme: "Gently updating old survival narratives.",
    ritual:
      "Place one hand on your lower belly and one on your heart. Name out loud one old survival belief you’re ready to soften.",
    prompt:
      "What is one belief about safety or money that you inherited but no longer fully agree with?",
    affirmation: "I am allowed to update old stories as I grow.",
    minutes: 8,
  },
  {
    day: 4,
    title: "Grounding Through the Senses",
    theme: "Letting the nervous system settle.",
    ritual:
      "Choose one sense (sight, touch, hearing, smell, or taste) and spend 2–3 minutes really focusing only on that sense.",
    prompt:
      "When do your senses feel most alive and soothed at the same time?",
    affirmation: "My senses can be a pathway home to myself.",
    minutes: 6,
  },
  {
    day: 5,
    title: "Safe Support",
    theme: "Letting others help hold you.",
    ritual:
      "Reach out to one safe person (or future guide in your mind) and imagine them standing behind you, hands on your shoulders.",
    prompt:
      "Who feels (or could feel) like a safe anchor in your life? What qualities make them feel safe?",
    affirmation: "I am not meant to carry everything alone.",
    minutes: 8,
  },
  {
    day: 6,
    title: "Body as Temple",
    theme: "Honoring your physical vessel.",
    ritual:
      "Offer your body one small act of care: a stretch, warm tea, gentle massage, or nourishing food. Do it slowly and consciously.",
    prompt:
      "If your body could write you a letter right now, what would it thank you for? What would it ask you to change?",
    affirmation: "My body is worthy of care and kindness.",
    minutes: 10,
  },
  {
    day: 7,
    title: "Claiming Belonging",
    theme: "Anchor a new root-level statement.",
    ritual:
      "Stand or sit tall. Say out loud a simple sentence that begins with: “I belong because…” Repeat it 7 times.",
    prompt:
      "Finish this sentence three different ways: “I belong on this planet because…”",
    affirmation: "I belong here. My existence is valid and needed.",
    minutes: 10,
  },
];

const gratitudeDays: QuestDay[] = Array.from({ length: 21 }, (_, idx) => {
  const day = idx + 1;
  return {
    day,
    title: `Gratitude Day ${day}`,
    theme: "Expanding the heart through simple noticing.",
    ritual:
      "Pause for 2–3 minutes. Place a hand on your heart and remember one small moment from the last 24 hours that you’re grateful for.",
    prompt:
      "Write about one thing you’re grateful for today. Why does it matter to you right now?",
    affirmation: "My heart notices and receives everyday blessings.",
    minutes: 5,
  };
});

const QUESTS: Quest[] = [
  {
    id: "root-healing",
    title: "Root Healing",
    durationLabel: "7 days",
    summary: "Grounding, safety, stability for the Root chakra.",
    chakra: "Root",
    icon: "root",
    days: rootHealingDays,
  },
  {
    id: "gratitude-21",
    title: "Gratitude",
    durationLabel: "21 days",
    summary: "Daily prompts to expand heart and appreciation.",
    chakra: "Heart",
    icon: "heart",
    days: gratitudeDays,
  },
];

/* ──────────────────────────────────────────
 * Component
 * ────────────────────────────────────────── */

const QuestsPage: React.FC = () => {
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);

  const activeQuest = QUESTS.find((q) => q.id === activeQuestId) || null;

  const handleSelectQuest = (questId: string) => {
    setActiveQuestId(questId);
    setActiveDay(1);
  };

  const handleBackToList = () => {
    setActiveQuestId(null);
    setActiveDay(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-0">
        {/* Header – match aura/grid style */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-rose-400 to-sky-400 shadow-lg shadow-amber-500/40">
              <Gem className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Sacred Quests
              </h1>
              <p className="text-xs text-slate-300">
                Guided journeys + micro-rituals, tuned to your inner field.
              </p>
            </div>
          </div>
          <Link
            href="/play"
            className="hidden items-center gap-1 text-xs font-medium text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline sm:inline-flex"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Play
          </Link>
        </header>

        {/* If no quest selected: show list */}
        {!activeQuest && (
          <section className="space-y-4">
            <p className="text-sm text-slate-300">
              Choose a quest to walk with for a few days. Each one is designed
              to be{" "}
              <span className="text-amber-300">
                light, doable, and energetically potent.
              </span>
            </p>

            <div className="space-y-3">
              {QUESTS.map((quest) => (
                <button
                  key={quest.id}
                  onClick={() => handleSelectQuest(quest.id)}
                  className="flex w-full flex-col items-start rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-left shadow-sm shadow-slate-900/60 transition hover:-translate-y-[1px] hover:border-amber-300/60 hover:shadow-amber-500/30"
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-slate-50 shadow-md shadow-slate-950/60">
                        {quest.icon === "root" ? (
                          <Shield className="h-4 w-4 text-amber-300" />
                        ) : (
                          <Heart className="h-4 w-4 text-rose-300" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-50">
                          {quest.title} • {quest.durationLabel}
                        </div>
                        <p className="text-xs text-slate-300">
                          {quest.summary}
                        </p>
                        {quest.chakra && (
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                            Chakra focus: {quest.chakra}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-200">
                      Begin quest
                      <Sparkles className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* If a quest is selected: show detail */}
        {activeQuest && (
          <section className="space-y-5">
            {/* Back to list (mobile + desktop) */}
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              All Sacred Quests
            </button>

            {/* Quest header card */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 px-4 py-4 shadow-xl shadow-slate-950/70">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-slate-50 shadow-md shadow-slate-950/70">
                    {activeQuest.icon === "root" ? (
                      <Shield className="h-5 w-5 text-amber-300" />
                    ) : (
                      <Heart className="h-5 w-5 text-rose-300" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-50">
                      {activeQuest.title} • {activeQuest.durationLabel}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {activeQuest.summary}
                    </p>
                    {activeQuest.chakra && (
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Chakra focus: {activeQuest.chakra}
                      </p>
                    )}
                  </div>
                </div>
                <div className="hidden flex-col items-end text-right text-[11px] text-slate-400 sm:flex">
                  <span>Micro-ritual journey</span>
                  <span className="text-amber-200">
                    {activeQuest.days.length} days
                  </span>
                </div>
              </div>
            </div>

            {/* Day selector / “timeline” */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 shadow-inner shadow-slate-950/80">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-200">
                  Choose a day
                </span>
                <span className="text-[11px] text-slate-400">
                  {activeQuest.days.length}-day journey
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeQuest.days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveDay(day.day)}
                    className={`inline-flex min-w-[2.25rem] items-center justify-center rounded-full border px-2 py-1 text-[11px] font-medium transition ${
                      activeDay === day.day
                        ? "border-amber-300 bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400 text-slate-950 shadow-md shadow-amber-500/40"
                        : "border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-300/60 hover:text-amber-100"
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Active day content */}
            {(() => {
              const day = activeQuest.days.find((d) => d.day === activeDay);
              if (!day) return null;

              return (
                <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-4 shadow-lg shadow-slate-950/70">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-amber-300/80">
                      Day {day.day}
                    </p>
                    <h3 className="text-base font-semibold text-slate-50">
                      {day.title}
                    </h3>
                    <p className="text-xs text-slate-300">{day.theme}</p>
                    {day.minutes && (
                      <p className="text-[11px] text-slate-400">
                        Approx. {day.minutes}-minute micro-ritual
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 text-sm text-slate-100">
                    <div>
                      <h4 className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        <Flame className="h-3 w-3 text-amber-300" />
                        Ritual
                      </h4>
                      <p className="text-sm text-slate-100">{day.ritual}</p>
                    </div>

                    <div>
                      <h4 className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Journal Prompt
                      </h4>
                      <p className="text-sm text-slate-100">{day.prompt}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-900/80 px-3 py-2 border border-slate-700">
                      <h4 className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Affirmation
                      </h4>
                      <p className="text-sm text-amber-100 italic">
                        “{day.affirmation}”
                      </p>
                    </div>
                  </div>

                  {/* Little CTA like on aura/grid pages */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
                    <p className="text-[11px] text-slate-400">
                      After you complete this step, notice how your{" "}
                      <span className="text-amber-200">
                        body, breath, and mood
                      </span>{" "}
                      subtly shift.
                    </p>
                    <button className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400 px-4 py-1.5 text-[11px] font-semibold text-slate-950 shadow-md shadow-amber-500/40 transition hover:scale-[1.02] active:scale-95">
                      <Sparkles className="h-3 w-3" />
                      Mark as done (future)
                    </button>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* Back link to Play (bottom, mobile-friendly) */}
        <div className="pt-4">
          <Link
            href="/play"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Play
          </Link>
        </div>
      </main>
    </div>
  );
};

export default QuestsPage;

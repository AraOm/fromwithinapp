"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  JournalEntry,
  GuidedPrompt,
  DEFAULT_GUIDED_PROMPTS,
  Mood,
  Chakra,
  Emotion,
  BodyArea,
  JournalMedia,
  createEmptyJournalEntry,
} from "@/types/journal";

/* ------- picker choices ------- */
const MOODS: Mood[] = ["✨ uplifted", "🙂 okay", "😐 neutral", "😕 low", "😞 heavy"];
const CHAKRAS: Chakra[] = ["Root", "Sacral", "Solar Plexus", "Heart", "Throat", "Third Eye", "Crown"];
const EMOTIONS: Emotion[] = ["calm", "anxious", "angry", "sad", "grateful", "tired", "excited", "grounded"];
const BODY: BodyArea[] = ["head", "throat", "chest", "solar_plexus", "belly", "hips", "legs", "feet"];

/* ------- UI helpers ------- */
function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1 rounded-full border text-sm transition",
        active ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-gray-500",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ------- Page ------- */
function JournalPage() {
  const [entry, setEntry] = useState<JournalEntry>(() => createEmptyJournalEntry());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEntry((e) => ({
      ...e,
      id:
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      kind: e.kind ?? "journal",
      visibility: e.visibility ?? "private",
      tags: e.tags ?? { chakras: [], emotions: [], body: [], keywords: [] },
      media: e.media ?? [],
    }));
  }, []);

  const selectedPromptId = entry.prompt?.id ?? "";
  const prompts: GuidedPrompt[] = useMemo(() => DEFAULT_GUIDED_PROMPTS, []);

  const toggleArray = <T,>(list: T[] | undefined, value: T): T[] => {
    const arr = list ? [...list] : [];
    const i = arr.findIndex((v) => v === value);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(value);
    return arr;
  };

  function setMood(kind: "before" | "after", mood: Mood) {
    setEntry((e) => ({
      ...e,
      [kind === "before" ? "moodBefore" : "moodAfter"]: mood,
      updatedAt: Date.now(),
    }));
  }

  function toggleChakra(c: Chakra) {
    setEntry((e) => ({
      ...e,
      tags: {
        ...e.tags,
        chakras: toggleArray(e.tags?.chakras, c),
        emotions: e.tags?.emotions ?? [],
        body: e.tags?.body ?? [],
        keywords: e.tags?.keywords ?? [],
      },
      updatedAt: Date.now(),
    }));
  }

  function toggleEmotion(v: Emotion) {
    setEntry((e) => ({
      ...e,
      tags: {
        ...e.tags,
        chakras: e.tags?.chakras ?? [],
        emotions: toggleArray(e.tags?.emotions, v),
        body: e.tags?.body ?? [],
        keywords: e.tags?.keywords ?? [],
      },
      updatedAt: Date.now(),
    }));
  }

  function toggleBody(area: BodyArea) {
    setEntry((e) => ({
      ...e,
      tags: {
        ...e.tags,
        chakras: e.tags?.chakras ?? [],
        emotions: e.tags?.emotions ?? [],
        body: toggleArray(e.tags?.body, area),
        keywords: e.tags?.keywords ?? [],
      },
      updatedAt: Date.now(),
    }));
  }

  async function onAddImage(files: FileList | null) {
    if (!files || !mounted) return;
    const file = files[0];
    if (!file) return;

    const dataUrl = await fileToDataUrl(file);
    const mediaItem: JournalMedia = {
      id:
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind: "image",
      dataUrl,
      storageUrl: undefined,
      caption: file.name,
    };

    setEntry((e) => ({
      ...e,
      media: [...(e.media ?? []), mediaItem],
      updatedAt: Date.now(),
    }));
  }

  function onSelectPrompt(promptId: string) {
    const p = prompts.find((p) => p.id === promptId);
    setEntry((e) => ({
      ...e,
      prompt: p ? { id: p.id, text: p.text, category: p.category } : undefined,
      updatedAt: Date.now(),
    }));
  }

  function onToggleShare() {
    setEntry((e) => ({
      ...e,
      visibility: e.visibility === "community" ? "private" : "community",
      sharedToCommunity: e.visibility !== "community",
      updatedAt: Date.now(),
    }));
  }

  async function onSave() {
    console.log("Saving JournalEntry:", entry);
    alert("Saved locally (console). Connect Supabase insert next.");
  }

  function onVoice() {
    alert("Voice input coming soon — we’ll auto-transcribe and attach audio.");
  }

  if (!mounted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Journal</h1>
        <p className="text-gray-600 mb-6">
          Speak or type your check-in; we’ll save it privately on your device.
        </p>
        <div className="h-64 rounded-2xl border border-gray-200 bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* No page-level brand header here; global header comes from _app.tsx */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Journal</h1>
        <p className="text-gray-600">
          Speak or type your check-in; we’ll save it privately on your device.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 p-4 md:p-6 bg-white shadow-sm">
        {/* Top row: Voice + Save */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={onVoice}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50"
          >
            🎤 Voice
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 rounded-xl bg-black text-white font-medium"
          >
            Save entry
          </button>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-gray-600">Share to Community</label>
            <input
              type="checkbox"
              checked={entry.visibility === "community"}
              onChange={onToggleShare}
              className="h-4 w-4"
            />
          </div>
        </div>

        {/* Prompt selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Guided prompt</label>
          <select
            value={selectedPromptId}
            onChange={(e) => onSelectPrompt(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-white"
          >
            <option value="">— None —</option>
            {prompts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.text}
              </option>
            ))}
          </select>
          {entry.prompt?.text ? (
            <p className="text-sm text-gray-500 mt-1">{entry.prompt.text}</p>
          ) : null}
        </div>

        {/* Text area */}
        <div className="mb-4">
          <textarea
            value={entry.text}
            onChange={(e) =>
              setEntry((en) => ({ ...en, text: e.target.value, updatedAt: Date.now() }))
            }
            placeholder="Talk or type what’s present for you…"
            rows={8}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Mood pickers */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-2">Mood before</div>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip key={`before-${m}`} active={entry.moodBefore === m} onClick={() => setMood("before", m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Mood after</div>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip key={`after-${m}`} active={entry.moodAfter === m} onClick={() => setMood("after", m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Tagging rows */}
        <div className="mb-3">
          <div className="text-sm font-medium mb-2">Chakras</div>
          <div className="flex flex-wrap gap-2">
            {CHAKRAS.map((c) => (
              <Chip key={c} active={entry.tags?.chakras?.includes(c)} onClick={() => toggleChakra(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-sm font-medium mb-2">Emotions</div>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((v) => (
              <Chip key={v} active={entry.tags?.emotions?.includes(v)} onClick={() => toggleEmotion(v)}>
                {v}
              </Chip>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Body areas</div>
          <div className="flex flex-wrap gap-2">
            {BODY.map((b) => (
              <Chip key={b} active={entry.tags?.body?.includes(b)} onClick={() => toggleBody(b)}>
                {b.replace("_", " ")}
              </Chip>
            ))}
          </div>
        </div>

        {/* Media upload */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Attach image</div>
          <input type="file" accept="image/*" onChange={(e) => onAddImage(e.target.files)} />
          {!!entry.media?.length && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {entry.media!.map((m) =>
                m.kind === "image" ? (
                  <figure key={m.id} className="rounded-xl overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.dataUrl ?? m.storageUrl ?? ""}
                      alt={m.caption ?? ""}
                      className="w-full h-28 object-cover"
                    />
                    {m.caption && <figcaption className="text-xs p-1 text-gray-600">{m.caption}</figcaption>}
                  </figure>
                ) : null
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ------- helpers ------- */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

/* Disable SSR to avoid any chance of hydration mismatch on first paint */
export default dynamic(() => Promise.resolve(JournalPage), { ssr: false });

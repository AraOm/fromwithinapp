// src/pages/mentor.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { mentorChat, ChatMsg } from "@/lib/chat";

/* ──────────────────────────────────────────────────────────────
   Shared glow button – “open” ring like Play page
   (multi-color border, softer inner pill, no big glow behind)
   ────────────────────────────────────────────────────────────── */

type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  size?: "sm" | "md";
};

function GlowButton({
  active = true,
  size = "md",
  className = "",
  disabled,
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
      disabled={disabled}
      className={`
        group relative inline-flex items-center justify-center overflow-hidden
        rounded-full
        ${disabled ? "opacity-55 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"}
        transition-transform duration-150
        ${className}
      `}
    >
      {/* Open glow ring (border) */}
      <span
        aria-hidden="true"
        className={`
          absolute inset-0 rounded-full
          bg-[conic-gradient(from_180deg_at_50%_50%,#f97316,#e879f9,#38bdf8,#22c55e,#f97316)]
          ${active ? "opacity-95" : "opacity-70"}
          blur-[1.5px]
        `}
      />

      {/* Inner pill (slightly inset so the ring reads as “open”) */}
      <span
        className={`
          relative z-10 inline-flex items-center justify-center gap-2
          rounded-full ${padding}
          bg-slate-950/90 text-slate-50
          font-medium tracking-wide
        `}
      >
        {children}
      </span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────
   Speech recognition helper
   ────────────────────────────────────────────────────────────── */

function getSR(): any {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

function MentorPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi—what’s on your heart right now?" },
  ]);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const recogRef = useRef<any>(null);
  const [sending, setSending] = useState(false);

  // ---- Speech recognition setup ----
  useEffect(() => {
    const SR = getSR();
    setSupported(!!SR);
    if (!SR) return;

    const r = new SR();
    r.lang = "en-US";
    r.continuous = true;
    r.interimResults = true;

    r.onresult = (e: any) => {
      let finalChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalChunk += transcript + " ";
        } else {
          setInput((prev) => {
            const base = prev.replace(/\s*\[speaking….*\]$/i, "");
            return `${base} [speaking… ${transcript}]`;
          });
        }
      }
      if (finalChunk) {
        setInput((prev) =>
          prev.replace(/\s*\[speaking….*\]$/i, "") + finalChunk
        );
      }
    };

    r.onerror = () => {
      setListening(false);
      try {
        r.stop();
      } catch {}
    };

    r.onend = () => {
      setInput((prev) => prev.replace(/\s*\[speaking….*\]$/i, ""));
      setListening(false);
    };

    recogRef.current = r;
  }, []);

  const toggleMic = () => {
    if (!recogRef.current) return;
    if (listening) {
      try {
        recogRef.current.stop();
      } catch {}
      setListening(false);
    } else {
      try {
        setListening(true);
        recogRef.current.start();
      } catch {
        setListening(false);
      }
    }
  };

  // ---- Send message to backend ----
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim().replace(/\s*\[speaking….*\]$/i, "");
    if (!text) return;

    const userMsg: ChatMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const reply = await mentorChat(next);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Mentor error:", err);
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "⚠️ Something went wrong reaching Mentor.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // Keep label stable across SSR/CSR to avoid hydration drift
  const micLabel = listening ? "Listening…" : "Voice";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#4c1d95_0,_#020617_55%,_#020617_100%)] text-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:px-8">
        {/* Header – styled like Play/Check-In */}
        <header className="mb-6">
          <p className="text-[0.7rem] font-semibold tracking-[0.3em] text-slate-400 uppercase">
            Companion
          </p>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold text-slate-50">
            Mentor
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            A gentle spiritual guide for daily grounding, nervous system care,
            and inner wisdom.
          </p>
        </header>

        {/* FROM WITHIN / Spiritual Mentor – same vibe as Play page */}
        <div className="mb-8 text-center">
          <div className="text-[0.7rem] tracking-[0.35em] text-slate-500 uppercase">
            FROM WITHIN
          </div>
          <div className="mt-1 text-lg font-semibold">
            <span className="bg-gradient-to-r from-fuchsia-300 via-pink-300 to-sky-300 bg-clip-text text-transparent">
              Spiritual Mentor
            </span>
          </div>
        </div>

        {/* Chat card */}
        <section className="rounded-3xl border border-white/6 bg-slate-900/60 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.9)] h-[560px] md:h-[620px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-indigo-500/80 text-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.9)]"
                    : "bg-slate-800/80 border border-slate-700 text-slate-100"
                }`}
              >
                {m.content}
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-sm text-slate-400">
                Say hello or use the mic to speak — I’ll transcribe it for you 🌱
              </p>
            )}
            {sending && (
              <p className="text-sm text-slate-400">Mentor is typing…</p>
            )}
          </div>

          {/* Input row */}
          <form
            onSubmit={sendMessage}
            className="mt-4 flex flex-col gap-3 border-t border-slate-700 pt-3 md:flex-row md:items-center"
          >
            {/* Mic button – open glow ring */}
            <GlowButton
              type="button"
              onClick={toggleMic}
              disabled={supported === false}
              size="sm"
              active={listening}
              title={
                supported === false
                  ? "Voice input not supported in this browser"
                  : listening
                  ? "Stop voice input"
                  : "Start voice input"
              }
            >
              <span className="text-base">🎤</span>
              <span className="whitespace-nowrap">{micLabel}</span>
            </GlowButton>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or use the mic…"
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-400/40"
            />

            {/* Send button – same open glow style */}
            <GlowButton type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send"}
            </GlowButton>
          </form>

          {supported === false && (
            <div className="mt-2 text-[0.7rem] text-slate-500">
              Voice requires Chrome/Edge or Safari (with{" "}
              <code>webkitSpeechRecognition</code>) over HTTPS or localhost.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Force client-only (no SSR hydration issues with mic)
export default dynamic(() => Promise.resolve(MentorPage), { ssr: false });

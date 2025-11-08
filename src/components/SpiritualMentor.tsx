import React, { useState } from "react";

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export default function SpiritualMentor() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "🙏 Welcome, beautiful soul. I’m here with you. How are you feeling today, and what would you like guidance on?"
    }
  ]);
  const [input, setInput] = useState("");
  const [insight, setInsight] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);

    try {
      const r = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      // Handle non-200s explicitly
      if (!r.ok) {
        const body = await r.text().catch(() => "");
        console.warn("mentor api non-200:", r.status, body);
        throw new Error(`API ${r.status}`);
      }

      const data: any = await r.json().catch((e) => {
        console.warn("mentor api bad json:", e);
        throw e;
      });

      const reply: string =
        data?.reply || data?.message || data?.content ||
        "Let’s take six slow breaths together. Inhale 4, hold 4, exhale 6.";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      if (data?.insight) setInsight(data.insight);
      else setInsight("Notice where the breath lands first; soften there.");
    } catch (err) {
      console.error("mentor ui error:", err);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I’m here. Try this now: inhale 4, hold 4, exhale 6 — six rounds. What shifted?"
        }
      ]);
      setInsight("Place a palm on chest or belly; breathe into the spot that calls attention.");
    } finally {
      setSending(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6">
      <h3 className="text-xl font-semibold mb-4">Mentor</h3>

      <div className="space-y-2 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "rounded-lg bg-blue-50 px-3 py-2"
                : "rounded-lg bg-purple-50 px-3 py-2"
            }
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md border px-3 py-2"
          placeholder="Ask your guide something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={sending}
        />
        <button
          onClick={send}
          disabled={sending}
          className="rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {insight && (
        <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm">
          <strong>Insight:</strong> {insight}
        </div>
      )}
    </div>
  );
}

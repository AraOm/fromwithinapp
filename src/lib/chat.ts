// src/lib/chat.ts

export type ChatMsg = { role: "user" | "assistant"; content: string };

// We’re using this Next.js app's own API routes (same origin).
export const API_BASE = "";

// Optional debug log so you can see this when Next boots
console.log("🔮 Mentor API base:", API_BASE || "(same origin)");

/** Conversational Mentor request
 *
 * Front-end can still keep a full chat history (ChatMsg[]),
 * but the backend `/api/mentor` currently expects a single `message` string,
 * so we send just the *last* user message.
 */
export async function mentorChat(messages: ChatMsg[]) {
  // Find the last user message; fall back to the last message in the array.
  const lastUser =
    [...messages].reverse().find((m) => m.role === "user") ??
    messages[messages.length - 1];

  const message = lastUser?.content ?? "";

  const res = await fetch(`/api/mentor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const data = await res.json();
  // mentor.ts returns { reply, insight, meta? }
  return data.reply as string;
}

/** Single-shot helper for other spiritual insight calls */
export async function getSpiritualInsight(prompt: string) {
  try {
    const res = await fetch(`/api/test-openai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return data.message as string;
  } catch (err) {
    console.error("Error fetching spiritual insight:", err);
    return "Something went wrong.";
  }
}

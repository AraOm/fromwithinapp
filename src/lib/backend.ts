// src/lib/backend.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8001";

export type ChatPayload = { chakra: string; notes?: string };

export async function getChakraInsight(payload: ChatPayload): Promise<string> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000); // 20s timeout
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctl.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API ${res.status}: ${text || res.statusText}`);
    }
    const data = await res.json();
    return typeof data?.message === "string" ? data.message : JSON.stringify(data);
  } finally {
    clearTimeout(t);
  }
}

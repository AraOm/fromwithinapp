import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const { message } = req.body ?? {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing 'message' string in body." });
  }

  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
    "";

  if (!apiKey) {
    return res.status(200).json({
      reply: localMentor(message),
      insight: quickInsight(message),
      meta: { offline: true }
    });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate spiritual mentor. Be concise (3–5 sentences), gentle, and actionable. Offer one simple practice."
        },
        { role: "user", content: message }
      ]
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Let’s take six slow breaths together. Inhale 4, hold 4, exhale 6.";

    return res.status(200).json({
      reply: text,
      insight:
        "Notice where the breath travels first—chest, belly, or back. Place a palm there and soften."
    });
  } catch (e) {
    console.error("mentor api error:", e);
    return res.status(200).json({
      reply: localMentor(message),
      insight: quickInsight(message),
      meta: { offline: true }
    });
  }
}

function localMentor(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("anx") || m.includes("stress"))
    return "Let’s ground: inhale 4, hold 4, exhale 6 for 6 rounds. Hand on heart, name one tiny next step.";
  if (m.includes("sleep"))
    return "Before bed: 5 slow breaths, a gentle 60s forward fold, and screens off for 30 minutes.";
  if (m.includes("thank"))
    return "You’re welcome. Keep noticing small wins; gratitude nudges the nervous system toward safety.";
  return "I’m here. What sensations are present—tightness, warmth, tingling? Breathe slowly and describe one.";
}

function quickInsight(_msg: string): string {
  return "Try a 60-second body scan; pause anywhere that calls attention and exhale gently into it.";
}

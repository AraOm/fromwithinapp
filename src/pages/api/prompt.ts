// src/pages/api/prompt.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type PromptResponse = { message: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PromptResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey =
    process.env.OPENAI_API_KEY ||
    process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
    "";

  if (!apiKey) {
    // Fallback: simple local prompt if key is missing
    return res.status(200).json({
      message:
        "What is quietly asking for your attention inside you today—emotionally, physically, or energetically?",
    });
  }

  const openai = new OpenAI({ apiKey });

  // Whatever your Check-In UI sends here:
  const { input, mode } = (req.body || {}) as {
    input?: string;
    mode?: string;
  };

  const userContext =
    input && input.trim()
      ? `The user shared: "${input.trim()}".`
      : "The user hasn’t shared details yet; they just opened the check-in.";

  const modeText = mode
    ? `The current mode is: ${mode}.`
    : "No specific mode was selected.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            "You are the Check-In guide in a spiritual wellness app called From Within. " +
            "You respond with ONE short journaling prompt (1–2 sentences). " +
            "Weave emotional awareness, body cues, and subtle energy. " +
            "Do NOT answer the prompt; only give the prompt.",
        },
        {
          role: "user",
          content: `${userContext}\n${modeText}\nPlease give one journaling prompt only.`,
        },
      ],
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "What feels tender or tight inside you today, and what does it want you to know?";

    return res.status(200).json({ message: text });
  } catch (err) {
    console.error("/api/prompt error:", err);
    return res.status(500).json({
      error: "Failed to generate prompt.",
    });
  }
}

// src/pages/api/energy/insight.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Data = { message: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    // This is what you'll see if you open /api/energy/insight in the browser
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not configured on the server." });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a kind, grounded spiritual wellness mentor who blends nervous-system literacy with lunar rituals.",
        },
        {
          role: "user",
          content:
            "Give a short example lunar ritual and reflection for a random day.",
        },
      ],
      temperature: 0.8,
    });

    const message =
      completion.choices[0]?.message?.content?.trim() ??
      "Take three slow breaths, feel your body, and choose one tiny act of kindness for yourself today.";

    return res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Failed to generate lunar AI insight." });
  }
}

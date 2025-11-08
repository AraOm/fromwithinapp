import type { NextApiRequest, NextApiResponse } from "next";

type CrystalResponse = {
  crystalName: string;
  chakra: string;
  uses: string;
};

type ErrorResponse = { error: string };

// Allow larger images (fixes 413 errors)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CrystalResponse | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY is missing");
    return res
      .status(500)
      .json({ error: "Server is missing OPENAI_API_KEY. Check .env.local." });
  }

  const { imageData } = req.body as { imageData?: string };
  if (!imageData) {
    return res.status(400).json({ error: "Missing image data" });
  }

  console.log(
    "✅ /api/crystal-identify received image, length:",
    imageData.length
  );

  try {
    const systemPrompt = `
You are a crystal identification expert and energy guide.

Given a clear photo of a crystal, respond ONLY as JSON in this exact shape:

{
  "crystalName": "Name of the most likely crystal (short)",
  "chakra": "Primary chakra or chakras it supports (short)",
  "uses": "1–3 concise sentences describing its metaphysical/energetic uses, in warm, modern language."
}

Do not include any extra commentary or fields. If you're unsure, give your best intuitive guess and say that you're estimating in the description.
`;

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Please identify this crystal, its chakra alignment, and key energetic uses.",
              },
              {
                type: "input_image",
                image_url: imageData,
              },
            ],
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      console.error("❌ OpenAI error:", openaiRes.status, text);
      return res
        .status(500)
        .json({ error: "AI could not analyze the image. Try again later." });
    }

    const data = await openaiRes.json();

    const rawText =
      data.output?.[0]?.content?.[0]?.text ??
      data.output?.[0]?.content?.[0]?.output_text ??
      "";

    let parsed: CrystalResponse;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error("⚠️ Failed to parse OpenAI JSON:", e, rawText);
      parsed = {
        crystalName: "Intuitive Ally",
        chakra: "Heart",
        uses:
          "Helps soften your energy, open the heart, and bring you back into gentle self-compassion. (Fallback description.)",
      };
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("🔥 Error in /api/crystal-identify:", err);
    return res.status(500).json({
      error: "Server error while identifying the crystal.",
    });
  }
}

// src/pages/api/aura-reading.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type AuraResponseBody = {
  primaryColor: string;   // hex like "#FFC95A"
  secondaryColor: string; // hex like "#7C63FF"
  intensity: number;      // 0–1
  reading: string;        // channeled-style message
  angelNumbers: string[];
  keywords: string[];
};

type ErrorResponse = { error: string };

// Simple hash → 0..2^32-1
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const palette = [
  "#FBBF24", // amber
  "#22C55E", // green
  "#38BDF8", // sky
  "#A855F7", // violet
  "#EC4899", // pink
  "#F97316", // orange
  "#2DD4BF", // teal
];

const keywordsByColor: Record<string, string[]> = {
  "#FBBF24": ["self-worth", "confidence", "solar plexus"],
  "#22C55E": ["heart healing", "growth", "grounding"],
  "#38BDF8": ["clarity", "communication", "calm mind"],
  "#A855F7": ["mysticism", "intuition", "psychic senses"],
  "#EC4899": ["love", "emotional alchemy", "relationship repair"],
  "#F97316": ["creative fire", "expression", "play"],
  "#2DD4BF": ["balance", "flow", "nervous system soothing"],
};

const angelChoices = ["111", "222", "333", "444", "555", "666", "777", "888", "999"];

const apiKey = process.env.OPENAI_API_KEY || "";

// Build a deterministic aura from the image string
function buildLocalAura(imageData: string): AuraResponseBody {
  const h = simpleHash(imageData || "fallback");

  const primaryIndex = h % palette.length;
  const secondaryIndex = (primaryIndex + 3) % palette.length;

  const primaryColor = palette[primaryIndex];
  const secondaryColor = palette[secondaryIndex];

  // 0.35–0.95 range
  const rawIntensity = (h % 1000) / 1000;
  const intensity = 0.35 + rawIntensity * 0.6;

  const primaryKeywords = keywordsByColor[primaryColor] ?? ["alignment"];
  const secondaryKeywords = keywordsByColor[secondaryColor] ?? ["integration"];
  const keywords = Array.from(new Set([...primaryKeywords, ...secondaryKeywords]));

  const angel1 = angelChoices[h % angelChoices.length];
  const angel2 = angelChoices[(h >> 3) % angelChoices.length];
  const angelNumbers = Array.from(new Set([angel1, angel2])).slice(0, 2);

  const reading =
    "Your aura shows layered color fields today. A primary band close to the body and a softer outer halo reveal where your energy is focusing and how it is integrating.";

  return {
    primaryColor,
    secondaryColor,
    intensity,
    reading,
    angelNumbers,
    keywords,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuraResponseBody | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageData } = req.body as { imageData?: string };

  if (!imageData) {
    return res.status(400).json({ error: "Missing image data" });
  }

  // Step 1: deterministic local aura (always works)
  let aura = buildLocalAura(imageData);

  // Step 2: if no API key, just return local aura
  if (!apiKey) {
    console.warn("[Aura API] OPENAI_API_KEY missing. Returning local aura only.");
    return res.status(200).json(aura);
  }

  try {
    const openai = new OpenAI({ apiKey });

    const systemPrompt = `
You are a mystical yet grounded aura reader.
You receive a summary of a person's aura colors, intensity, and themes.
Write a short, warm, channeled-style interpretation in 2–3 paragraphs.
Speak in second person ("you"), be encouraging, and avoid generic clichés.
    `.trim();

    const userPrompt = `
Aura summary:
- Primary color: ${aura.primaryColor}
- Secondary color: ${aura.secondaryColor}
- Intensity (0–1): ${aura.intensity.toFixed(2)}
- Keywords: ${aura.keywords.join(", ")}
- Angel numbers: ${aura.angelNumbers.join(", ")}

Write the interpretation now.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (text) {
      aura = { ...aura, reading: text };
    } else {
      console.warn("[Aura API] OpenAI returned empty content, keeping local reading.");
    }
  } catch (err) {
    console.error("[Aura API] Error calling OpenAI, keeping local reading:", err);
  }

  // Step 3: always succeed with a valid aura
  return res.status(200).json(aura);
}

// ⬇️ Increase JSON body size limit so base64 imageData doesn't 413
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

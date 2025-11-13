// src/components/PlantAlliesSection.tsx
import React from "react";

type ChakraKey =
  | "root"
  | "sacral"
  | "solar"
  | "heart"
  | "throat"
  | "thirdEye"
  | "crown";

type PlantAlly = {
  name: string;
  oils: string[];
  chakra: ChakraKey;
  chakraLabel: string;
  focus: string;
  why: string;
  ritual: string;
};

const CHAKRA_PLANT_ALLIES: Record<ChakraKey, PlantAlly> = {
  root: {
    name: "Grounding Roots",
    oils: ["Vetiver", "Cedarwood", "Patchouli"],
    chakra: "root",
    chakraLabel: "Root Chakra • Muladhara",
    focus: "Safety, grounding, nervous system regulation",
    why: "Earthy, smoky oils help you drop out of the head and back into the body, reminding your system that you are safe and supported.",
    ritual:
      "Place 1–2 drops (diluted) on the soles of your feet or lower back before standing or gentle movement. Breathe deep and imagine roots growing into the Earth.",
  },
  sacral: {
    name: "Creative Waters",
    oils: ["Sweet Orange", "Ylang Ylang", "Jasmine (diluted)"],
    chakra: "sacral",
    chakraLabel: "Sacral Chakra • Svadhisthana",
    focus: "Pleasure, emotion flow, creativity",
    why: "These sensual, flowing scents support emotional release, playfulness, and your connection to joy and desire.",
    ritual:
      "Diffuse near your workspace or inhale from cupped hands before journaling, dancing, or creative play. Invite any stuck feelings to gently move.",
  },
  solar: {
    name: "Solar Fire",
    oils: ["Lemon", "Ginger", "Rosemary"],
    chakra: "solar",
    chakraLabel: "Solar Plexus • Manipura",
    focus: "Confidence, willpower, motivation",
    why: "Bright, spicy oils awaken your inner fire and help burn through fog, self-doubt, or procrastination.",
    ritual:
      "Dilute and anoint your upper belly or back of the neck before a focused task. Stand tall, breathe into your ribs, and repeat: “I embody my power.”",
  },
  heart: {
    name: "Open Heart",
    oils: ["Rose", "Geranium", "Bergamot"],
    chakra: "heart",
    chakraLabel: "Heart Chakra • Anahata",
    focus: "Compassion, self-love, emotional healing",
    why: "Soft floral and citrus notes support tenderness, grief processing, and a sense of warmth toward yourself and others.",
    ritual:
      "Place a drop (diluted) over your heart center or on your palms, then hold your hands at your chest while breathing slowly. Imagine your chest glowing green and gold.",
  },
  throat: {
    name: "Clear Voice",
    oils: ["Eucalyptus", "Peppermint", "Tea Tree"],
    chakra: "throat",
    chakraLabel: "Throat Chakra • Vishuddha",
    focus: "Communication, expression, truth-telling",
    why: "Cooling, clearing oils help open the breath and support speaking clearly and honestly.",
    ritual:
      "Diffuse while writing, recording, or having important conversations. Breathe in, exhale with a gentle humming sound, and imagine the throat area bright and open.",
  },
  thirdEye: {
    name: "Inner Vision",
    oils: ["Frankincense", "Clary Sage", "Lavender"],
    chakra: "thirdEye",
    chakraLabel: "Third Eye • Ajna",
    focus: "Intuition, clarity, insight",
    why: "Resinous and herbal notes support meditation, inner listening, and seeing beyond surface stories.",
    ritual:
      "Diffuse during meditation or place (diluted) on temples/hairline. Soften your gaze, breathe, and ask your inner guidance a question.",
  },
  crown: {
    name: "Crown Light",
    oils: ["Sandalwood", "Lotus (if available)", "Lavender"],
    chakra: "crown",
    chakraLabel: "Crown Chakra • Sahasrara",
    focus: "Spiritual connection, surrender, stillness",
    why: "These contemplative scents invite a sense of spaciousness, presence, and connection to something greater.",
    ritual:
      "Diffuse while in stillness, prayer, or breathwork. Visualize light gently pouring in through the crown and washing down the body.",
  },
};

interface PlantAlliesSectionProps {
  dominantChakra?: ChakraKey;
  secondaryChakra?: ChakraKey;
}

const chakraPrettyName: Record<ChakraKey, string> = {
  root: "Root",
  sacral: "Sacral",
  solar: "Solar Plexus",
  heart: "Heart",
  throat: "Throat",
  thirdEye: "Third Eye",
  crown: "Crown",
};

const PlantAlliesSection: React.FC<PlantAlliesSectionProps> = ({
  dominantChakra,
  secondaryChakra,
}) => {
  const primary = dominantChakra
    ? CHAKRA_PLANT_ALLIES[dominantChakra]
    : CHAKRA_PLANT_ALLIES.heart; // default a gentle general one

  const secondary =
    secondaryChakra && secondaryChakra !== dominantChakra
      ? CHAKRA_PLANT_ALLIES[secondaryChakra]
      : undefined;

  const title = dominantChakra
    ? `Plant Allies for Your ${chakraPrettyName[dominantChakra]} Chakra`
    : "Plant Allies for Your Energy Field";

  const subtitle = dominantChakra
    ? "Essential oils to support the chakra your system is highlighting right now."
    : "Choose a blend that feels right for your body in this moment.";

  const alliesToShow = secondary ? [primary, secondary] : [primary];

  return (
    <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            🌿 Plant Allies
          </h2>
          <p className="mt-1 text-xs text-slate-300">{title}</p>
          <p className="mt-1 text-[0.7rem] text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {alliesToShow.map((ally) => (
          <div
            key={ally.chakra}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-3 text-xs text-slate-200"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold">{ally.name}</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-slate-400">
                {ally.chakraLabel}
              </span>
            </div>

            <p className="text-[0.7rem] text-slate-400">
              Focus: <span className="text-slate-200">{ally.focus}</span>
            </p>

            <p className="mt-1 text-[0.7rem] text-slate-300">
              Oils:{" "}
              <span className="text-slate-200">
                {ally.oils.join(", ")} (use single or blend)
              </span>
            </p>

            <p className="mt-2 text-[0.7rem] text-slate-300">{ally.why}</p>

            <p className="mt-2 text-[0.65rem] text-slate-400">
              Ritual idea: {ally.ritual}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.6rem] text-slate-500">
        Always dilute essential oils properly and avoid direct contact with
        eyes, mucous membranes, or broken skin. If pregnant, nursing, or under
        medical care, consult a professional before use.
      </p>
    </section>
  );
};

export default PlantAlliesSection;

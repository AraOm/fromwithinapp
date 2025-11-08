// src/lib/tarotDeck.ts
// Full 78-card tarot deck generator
// Majors listed explicitly, Minors generated programmatically

export type TarotCard = {
    name: string;
    arcana: "Major" | "Minor";
    suit?: "Wands" | "Cups" | "Swords" | "Pentacles";
    rank?: string;
    meaningUpright: string;
    meaningReversed: string;
    guidanceUpright?: string;
    guidanceReversed?: string;
  };
  
  const MAJORS: { name: string; u: string; r: string }[] = [
    { name: "The Fool", u: "New beginnings, leap of faith.", r: "Hesitation, recklessness." },
    { name: "The Magician", u: "Manifestation, skill.", r: "Manipulation, scattered energy." },
    { name: "The High Priestess", u: "Intuition, mystery.", r: "Secrets, ignoring intuition." },
    { name: "The Empress", u: "Nurture, abundance.", r: "Overgiving, stagnation." },
    { name: "The Emperor", u: "Structure, leadership.", r: "Rigidity, control issues." },
    { name: "The Hierophant", u: "Tradition, counsel.", r: "Rebellion, unconventional." },
    { name: "The Lovers", u: "Union, alignment, choice.", r: "Disharmony, indecision." },
    { name: "The Chariot", u: "Willpower, victory.", r: "Doubt, lack of direction." },
    { name: "Strength", u: "Courage, compassion.", r: "Fear, insecurity." },
    { name: "The Hermit", u: "Solitude, wisdom.", r: "Isolation, withdrawal." },
    { name: "Wheel of Fortune", u: "Cycles, luck.", r: "Resistance to change." },
    { name: "Justice", u: "Balance, truth.", r: "Bias, avoidance." },
    { name: "The Hanged Man", u: "Perspective, surrender.", r: "Stagnation, indecision." },
    { name: "Death", u: "Transformation, endings.", r: "Clinging to old, fear of change." },
    { name: "Temperance", u: "Harmony, patience.", r: "Excess, imbalance." },
    { name: "The Devil", u: "Attachment, shadow work.", r: "Liberation, detachment." },
    { name: "The Tower", u: "Upheaval, revelation.", r: "Avoided disaster, fear of change." },
    { name: "The Star", u: "Hope, renewal.", r: "Doubt, depletion." },
    { name: "The Moon", u: "Dreams, intuition.", r: "Confusion, anxiety." },
    { name: "The Sun", u: "Joy, vitality.", r: "Cloudiness, overexposure." },
    { name: "Judgement", u: "Awakening, calling.", r: "Self-doubt, hesitation." },
    { name: "The World", u: "Completion, wholeness.", r: "Unfinished business." },
  ];
  
  const SUITS = ["Wands", "Cups", "Swords", "Pentacles"] as const;
  const RANKS = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Page","Knight","Queen","King"];
  
  // Quick suit themes
  const THEMES: Record<string, { u: string; r: string }> = {
    Wands: { u: "inspiration, action", r: "burnout, scattered energy" },
    Cups: { u: "emotions, relationships", r: "emotional block, repression" },
    Swords: { u: "clarity, communication", r: "confusion, harshness" },
    Pentacles: { u: "material, stability", r: "scarcity, stagnation" },
  };
  
  function makeMinor(suit: typeof SUITS[number], rank: string): TarotCard {
    return {
      name: `${rank} of ${suit}`,
      arcana: "Minor",
      suit,
      rank,
      meaningUpright: `${rank} of ${suit}: ${THEMES[suit].u}.`,
      meaningReversed: `${rank} of ${suit} (reversed): ${THEMES[suit].r}.`,
      guidanceUpright: `Lean into ${THEMES[suit].u}.`,
      guidanceReversed: `Be mindful of ${THEMES[suit].r}.`,
    };
  }
  
  export function buildFullDeck(): TarotCard[] {
    const majors: TarotCard[] = MAJORS.map((m) => ({
      name: m.name,
      arcana: "Major",
      meaningUpright: m.u,
      meaningReversed: m.r,
      guidanceUpright: "Notice the lesson and lean in.",
      guidanceReversed: "Release resistance and soften your stance.",
    }));
  
    const minors: TarotCard[] = [];
    for (const s of SUITS) {
      for (const r of RANKS) {
        minors.push(makeMinor(s, r));
      }
    }
    return [...majors, ...minors];
  }
  
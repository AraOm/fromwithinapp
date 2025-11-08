// src/learn/index.ts
// -----------------------------------------------------------------------------
// From Within – Learning Catalog
// Categories: Chakras, Reiki, Meditation, Astrology, Crystals
// Exports:
//   - learningCatalog (array of categories)
//   - getCategory(slug)
//   - getLesson(categorySlug, lessonSlug)
//   - TYPES: Lesson, Category
// -----------------------------------------------------------------------------

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  content: string; // plain text/markdown-friendly
  durationMin?: number; // optional micro-lesson timing for UI labels
};

export type Category = {
  slug: string;
  title: string;
  tagline: string;
  lessons: Lesson[];
};

// (utility reserved for future use)
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// ──────────────────────────────────────────────────────────────────────────────
// CHAKRAS
// ──────────────────────────────────────────────────────────────────────────────

const chakraLessons: Lesson[] = [
  {
    slug: "introduction-to-chakras",
    title: "Introduction to Chakras",
    summary: "Seven centers, energy basics & how to use this map.",
    content: `
Chakras are energy centers aligned along the spine that influence physical wellbeing, emotions, and consciousness.
This map helps you notice where you feel open or tight, energized or depleted—then bring things back into balance.

• Seven primary chakras run from the base of the spine to the crown of the head.
• Transpersonal chakras (Earth Star below the feet, Soul Star above the head) extend the field.
• The central channel connecting them is the **Shushumna Nadi**.
• You don't have to “perfect” anything—just notice, breathe, and support what needs care.
    `,
    durationMin: 2,
  },
  {
    slug: "root-chakra",
    title: "Root Chakra (Muladhara)",
    summary: "Grounding, safety, stability.",
    content: `
• Location: base of spine / pelvic floor
• Themes: security, belonging, physical needs, finances
• In balance: steady, resourced, at home in your body
• Imbalance: anxiety, hypervigilance, survival stress

Micro-practice: feel your feet, bend your knees, slow 6-count breaths. Imagine roots into the earth.
    `,
    durationMin: 2,
  },
  {
    slug: "sacral-chakra",
    title: "Sacral Chakra (Svadhisthana)",
    summary: "Creativity, pleasure, emotions.",
    content: `
• Location: lower belly (below navel)
• Themes: feeling, desire, creativity, fluidity, sexuality
• In balance: joy, emotional flow, healthy boundaries with pleasure
• Imbalance: guilt, shame, numbness, creative block

Micro-practice: sway your hips, soften your jaw, breathe into the pelvis; invite curiosity.
    `,
    durationMin: 2,
  },
  {
    slug: "solar-plexus-chakra",
    title: "Solar Plexus (Manipura)",
    summary: "Confidence, willpower, personal fire.",
    content: `
• Location: upper abdomen (navel to sternum)
• Themes: power, agency, healthy ambition, digestion (food & life)
• In balance: clear “yes/no,” momentum, self-trust
• Imbalance: doubt, procrastination, overcontrol, burnout

Micro-practice: hands over stomach, breathe like a warm ember brightening as you exhale slowly.
    `,
    durationMin: 2,
  },
  {
    slug: "heart-chakra",
    title: "Heart Chakra (Anahata)",
    summary: "Love, compassion, connection.",
    content: `
• Location: center of chest
• Themes: compassion, grief, forgiveness, boundaries+bonding
• In balance: tenderness with strength, giving/receiving in harmony
• Imbalance: walls up, people-pleasing, unresolved grief

Micro-practice: inhale into the back of the heart; exhale soften the front. Think of someone you appreciate.
    `,
    durationMin: 2,
  },
  {
    slug: "throat-chakra",
    title: "Throat Chakra (Vishuddha)",
    summary: "Truth, expression, listening.",
    content: `
• Location: throat/neck/jaw
• Themes: honest speech, creative expression, deep listening
• In balance: clear voice, congruent words, receptive ears
• Imbalance: fear of speaking, overtalking, tight jaw/neck

Micro-practice: hum gently for 3–5 breaths; feel vibration clear the throat.
    `,
    durationMin: 2,
  },
  {
    slug: "third-eye-chakra",
    title: "Third Eye (Ajna)",
    summary: "Intuition, insight, perspective.",
    content: `
• Location: between the eyebrows
• Themes: vision, pattern-sense, imagination, meaning-making
• In balance: clarity, healthy skepticism + wonder
• Imbalance: confusion, overthinking, rigid beliefs

Micro-practice: soften your gaze; 5 slow breaths; ask: “What’s the simplest next step?”
    `,
    durationMin: 2,
  },
  {
    slug: "crown-chakra",
    title: "Crown Chakra (Sahasrara)",
    summary: "Consciousness, unity, devotion.",
    content: `
• Location: top of head / above
• Themes: connection to Source, humility, spacious awareness
• In balance: peaceful presence, trust in life
• Imbalance: cynicism, spiritual bypass, disconnection

Micro-practice: feel the crown lightly lifted; breathe as if the sky is breathing you.
    `,
    durationMin: 2,
  },
  {
    slug: "earth-star-chakra",
    title: "Earth Star Chakra",
    summary: "Deep anchoring, ancestral roots, purpose-in-action.",
    content: `
• Location: ~12 inches below the feet
• Themes: embodied purpose, planetary belonging, nervous-system settling
• Practice: stand; imagine a warm weight below your feet magnetizing you to steady ground.
    `,
    durationMin: 2,
  },
  {
    slug: "soul-star-chakra",
    title: "Soul Star Chakra",
    summary: "Higher purpose, soul memory, grace.",
    content: `
• Location: ~6–12 inches above the head
• Themes: soul-level guidance, Akashic remembrance, blessings
• Practice: sense a soft light above; breathe up to meet it, then down to share it through the body.
    `,
    durationMin: 2,
  },
  {
    slug: "shushumna-nadi",
    title: "Shushumna Nadi",
    summary: "Central channel uniting all chakras.",
    content: `
The **Shushumna** is the central energy channel running along the spine. Ida (lunar) and Pingala (solar) weave around it.
When Shushumna is open, energy flows freely and the chakras harmonize.

Micro-practice: sit tall. Inhale from Earth Star up the spine to Crown/Soul Star. Exhale back down. 6–8 cycles.
    `,
    durationMin: 2,
  },
];

const chakrasCategory: Category = {
  slug: "chakras",
  title: "Chakras",
  tagline: "Bite-sized lessons: basics to advanced mapping.",
  lessons: chakraLessons,
};

// ──────────────────────────────────────────────────────────────────────────────
// REIKI
// ──────────────────────────────────────────────────────────────────────────────

const reikiCategory: Category = {
  slug: "reiki",
  title: "Reiki",
  tagline: "Foundations, hand positions, safety, attunement prep.",
  lessons: [
    {
      slug: "foundations-of-reiki",
      title: "Foundations of Reiki",
      summary: "History, ethics, attunements.",
      content: `
Reiki is a Japanese healing art (Mikao Usui) that channels universal life force for balance.
Principles: just for today—do not anger, do not worry, be grateful, work diligently, be kind.
Attunements open the practitioner to the Reiki current; practice deepens it through service and self-care.
      `,
      durationMin: 3,
    },
    {
      slug: "hand-positions",
      title: "Hand Positions",
      summary: "Self & partner placements.",
      content: `
Self-Reiki flow: head → throat → heart → solar plexus → belly → pelvis → knees/feet.
Partner flow: crown → third eye → throat → heart → abdomen → hips → joints as needed.
Hands can hover or touch. Let intuition, breath, and comfort guide timing.
      `,
      durationMin: 3,
    },
    {
      slug: "safety-and-scope",
      title: "Safety & Scope",
      summary: "Boundaries, consent, referrals.",
      content: `
Obtain informed consent. Reiki complements—not replaces—medical care.
Avoid areas with open wounds or acute trauma unless requested and appropriate.
Stay within scope; refer to medical/mental-health pros when needed. Ground yourself before/after sessions.
      `,
      durationMin: 2,
    },
    {
      slug: "attunement-prep",
      title: "Attunement Prep",
      summary: "Intention, diet, journaling.",
      content: `
In the week prior: hydrate, lighten diet, rest, daily breathwork or meditation.
Journal intentions: healing yourself, serving others, living the Reiki Principles.
After attunement: 21-day self-practice (head → heart → belly daily) to integrate.
      `,
      durationMin: 2,
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// MEDITATION
// ──────────────────────────────────────────────────────────────────────────────

const meditationCategory: Category = {
  slug: "meditation",
  title: "Meditation",
  tagline: "Micro-practices for busy days + deep dives.",
  lessons: [
    {
      slug: "breathing-techniques",
      title: "Breathing Techniques",
      summary: "Box, 4–7–8, coherent breathing.",
      content: `
• Box: inhale 4, hold 4, exhale 4, hold 4 (4–6 rounds).
• 4–7–8: inhale 4, hold 7, exhale 8 (great for evening).
• Coherent: equal inhale/exhale (e.g., 5–6 count) for nervous-system balance.
Tip: relax the jaw and lengthen the exhale to calm faster.
      `,
      durationMin: 2,
    },
    {
      slug: "mindfulness-on-busy-days",
      title: "Mindfulness on Busy Days",
      summary: "2–5 minute resets.",
      content: `
Pause, feel your feet, breathe three slow cycles, name 3 things you can see/hear/feel.
Micro body-scan: head → jaw → shoulders → belly → feet; soften each on the exhale.
These small resets compound over time.
      `,
      durationMin: 2,
    },
    {
      slug: "deep-dives",
      title: "Deep Dives",
      summary: "Body scan, yoga nidra, mantra.",
      content: `
• Body scan: move awareness from crown to toes, releasing layer by layer.
• Yoga nidra: guided non-sleep deep rest—excellent for burnout.
• Mantra: repeat a chosen phrase/sound to steady attention (e.g., “So Hum”).
      `,
      durationMin: 3,
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// ASTROLOGY
// ──────────────────────────────────────────────────────────────────────────────

const astrologyCategory: Category = {
  slug: "astrology",
  title: "Astrology",
  tagline: "Sun/Moon/Rising, transits, lunar living.",
  lessons: [
    {
      slug: "sun-moon-rising",
      title: "Sun / Moon / Rising",
      summary: "Core identity, inner world, how you're seen.",
      content: `
Sun = vitality & essence. Moon = emotions & needs. Rising (Ascendant) = your interface with the world.
Reading these three together offers a fast, compassionate snapshot of personality and patterns.
      `,
      durationMin: 3,
    },
    {
      slug: "transits-and-retrogrades",
      title: "Transits & Retrogrades",
      summary: "Timing & themes in motion.",
      content: `
Transits show current planetary influences. Retrogrades invite review and refinement.
Example: Mercury retrograde highlights communication, tech, travel—slow down, double-check, reconnect.
      `,
      durationMin: 3,
    },
    {
      slug: "lunar-living",
      title: "Lunar Living",
      summary: "New/Full moons & rituals.",
      content: `
New Moon = seed intentions. First Quarter = action. Full Moon = illumination & release.
Simple ritual: write one intention (new) or one release (full), breathe with the moon for 3 minutes, say “thank you.”
      `,
      durationMin: 2,
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// CRYSTALS
// ──────────────────────────────────────────────────────────────────────────────

const crystalsCategory: Category = {
  slug: "crystals",
  title: "Crystals",
  tagline: "Properties, cleansing, pairing, grids.",
  lessons: [
    {
      slug: "properties-and-intuition",
      title: "Properties & Intuition",
      summary: "Reading stones by feel & lore.",
      content: `
Crystals offer different vibrations (calming, energizing, clarifying). Let your body be the guide.
Notice temperature, tingling, or mood shifts while holding a stone—this is your best teacher.
      `,
      durationMin: 2,
    },
    {
      slug: "cleansing-and-charging",
      title: "Cleansing & Charging",
      summary: "Smoke, salt, sun, moon, sound.",
      content: `
Cleanse regularly (smoke, sound, running water if stone-safe, dry salt nearby).
Charge in morning sun or full moonlight. Always add intention—it's the amplifier.
      `,
      durationMin: 2,
    },
    {
      slug: "pairing-and-combinations",
      title: "Pairing & Combinations",
      summary: "Synergies & cautions.",
      content: `
Amplifiers: clear quartz with almost anything. Grounders: hematite, smoky quartz, black tourmaline.
If a combo feels “too much,” add a grounding stone or simplify to one crystal.
      `,
      durationMin: 2,
    },
    {
      slug: "crystal-grids",
      title: "Crystal Grids",
      summary: "Layouts, intention, activation.",
      content: `
Pick a simple shape (triangle, hexagon, flower of life). Place a center stone for the intention.
Activate by tracing lines between stones with your finger or a crystal point while repeating the intention.
      `,
      durationMin: 3,
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// CATALOG & HELPERS
// ──────────────────────────────────────────────────────────────────────────────

export const learningCatalog: Category[] = [
  chakrasCategory,
  reikiCategory,
  meditationCategory,
  astrologyCategory,
  crystalsCategory,
];

export function getCategory(slug: string): Category | undefined {
  return learningCatalog.find((c) => c.slug === slug);
}

export function getLesson(
  categorySlug: string,
  lessonSlug: string
): Lesson | undefined {
  const cat = getCategory(categorySlug);
  return cat?.lessons.find((l) => l.slug === lessonSlug);
}

export const catalogIndex = Object.fromEntries(
  learningCatalog.map((c) => [c.slug, c.lessons.map((l) => l.slug)])
);

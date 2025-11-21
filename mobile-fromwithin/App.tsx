// mobile-fromwithin/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  View,
  Linking,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ZenPlaylistsMobile from "./components/ZenPlaylistsMobile";
import { openWearableConnect, WearableId } from "./utils/wearables";



import { useFromWithinHealth } from "./hooks/useHealthkit";
import { LegalLinks } from "./components/LegalLinks";

/* ──────────────────────────────────────────────────────────────
 * Types (ported from web Today + Insights)
 * ────────────────────────────────────────────────────────────── */

type SleepSummary = {
  date: string;
  durationMin: number;
  efficiencyPct: number;
  hrvMs?: number;
  hrvTrend?: "up" | "down" | "flat";
  restlessnessPct?: number;
  wakeEvents?: number;
};

type MorningVibe = {
  label: string;
  tagline: string;
};

type RecItem = {
  id: string;
  title: string;
  blurb: string;
  minutes?: number;
  tags?: string[];
  subtitle?: string;
};

type TodayPlan = {
  movement: RecItem[];
  breath: RecItem[];
  nourish: RecItem[];
  plantAllies: RecItem[];
};

type MorningPlan = {
  stretches: RecItem[];
  breathwork: RecItem[];
  meditations: RecItem[];
  breakfast: RecItem[];
  crystals: RecItem[];
  plantAllies: RecItem[];
};

type ChakraCard = {
  id: string;
  name: string;
  sanskrit: string;
  qualities: string;
  bodyFocus: string;
  ritual: string;
};

/* ──────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────── */

function id(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function greetingNow() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function minutesToHMM(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

/** TEMP: replace with real wearable sleep when ready */
function useMockSleep(): SleepSummary {
  return {
    date: new Date().toISOString().slice(0, 10),
    durationMin: 390,
    efficiencyPct: 86,
    hrvMs: 45,
    hrvTrend: "flat",
    restlessnessPct: 15,
    wakeEvents: 2,
  };
}

/** Derive vibe from sleep summary */
function getMorningVibe(s: SleepSummary): MorningVibe {
  const lowDuration = s.durationMin < 390; // <6.5h
  const lowEfficiency = s.efficiencyPct < 85;
  const highRestless = (s.restlessnessPct ?? 0) > 20;
  const manyWakes = (s.wakeEvents ?? 0) >= 3;
  const hrvDown = s.hrvTrend === "down";
  const hrvLow = (s.hrvMs ?? 0) < 40;

  const flags = [
    lowDuration,
    lowEfficiency,
    highRestless,
    manyWakes,
    hrvDown,
    hrvLow,
  ].filter(Boolean).length;

  if (flags <= 1) {
    return {
      label: "Well-Rested",
      tagline: "Your system feels resourced — you can gently lean into the day.",
    };
  }
  if (flags <= 3) {
    return {
      label: "Steady",
      tagline: "You’re okay — a few mindful choices keep your energy smooth.",
    };
  }
  if (flags <= 4) {
    return {
      label: "Tired",
      tagline: "Today is a soft day. Gentle movement and nourishment are medicine.",
    };
  }
  return {
    label: "Deeply Depleted",
    tagline:
      "Your only job is care. Move slowly, say no where you can, and refill.",
  };
}

/** Today page curated plan */
function buildTodayPlan(s: SleepSummary): TodayPlan {
  const lowDuration = s.durationMin < 390;
  const lowEfficiency = s.efficiencyPct < 85;
  const highRestless = (s.restlessnessPct ?? 0) > 20;
  const manyWakes = (s.wakeEvents ?? 0) >= 3;
  const hrvDown = s.hrvTrend === "down";
  const hrvLow = (s.hrvMs ?? 0) < 40;

  const needsCalm = lowEfficiency || highRestless || manyWakes;
  const needsEnergy = lowDuration || hrvDown || hrvLow;
  const needsGentle = lowDuration || manyWakes || highRestless;

  const movement: RecItem[] = needsGentle
    ? [
        {
          id: id("cat-cow + neck rolls"),
          title: "Cat–Cow + Neck Rolls",
          minutes: 4,
          blurb:
            "On hands and knees, alternate gently arching and rounding the spine for 6–8 rounds. Finish with slow neck circles, letting the jaw soften.",
          tags: ["gentle", "spine", "nervous system"],
        },
      ]
    : [
        {
          id: id("sun salutes x3"),
          title: "3 Soft Sun Salutations",
          minutes: 6,
          blurb:
            "Move slowly through 3 rounds of Sun Salutation A, matching each movement to your breath. Think fluid, not forceful.",
          tags: ["energize", "flow"],
        },
      ];

  const breath: RecItem[] = needsCalm
    ? [
        {
          id: id("4-6 exhale"),
          title: "Extended Exhale (4–6)",
          minutes: 3,
          blurb:
            "Inhale for 4, exhale for 6 through the nose. Keep the breath soft and shoulders relaxed. Repeat for a few minutes to downshift.",
          tags: ["calm", "HRV", "parasympathetic"],
        },
      ]
    : needsEnergy
    ? [
        {
          id: id("nadi shodhana"),
          title: "Nadi Shodhana (Alternate Nostril)",
          minutes: 4,
          blurb:
            "Close right nostril and inhale left, then close left and exhale right. Inhale right, exhale left. Continue for several rounds to balance both hemispheres.",
          tags: ["clarity", "balance"],
        },
      ]
    : [
        {
          id: id("coherent breathing"),
          title: "Coherent Breathing (5 in / 5 out)",
          minutes: 5,
          blurb:
            "Inhale for 5 counts, exhale for 5 through the nose. Imagine your heart and breath moving in one smooth wave.",
          tags: ["steady", "coherence"],
        },
      ];

  const nourish: RecItem[] = needsEnergy
    ? [
        {
          id: id("protein oats"),
          title: "Protein + Fiber Breakfast",
          blurb:
            "Think warm oats or quinoa with chia, nuts, and berries — or tofu scramble with greens. Slow, steady fuel instead of a spike & crash.",
          tags: ["protein", "fiber", "steady energy"],
        },
      ]
    : needsCalm
    ? [
        {
          id: id("warm soothing bowl"),
          title: "Warm Soothing Bowl",
          blurb:
            "Gentle options like soup, stewed apples, or congee. Warm, soft food tells your nervous system it’s safe to soften.",
          tags: ["soothing", "grounding"],
        },
      ]
    : [
        {
          id: id("simple balanced plate"),
          title: "Simple Balanced Plate",
          blurb:
            "Pair greens, a whole grain, and a protein (beans, tofu, lentils). Avoid overcomplication — clarity loves simplicity.",
          tags: ["balance", "focus"],
        },
      ];

  const plantAllies: RecItem[] = needsEnergy
    ? [
        {
          id: id("uplifting oils"),
          title: "Uplifting Oils · Solar",
          blurb:
            "Diffuser or palm inhalation: sweet orange, lemon, or peppermint. Apply 1–2 drops in carrier oil, rub palms, and inhale 3 bright breaths.",
          minutes: 1,
          tags: ["Uplifting", "essential oil", "focus"],
        },
        {
          id: id("green tea or tulsi"),
          title: "Green Tea or Tulsi",
          blurb:
            "A mug of green tea or tulsi (holy basil) to wake gently without jolting the nervous system.",
          tags: ["gentle energy", "adaptogen"],
        },
      ]
    : needsCalm
    ? [
        {
          id: id("grounding oils"),
          title: "Grounding Oils · Earth",
          blurb:
            "Cedarwood, vetiver, or frankincense on the soles of your feet or wrists (always diluted). Inhale 3 slow breaths feeling your feet heavy.",
          minutes: 1,
          tags: ["Grounding", "nervous system"],
        },
        {
          id: id("heart tea"),
          title: "Heart-Softening Tea",
          blurb:
            "Rose, hawthorn, or chamomile in a warm mug. Sip with one hand on your heart and ask, “How can I be 1% kinder to myself today?”",
          tags: ["Heart-Opening", "soothing"],
        },
      ]
    : [
        {
          id: id("balancing herbs"),
          title: "Balancing Herbs",
          blurb:
            "Tulsi, chamomile, or rooibos — choose one and make it a small ritual. Smell the steam, take three slow breaths, then sip.",
          tags: ["steady", "ritual"],
        },
        {
          id: id("soft diffuser blend"),
          title: "Soft Diffuser Blend",
          blurb:
            "Lavender + a touch of citrus in the diffuser. Let the scent hold you while you do one simple task at a time.",
          tags: ["clarity", "soft focus"],
        },
      ];

  return { movement, breath, nourish, plantAllies };
}

/** Morning page plan */
function buildMorningPlan(s: SleepSummary): MorningPlan {
  const lowDuration = s.durationMin < 390;
  const lowEfficiency = s.efficiencyPct < 85;
  const highRestless = (s.restlessnessPct ?? 0) > 20;
  const manyWakes = (s.wakeEvents ?? 0) >= 3;
  const hrvDown = s.hrvTrend === "down";
  const hrvLow = (s.hrvMs ?? 0) < 40;

  const needsCalm = lowEfficiency || highRestless || manyWakes;
  const needsEnergy = lowDuration || hrvDown || hrvLow;
  const needsGentle = lowDuration || manyWakes || highRestless;

  const stretches: RecItem[] = [
    {
      id: id("neck + shoulder unwind"),
      title: "Neck + Shoulder Unwind",
      minutes: needsGentle ? 3 : 5,
      blurb:
        "Let your right ear lower toward your right shoulder and breathe for a few breaths. Switch sides. Roll both shoulders up, back, and down several times.",
      tags: ["gentle", "release"],
    },
    {
      id: id("low back reset"),
      title: "Low Back Reset",
      minutes: 3,
      blurb:
        "On your back, hug both knees toward your chest and rock side to side. Then twist both knees to one side, breathe, and switch.",
      tags: ["twist", "restorative"],
    },
  ];

  const breathwork: RecItem[] = needsCalm
    ? [
        {
          id: id("extended exhale"),
          title: "Extended Exhale (4–6)",
          minutes: 4,
          blurb:
            "Inhale slowly for 4, exhale softly for 6. Let your shoulders melt down as the exhale lengthens.",
          tags: ["parasympathetic", "downshift"],
        },
        {
          id: id("box breath"),
          title: "Box Breath",
          minutes: 3,
          blurb:
            "Inhale 4, hold 4, exhale 4, hold 4. Imagine tracing the sides of a square with each phase of breath.",
          tags: ["focus", "balance"],
        },
      ]
    : needsEnergy
    ? [
        {
          id: id("nadi shodhana morning"),
          title: "Nadi Shodhana",
          minutes: 4,
          blurb:
            "Alternate nostril breath to balance both sides of your body and mind before the day begins.",
          tags: ["balance", "clarity"],
        },
        {
          id: id("gentle breath of fire"),
          title: "Breath of Fire (gentle)",
          minutes: 2,
          blurb:
            "Short, light exhales from the belly. Stop if you feel dizzy. Use sparingly when you need a little spark.",
          tags: ["energize"],
        },
      ]
    : [
        {
          id: id("coherent breathing morning"),
          title: "Coherent Breathing (5:5)",
          minutes: 5,
          blurb:
            "Inhale for 5 counts, exhale for 5 counts. Smooth, even waves that bring your system into rhythm.",
          tags: ["steady", "HRV"],
        },
      ];

  const meditations: RecItem[] = [
    {
      id: id("2-minute arrival"),
      title: "2-Minute Arrival",
      minutes: 2,
      blurb:
        "Feel your feet, then your breath, then the center of your chest. Name one intention for how you want today to feel.",
      tags: ["mindful", "short"],
    },
    needsCalm
      ? {
          id: id("body scan short"),
          title: "Body Scan (short)",
          minutes: 5,
          blurb:
            "Sweep attention slowly from head to toes. At each region, invite 1% more softness on every exhale.",
          tags: ["calm", "ground"],
        }
      : {
          id: id("focused clarity"),
          title: "Focused Clarity",
          minutes: 4,
          blurb:
            "Choose one anchor (breath, sound, or a candle flame) and gently return to it whenever your mind wanders.",
          tags: ["focus"],
        },
  ].filter(Boolean) as RecItem[];

  const breakfast: RecItem[] = needsEnergy
    ? [
        {
          id: id("protein oats"),
          title: "Protein Oats",
          blurb:
            "Warm oats with chia, nut butter, and berries — steady fuel that keeps you from crashing.",
          tags: ["protein", "fiber"],
        },
        {
          id: id("hydration minerals"),
          title: "Hydration + Minerals",
          blurb:
            "Water with a pinch of sea salt and lemon to rebuild hydration and minerals after a short or restless night.",
          tags: ["electrolytes"],
        },
      ]
    : needsCalm
    ? [
        {
          id: id("warm cinnamon quinoa"),
          title: "Warm Cinnamon Quinoa",
          blurb:
            "Quinoa cooked in plant milk with cinnamon and seeds — gentle on digestion and comforting.",
          tags: ["soothing"],
        },
        {
          id: id("green tea"),
          title: "Green Tea",
          blurb:
            "Lighter caffeine with L-theanine for calm, focused alertness instead of a jolt.",
          tags: ["calm focus"],
        },
      ]
    : [
        {
          id: id("eggs greens wrap"),
          title: "Eggs + Greens Wrap",
          blurb:
            "Eggs, greens, and avocado in a wrap for simple, satiating balance.",
          tags: ["protein", "healthy fats"],
        },
        {
          id: id("fruit yogurt"),
          title: "Fruit + Yogurt",
          blurb:
            "Pair fruit with yogurt for probiotics and gentle carbs that won’t spike energy sharply.",
          tags: ["probiotic", "light"],
        },
      ];

  const crystals: RecItem[] = needsEnergy
    ? [
        {
          id: id("citrine"),
          title: "Citrine",
          blurb:
            "Bright, solar energy for vitality and motivation. Keep it near your solar plexus.",
          tags: ["energy", "solar"],
        },
        {
          id: id("carnelian"),
          title: "Carnelian",
          blurb:
            "Warms the sacral center for creativity and mood. Carry near your lower belly.",
          tags: ["vitality", "sacral"],
        },
      ]
    : needsCalm
    ? [
        {
          id: id("amethyst"),
          title: "Amethyst",
          blurb:
            "Soothes mental chatter and nervous tension after a restless night.",
          tags: ["calm", "third-eye"],
        },
        {
          id: id("lepidolite"),
          title: "Lepidolite",
          blurb:
            "Supports emotional balance when sleep is fragmented or anxious.",
          tags: ["balance", "soften"],
        },
      ]
    : [
        {
          id: id("clear quartz"),
          title: "Clear Quartz",
          blurb:
            "Amplifies intention and brings clarity. Hold it while naming how you want your day to feel.",
          tags: ["clarity", "amplify"],
        },
        {
          id: id("green aventurine"),
          title: "Green Aventurine",
          blurb:
            "Encourages optimism and soft heart-opening. Keep it near your heart.",
          tags: ["heart", "optimism"],
        },
      ];

  const plantAllies: RecItem[] = needsEnergy
    ? [
        {
          id: id("uplifting plant allies"),
          title: "Uplifting Plant Allies",
          subtitle: "Tulsi · Rosemary · Green Tea",
          blurb:
            "Gentle energizers that wake the system without pushing too hard.",
          tags: ["clarity", "gentle lift"],
        },
        {
          id: id("uplifting oils"),
          title: "Essential Oils · Uplifting",
          subtitle: "Sweet Orange · Lemon · Peppermint",
          blurb:
            "1–2 diluted drops in palms or diffuser. Inhale 3 soft, bright breaths before your first focused task.",
          tags: ["essential oil", "solar"],
        },
      ]
    : needsCalm
    ? [
        {
          id: id("nervous system soothers"),
          title: "Nervous System Soothers",
          subtitle: "Chamomile · Lemon Balm · Passionflower",
          blurb:
            "Teas that ease a wired-but-tired system after choppy sleep. Sip slowly like medicine for your nerves.",
          tags: ["calm", "soothe"],
        },
        {
          id: id("grounding oils morning"),
          title: "Essential Oils · Grounding",
          subtitle: "Cedarwood · Vetiver · Frankincense",
          blurb:
            "Dilute and place on soles or wrists. Inhale while feeling your feet heavy on the floor.",
          tags: ["Grounding", "nervous system"],
        },
      ]
    : [
        {
          id: id("balancing allies"),
          title: "Balancing Plant Allies",
          subtitle: "Tulsi · Chamomile · Rooibos",
          blurb:
            "Gentle harmonizers that support your system without pulling it too far up or down.",
          tags: ["balance", "steady"],
        },
        {
          id: id("soft heart diffuser"),
          title: "Soft Heart Diffuser Blend",
          subtitle: "Lavender · Geranium · Orange",
          blurb:
            "Diffuse a soft blend while asking, “How can I meet myself with more kindness today?”",
          tags: ["Heart-Opening", "ritual"],
        },
      ];

  return { stretches, breathwork, meditations, breakfast, crystals, plantAllies };
}

/* Chakra map for Insights screen */
const CHAKRAS: ChakraCard[] = [
  {
    id: id("root"),
    name: "Root",
    sanskrit: "Muladhara",
    qualities: "Safety, belonging, stability",
    bodyFocus: "Feet, legs, pelvis, lower spine",
    ritual:
      "Press your feet into the floor for 30 seconds and feel the weight dropping down. One honest exhale with the thought, “I am supported enough for this moment.”",
  },
  {
    id: id("sacral"),
    name: "Sacral",
    sanskrit: "Svadhisthana",
    qualities: "Emotion, pleasure, fluidity",
    bodyFocus: "Hips, low belly, reproductive organs",
    ritual:
      "Rock your hips slowly in a small circle while seated or standing. Let the breath move like a tide in the low belly.",
  },
  {
    id: id("solar plexus"),
    name: "Solar Plexus",
    sanskrit: "Manipura",
    qualities: "Confidence, will, digestion",
    bodyFocus: "Stomach, diaphragm, mid-spine",
    ritual:
      "Place a warm hand on your upper belly. Inhale gently into the hand, exhale with the words, “I’m allowed to take up space.”",
  },
  {
    id: id("heart"),
    name: "Heart",
    sanskrit: "Anahata",
    qualities: "Love, connection, compassion",
    bodyFocus: "Chest, lungs, upper back, arms",
    ritual:
      "Roll the shoulders up, back, and down three times. Then rest one hand on your heart and name one being you’re grateful for.",
  },
  {
    id: id("throat"),
    name: "Throat",
    sanskrit: "Vishuddha",
    qualities: "Expression, truth, boundaries",
    bodyFocus: "Throat, neck, jaw, shoulders",
    ritual:
      "Stretch the neck gently side to side, then whisper one simple true sentence you’ve been holding back — just for you.",
  },
  {
    id: id("third eye"),
    name: "Third Eye",
    sanskrit: "Ajna",
    qualities: "Insight, intuition, perspective",
    bodyFocus: "Eyes, brow, temples, head",
    ritual:
      "Soften your gaze or close your eyes. Imagine a cool indigo light between your brows and ask, “What would future-me thank me for today?”",
  },
  {
    id: id("crown"),
    name: "Crown",
    sanskrit: "Sahasrara",
    qualities: "Connection, meaning, spaciousness",
    bodyFocus: "Top of head, nervous system as a whole",
    ritual:
      "Lengthen your spine, lift the crown of your head. Imagine a soft stream of light pouring down through you and out through the soles of your feet.",
  },
];

/* Simple “Insight of the Day” cycle */
const SAMPLE_INSIGHTS: string[] = [
  "Your system is asking for gentle consistency today. Choose one small ritual — a few breaths, a stretch, or a cup of something soothing — and let that be enough.",
  "You don’t have to optimize everything at once. What matters is one honest check-in and one loving choice for your body.",
  "Let today be about lowering the volume. Fewer tabs open, fewer obligations, more presence with what’s right in front of you.",
];

/* Zen playlists data */
const ZEN_PLAYLISTS = [
  {
    id: "37i9dQZF1DWZqd5JICZI0u",
    title: "Soft Cosmic Stillness",
    mood: "Deep Calm • Nervous System",
    description:
      "Slow, spacious textures to help your body unwind and your mind soften into meditation.",
  },
  {
    id: "37i9dQZF1DX3Ogo9pFvBkY",
    title: "Ambient Aura Field",
    mood: "Focus • Flow • Creative Work",
    description:
      "Gentle ambient soundscapes that support journaling, working, or quiet self-reflection.",
  },
  {
    id: "4iGAttKqCR2Jg9kl2cUiBq",
    title: "Starlit Healing Waves",
    mood: "Sleep • Rest • Recovery",
    description:
      "Atmospheric tones for evening wind-down, deep rest, and post-practice integration.",
  },
];

/* Small helper to format HealthKit sleep sample */
function formatSleepRange(sleep: any) {
  if (!sleep?.sample) return "No recent sleep";
  const start = new Date(sleep.sample.startDate);
  const end = new Date(sleep.sample.endDate);
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.round(diffMs / 1000 / 60 / 60);
  return `${hours}h sleep`;
}

/* ──────────────────────────────────────────────
 * HEALTH SCREEN
 * ────────────────────────────────────────────── */

function HealthScreen() {
  const { authStatus, requestAuthorization, steps, heartRate, hrv, sleep } =
    useFromWithinHealth();

  useEffect(() => {
    requestAuthorization().catch((err) => {
      console.warn("HealthKit auth error", err);
    });
  }, [requestAuthorization]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.screenPadding}>
        <Text style={styles.healthTitle}>FromWithin + Apple Health</Text>

        <Text style={styles.healthSubtitle}>
          HealthKit status: {authStatus ?? "unknown"}
        </Text>

        <TouchableOpacity
          onPress={() => requestAuthorization()}
          style={styles.healthButton}
        >
          <Text style={styles.healthButtonText}>Allow / Update permissions</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeading}>Latest body snapshot</Text>

        <Text style={styles.healthStat}>
          Steps:{" "}
          {steps?.sample?.quantity
            ? `${steps.sample.quantity} (${steps.sample.startDate.toString()})`
            : "no sample yet"}
        </Text>

        <Text style={styles.healthStat}>
          Heart rate:{" "}
          {heartRate?.sample?.quantity
            ? `${heartRate.sample.quantity} bpm`
            : "no sample yet"}
        </Text>

        <Text style={styles.healthStat}>
          HRV (SDNN):{" "}
          {hrv?.sample?.quantity ? `${hrv.sample.quantity} ms` : "no sample yet"}
        </Text>

        <Text style={[styles.healthStat, { marginTop: 12 }]}>
          Sleep sample:{" "}
          {sleep?.sample
            ? `${sleep.sample.startDate.toString()} → ${sleep.sample.endDate.toString()} (${formatSleepRange(
                sleep
              )})`
            : "no recent sleep sample"}
        </Text>

        <View style={{ marginTop: 32, marginBottom: 8 }}>
          <LegalLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────
 * TODAY SCREEN
 * ────────────────────────────────────────────── */

function TodayScreen() {
  const { requestAuthorization } = useFromWithinHealth();

  // 🔗 Wearable URLs now come from Expo config (app.json > extra.wearableConnect)

  const handleConnectWearable = async (id: string, label: string) => {
    try {
      // 🍎 Apple Health: handled directly with HealthKit
      if (id === "apple") {
        await requestAuthorization();
        Alert.alert(
          "Apple Health connected",
          "Your sleep, HRV, and movement data will now sync to FromWithin."
        );
        return;
      }
  
      // 🔗 All other wearable connections use Expo extra config
      await openWearableConnect(id as WearableId, label);
  
    } catch (err) {
      console.error(err);
      Alert.alert("Connection error", "Something went wrong connecting this wearable.");
    }
  };
  

  return (
    <SafeAreaView style={todayStyles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={todayStyles.scroll}
        contentContainerStyle={todayStyles.scrollContent}
      >
        {/* HEADER */}
        <Text style={todayStyles.kicker}>THURSDAY, NOV 20</Text>
        <Text style={todayStyles.headline}>Good morning.</Text>
        <Text style={todayStyles.subheadline}>
          A single, luxurious snapshot of your field right now — how you’re
          sleeping, what your energy is whispering, and the 3–4 things that
          actually matter today.
        </Text>

        {/* BODY SNAPSHOT + CONNECT WEARABLE */}
        <View style={todayStyles.card}>
          <View style={todayStyles.cardHeaderRow}>
            <Text style={todayStyles.cardTitle}>Body Snapshot</Text>
            <View style={todayStyles.vibePill}>
              <Text style={todayStyles.vibePillText}>
                ✨ Today’s vibe · Well-rested
              </Text>
            </View>
          </View>

          <View style={todayStyles.badgeRow}>
            <View style={todayStyles.badge}>
              <Text style={todayStyles.badgeLabel}>Sleep · 2025-11-20</Text>
            </View>
          </View>

          <View style={todayStyles.metricsRow}>
            <View style={todayStyles.metricChip}>
              <Text style={todayStyles.metricLabel}>6h 30m total</Text>
            </View>
            <View style={todayStyles.metricChip}>
              <Text style={todayStyles.metricLabel}>86% efficiency</Text>
            </View>
            <View style={todayStyles.metricChip}>
              <Text style={todayStyles.metricLabel}>HRV 45 ms</Text>
            </View>
          </View>

          <View style={todayStyles.metricsRow}>
            <View style={todayStyles.metricChip}>
              <Text style={todayStyles.metricLabel}>15% restlessness</Text>
            </View>
            <View style={todayStyles.metricChip}>
              <Text style={todayStyles.metricLabel}>Wakes: 2</Text>
            </View>
          </View>

          {/* CONNECT WEARABLE */}
          <View style={todayStyles.sectionSpacing}>
            <Text style={todayStyles.sectionLabel}>Connect wearable</Text>
            <Text style={todayStyles.sectionCaption}>
              Sync sleep, HRV & movement from your devices.
            </Text>

            <View style={todayStyles.wearableGrid}>
              {[
                {
                  id: "fitbit",
                  label: "Fitbit",
                  caption: "Steps · Sleep · Heart",
                },
                {
                  id: "oura",
                  label: "Oura",
                  caption: "Sleep · HRV · Readiness",
                },
                {
                  id: "googlefit",
                  label: "Google Fit",
                  caption: "Android steps & heart",
                },
                {
                  id: "samsung",
                  label: "Samsung Health",
                  caption: "Galaxy Watch · Android",
                },
                {
                  id: "apple",
                  label: "Apple Health",
                  caption: "iPhone · Apple Watch",
                },
                {
                  id: "garmin",
                  label: "Garmin",
                  caption: "Outdoor · Performance",
                },
              ].map((w) => (
                <TouchableOpacity
                  key={w.id}
                  style={todayStyles.wearablePill}
                  onPress={() => handleConnectWearable(w.id, w.label)}
                  activeOpacity={0.8}
                >
                  <View style={todayStyles.wearableIconBubble}>
                    <Text style={todayStyles.wearableIconText}>⌚️</Text>
                  </View>
                  <View style={todayStyles.wearableTextCol}>
                    <Text style={todayStyles.wearableLabel}>{w.label}</Text>
                    <Text style={todayStyles.wearableCaption}>
                      {w.caption}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={todayStyles.demoNote}>
              This snapshot uses demo data until a wearable is connected.
            </Text>
          </View>
        </View>

        {/* INSIGHT OF THE DAY */}
        <View style={todayStyles.card}>
          <View style={todayStyles.cardHeaderRow}>
            <Text style={todayStyles.cardTitle}>Insight of the Day</Text>
          </View>
          <Text style={todayStyles.bodyCopy}>
            Take a moment to close your eyes and notice the sensations in your
            body — where are you holding tension or ease? Reflect on how these
            physical cues might relate to your current emotional state and what
            they are telling you today.
          </Text>

          <View style={todayStyles.rowBetween}>
            <TouchableOpacity
              style={todayStyles.primaryButton}
              onPress={() =>
                Alert.alert(
                  "Journal inside FromWithin",
                  "In the mobile beta, journaling lives inside the app (not on the website). This button will open the in-app journal."
                )
              }
            >
              <Text style={todayStyles.primaryButtonText}>
                ✏️ Journal with this
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "New insight coming",
                  "Soon you’ll be able to refresh your insight directly in the app."
                )
              }
            >
              <Text style={todayStyles.linkText}>New insight</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MOVE & UNWIND */}
        <View style={todayStyles.card}>
          <Text style={todayStyles.cardTitle}>Move & Unwind</Text>
          <View style={todayStyles.practiceCard}>
            <Text style={todayStyles.practiceTitle}>
              3 Soft Sun Salutations
            </Text>
            <Text style={todayStyles.practiceBody}>
              Move slowly through 3 rounds of Sun Salutation A, matching each
              movement to your breath. Think fluid, not forceful.
            </Text>
            <View style={todayStyles.chipRow}>
              <Text style={todayStyles.chip}>~6 min</Text>
              <Text style={todayStyles.chip}>energize</Text>
              <Text style={todayStyles.chip}>flow</Text>
            </View>
          </View>
        </View>

        {/* BREATH & NERVOUS SYSTEM */}
        <View style={todayStyles.card}>
          <Text style={todayStyles.cardTitle}>Breath & Nervous System</Text>
          <View style={todayStyles.practiceCard}>
            <Text style={todayStyles.practiceTitle}>
              Coherent Breathing (5 in / 5 out)
            </Text>
            <Text style={todayStyles.practiceBody}>
              Inhale for 5 counts, exhale for 5 through the nose. Imagine your
              heart and breath moving in one smooth wave.
            </Text>
            <View style={todayStyles.chipRow}>
              <Text style={todayStyles.chip}>~5 min</Text>
              <Text style={todayStyles.chip}>steady</Text>
              <Text style={todayStyles.chip}>coherence</Text>
            </View>
          </View>
        </View>

        {/* NOURISH & SUPPORT – FOOD AS MEDICINE */}
        <View style={todayStyles.card}>
          <Text style={todayStyles.cardTitle}>Nourish & Support</Text>
          <View style={todayStyles.practiceCard}>
            <Text style={todayStyles.practiceTitle}>
              Simple Balanced Plate
            </Text>
            <Text style={todayStyles.practiceBody}>
              Pair greens, a whole grain, and a protein (beans, tofu, lentils).
              Avoid overcomplication — clarity loves simplicity. Food as
              medicine, one plate at a time.
            </Text>
            <View style={todayStyles.chipRow}>
              <Text style={todayStyles.chip}>food as medicine</Text>
              <Text style={todayStyles.chip}>gentle on system</Text>
            </View>
          </View>
        </View>

        {/* PLANT ALLIES · CRYSTALS & OILS */}
        <View style={todayStyles.card}>
          <Text style={todayStyles.cardTitle}>
            Plant Allies · Crystals & Oils
          </Text>

          <View style={todayStyles.practiceCard}>
            <Text style={todayStyles.practiceTitle}>Balancing Herbs</Text>
            <Text style={todayStyles.practiceBody}>
              Tulsi, chamomile, or rooibos — choose one and make it a small
              ritual. Smell the steam, take three slow breaths, then sip.
            </Text>
            <View style={todayStyles.chipRow}>
              <Text style={todayStyles.chip}>nervous system</Text>
              <Text style={todayStyles.chip}>grounding</Text>
            </View>
          </View>

          <View style={todayStyles.practiceCard}>
            <Text style={todayStyles.practiceTitle}>
              Essential Oils for Balance
            </Text>
            <Text style={todayStyles.practiceBody}>
              Try lavender, bergamot, or frankincense. Place a drop on your
              palms, rub gently, cup over your nose, and take three slow
              breaths. Or diffuse nearby while you journal or unwind.
            </Text>
            <View style={todayStyles.chipRow}>
              <Text style={todayStyles.chip}>essential oils</Text>
              <Text style={todayStyles.chip}>aromatherapy</Text>
              <Text style={todayStyles.chip}>nervous system</Text>
            </View>
          </View>
        </View>

        {/* MOMENTS OF ZEN – PLAYLISTS */}
        <View style={todayStyles.card}>
          <Text style={todayStyles.cardTitle}>Moments of Zen</Text>
          <Text style={todayStyles.sectionCaption}>
            Meditation & focus playlists to soak your nervous system in quiet,
            cosmic stillness.
          </Text>

          <View style={todayStyles.playlistRow}>
            {[
              {
                id: "soft-cosmic",
                title: "Soft Cosmic Stillness",
                tag: "Deep calm · Nervous system",
              },
              {
                id: "ambient-aura",
                title: "Ambient Aura Field",
                tag: "Focus · Flow · Creative work",
              },
              {
                id: "starlit-healing",
                title: "Starlit Healing Waves",
                tag: "Sleep · Rest · Recovery",
              },
            ].map((p) => (
              <View key={p.id} style={todayStyles.playlistCard}>
                <Text style={todayStyles.playlistTag}>{p.tag}</Text>
                <Text style={todayStyles.playlistTitle}>{p.title}</Text>
                <TouchableOpacity
                  style={todayStyles.playButton}
                  onPress={() =>
                    Alert.alert(
                      "Opens in Spotify",
                      "On mobile, playlists will open in Spotify without leaving your FromWithin session."
                    )
                  }
                >
                  <Text style={todayStyles.playButtonText}>
                    Play on Spotify
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* BOTTOM CTA ROW */}
        <View style={todayStyles.bottomCtaRow}>
          <TouchableOpacity
            style={todayStyles.bottomCta}
            onPress={() =>
              Alert.alert(
                "Full Morning Ritual",
                "This will open the full Morning Ritual flow inside the app in a later build."
              )
            }
          >
            <Text style={todayStyles.bottomCtaText}>☀️ Full Morning Ritual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={todayStyles.bottomCta}
            onPress={() =>
              Alert.alert(
                "Body Insights & Chakra Plan",
                "Soon this will open your personalized body insights & chakra plan inside FromWithin."
              )
            }
          >
            <Text style={todayStyles.bottomCtaText}>
              💜 Body Insights & Chakra Plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={todayStyles.bottomCta}
            onPress={() =>
              Alert.alert(
                "Monthly Cosmic Flow",
                "This will open the monthly cosmic flow view directly in the app."
              )
            }
          >
            <Text style={todayStyles.bottomCtaText}>
              🌙 Monthly Cosmic Flow
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tiny spacer so LegalLinks isn’t cramped */}
        <View style={{ height: 24 }} />

{/* 🎧 Spotify Playlists */}
<ZenPlaylistsMobile />


      </ScrollView>

      {/* TERMS + PRIVACY INSIDE THE APP */}
      <LegalLinks />
    </SafeAreaView>
  );
}


/* ──────────────────────────────────────────────
 * MORNING SCREEN
 * ────────────────────────────────────────────── */

function MorningScreen() {
  const sleep = useMockSleep();
  const vibe = useMemo(() => getMorningVibe(sleep), [sleep]);
  const plan = useMemo(() => buildMorningPlan(sleep), [sleep]);

  const todayStr = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.screenPadding}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.heroLabel}>Morning Ritual • {todayStr}</Text>
          <Text style={styles.heroTitle}>{greetingNow()}</Text>
          <Text style={styles.heroSub}>
            Based on how you slept, we’ve woven stretches, breath, meditation,
            nourishment, crystals and plant allies to meet you where you
            actually are.
          </Text>

          <View style={styles.vibeChip}>
            <Text style={styles.vibeChipText}>
              Today’s Vibe · {vibe.label}
            </Text>
          </View>
          <Text style={styles.vibeTagline}>{vibe.tagline}</Text>
        </View>

        {/* Sleep metrics */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Sleep Summary</Text>
            <Text style={styles.cardHint}>{sleep.date}</Text>
          </View>
          <Text style={styles.chipRowText}>
            {minutesToHMM(sleep.durationMin)} total ·{" "}
            {sleep.efficiencyPct}% efficiency · HRV{" "}
            {sleep.hrvMs ? `${sleep.hrvMs} ms` : "—"} · Restlessness{" "}
            {sleep.restlessnessPct ?? 0}% · Wakes {sleep.wakeEvents ?? 0}
          </Text>
          <Text style={styles.footerNote}>
            This is mock data for now. Once a wearable is connected, your actual
            sleep will shape this ritual.
          </Text>
        </View>

        {/* Morning sections */}
        <View style={styles.grid2}>
          <TodaySection title="Body Stretches" items={plan.stretches} />
          <TodaySection title="Breathwork" items={plan.breathwork} />
          <TodaySection title="Meditations" items={plan.meditations} />
          <TodaySection title="Breakfast & Hydration" items={plan.breakfast} />
          <TodaySection title="Crystals to Carry" items={plan.crystals} />
          <TodaySection
            title="Plant Allies · Herbs & Oils"
            items={plan.plantAllies}
          />
        </View>

        <View style={{ marginTop: 32, marginBottom: 8 }}>
          <LegalLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────
 * GUIDE SCREEN
 * ────────────────────────────────────────────── */

function GuideScreen() {
  const openMentor = () => {
    const base = "https://fromwithinapp.com";
    Linking.openURL(`${base}/mentor`).catch(() => {});
  };

  const openTarot = () => {
    const base = "https://fromwithinapp.com";
    Linking.openURL(`${base}/tarot`).catch(() => {});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.screenPadding}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.heroLabel}>Guidance</Text>
          <Text style={styles.heroTitle}>Guide</Text>
          <Text style={styles.heroSub}>
            One sanctuary for your FromWithin mentor and tarot. Ask questions,
            receive reflections, and let your inner coach speak.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Guidance Portal</Text>
          <Text style={styles.heroSub}>
            Choose how you want to connect. These flows will gradually deepen as
            the native app grows.
          </Text>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>☪︎ Mentor</Text>
            <Text style={styles.recItemBlurb}>
              Chat with your spiritual guide for grounding and clarity. Bring
              questions about energy, relationships, or the next right step.
            </Text>
            <TouchableOpacity
              onPress={openMentor}
              style={styles.primaryPillButton}
            >
              <Text style={styles.primaryPillButtonText}>Open Mentor</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>Tarot</Text>
            <Text style={styles.recItemBlurb}>
              Draw cards, explore spreads, and mirror your inner world. A visual
              language for what your energy already knows.
            </Text>
            <TouchableOpacity
              onPress={openTarot}
              style={styles.primaryPillButton}
            >
              <Text style={styles.primaryPillButtonText}>Open Tarot</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 32, marginBottom: 8 }}>
          <LegalLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────
 * INSIGHTS SCREEN
 * ────────────────────────────────────────────── */

function InsightsScreen() {
  const todayStr = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.screenPadding}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.heroLabel}>Body Insights</Text>
          <Text style={styles.heroTitle}>Your Field Today · {todayStr}</Text>
          <Text style={styles.heroSub}>
            A luxury check-in for your body, chakras, and nervous system —
            translated into tiny, livable adjustments instead of perfection
            projects.
          </Text>
        </View>

        {/* Insight of the moment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Insight of the Moment</Text>
          <Text style={styles.heroSub}>
            AI-assisted, but always in service of your inner voice. The native
            app will gradually plug into your full AI engine.
          </Text>
          <Text style={styles.insightText}>
            Try this: close your eyes for three breaths and scan from feet to
            crown. Where does your body whisper the loudest right now? Start
            with one small adjustment there.
          </Text>
        </View>

        {/* Chakra body map */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chakra Body Map</Text>
          <Text style={styles.heroSub}>
            Use this as a menu, not a to-do list. Start where your body is
            already talking. Notice where you feel heavy, tight, buzzy, or numb.
          </Text>

          {CHAKRAS.map((c) => (
            <View key={c.id} style={styles.recItem}>
              <Text style={styles.recItemTitle}>
                {c.name} · {c.sanskrit}
              </Text>
              <Text style={styles.recItemSubtitle}>{c.qualities}</Text>
              <Text style={styles.recItemBlurb}>
                <Text style={{ fontWeight: "600" }}>Body focus: </Text>
                {c.bodyFocus}
              </Text>
              <Text style={[styles.recItemBlurb, { marginTop: 4 }]}>
                {c.ritual}
              </Text>
            </View>
          ))}

          <Text style={styles.footerNote}>
            Educational, not medical advice. Always listen to your care team and
            your own body.
          </Text>
        </View>

        <View style={{ marginTop: 32, marginBottom: 8 }}>
          <LegalLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────
 * COMMUNITY SCREEN
 * ────────────────────────────────────────────── */

function CommunityScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 80,
        }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.heroLabel}>Together</Text>
          <Text style={styles.heroTitle}>Community</Text>
          <Text style={styles.heroSub}>
            Your circle of support, love, and light — share updates, post
            gatherings, and offer energy exchanges.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#020617",
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: "#1f2937",
          }}
        >
          <Text
            style={{
              color: "#e5e7eb",
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Community · Classes · Energy Exchange
          </Text>
          <Text
            style={{
              color: "#cbd5f5",
              fontSize: 13,
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            Share photos, spiritual reflections, and progress updates with your
            FromWithin circle. Mobile posting and comments will land in a later
            release.
          </Text>

          <View
            style={{
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#1f2937",
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#e5e7eb",
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 6,
              }}
            >
              Feed
            </Text>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 12,
              }}
            >
              No posts yet. Once the community opens, this will become a live
              feed of photos, videos, and updates.
            </Text>
          </View>

          <View
            style={{
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#1f2937",
              padding: 12,
            }}
          >
            <Text
              style={{
                color: "#e5e7eb",
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 6,
              }}
            >
              Upload photo or video
            </Text>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              Drag & drop doesn’t exist on mobile, but you’ll soon be able to
              choose a file from your camera roll.
            </Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "Community posting will be available in a future update."
                )
              }
              style={styles.primaryPillButton}
            >
              <Text style={styles.primaryPillButtonText}>Choose from photos</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 32, marginBottom: 8 }}>
          <LegalLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────
 * STUDIO SCREEN
 * ────────────────────────────────────────────── */

function StudioScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.screenPadding}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.heroLabel}>Playground</Text>
          <Text style={styles.heroTitle}>Studio</Text>
          <Text style={styles.heroSub}>
            Play, learn, and create with energy tools — tarot, aura, crystal
            grids, and more.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Energy Tools</Text>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>Aura Portraits</Text>
            <Text style={styles.recItemBlurb}>
              Capture symbolic aura images, then pair them with sound and
              prompts to decode what your field is holding.
            </Text>
          </View>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>Crystal Grids</Text>
            <Text style={styles.recItemBlurb}>
              Lay out digital or physical grids, then log where you place
              stones on your body or mat. The app reflects back themes and
              patterns over time.
            </Text>
          </View>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>Tarot & Oracle</Text>
            <Text style={styles.recItemBlurb}>
              Draw spreads, journal with your cards, and let AI help you find
              language for what you already feel.
            </Text>
          </View>

          <Text style={styles.footerNote}>
            These Studio tools will arrive in phases. For beta, Studio acts as a
            preview of what’s coming in the FromWithin ecosystem.
          </Text>
        </View>

        <View style={{ marginTop: 32, marginBottom: 8 }}>
          <LegalLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────
 * FEEDBACK SCREEN
 * ────────────────────────────────────────────── */

type FeedbackType = "bug" | "ux" | "feature" | "other" | null;

function FeedbackScreen() {
  const [type, setType] = useState<FeedbackType>(null);
  const [where, setWhere] = useState("");
  const [what, setWhat] = useState("");
  const [email, setEmail] = useState("");

  const sendFeedback = () => {
    Alert.alert(
      "Thank you",
      "Your beta feedback form will soon send directly from the app. For now, this is a preview of the in-app flow."
    );
  };

  const typeLabel = (t: FeedbackType) => {
    switch (t) {
      case "bug":
        return "Bug / broken";
      case "ux":
        return "Confusing UX";
      case "feature":
        return "✨ Feature idea";
      case "other":
        return "Other";
      default:
        return "";
    }
  };

  const typeOptions: FeedbackType[] = ["bug", "ux", "feature", "other"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.screenPadding}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.heroLabel}>Beta</Text>
          <Text style={styles.heroTitle}>Beta Feedback</Text>
          <Text style={styles.heroSub}>
            Thank you for helping shape FromWithin. Use this any time you hit a
            bug, something feels confusing, or you have an idea.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What are you sharing?</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 8,
              marginBottom: 12,
            }}
          >
            {typeOptions.map((opt) => {
              const selected = type === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setType(opt)}
                  style={[
                    styles.miniChip,
                    {
                      borderColor: selected ? "#a855f7" : "#4b5563",
                      backgroundColor: selected
                        ? "rgba(168,85,247,0.25)"
                        : "#020617",
                      marginBottom: 6,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.miniChipText,
                      { color: selected ? "#f9fafb" : "#e5e7eb" },
                    ]}
                  >
                    {typeLabel(opt)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.cardTitle}>Where were you in the app?</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Today, Insights, Community, Studio, Health..."
            placeholderTextColor="#6b7280"
            value={where}
            onChangeText={setWhere}
          />

          <Text style={[styles.cardTitle, { marginTop: 12 }]}>
            What happened?
          </Text>
          <TextInput
            style={[styles.feedbackInput, { height: 120 }]}
            placeholder="What were you trying to do, and what happened instead?"
            placeholderTextColor="#6b7280"
            value={what}
            onChangeText={setWhat}
            multiline
            textAlignVertical="top"
          />

          <Text style={[styles.cardTitle, { marginTop: 12 }]}>
            Email (optional)
          </Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="If you’d like a follow-up, leave your email."
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={sendFeedback}
            style={[styles.primaryPillButton, { marginTop: 16 }]}
          >
            <Text style={styles.primaryPillButtonText}>Submit feedback</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            For now, this screen is a preview. During beta, feedback will be
            sent straight to the FromWithin team.
          </Text>
        </View>

        <View style={{ marginTop: 32, marginBottom: 8 }}>
          <LegalLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────
 * SHARED SECTION COMPONENT
 * ────────────────────────────────────────────── */

type TodaySectionProps = {
  title: string;
  items: RecItem[];
  footerNote?: string;
};

function TodaySection({ title, items, footerNote }: TodaySectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      {items.map((item) => (
        <View key={item.id} style={styles.recItem}>
          <Text style={styles.recItemTitle}>{item.title}</Text>
          {item.subtitle ? (
            <Text style={styles.recItemSubtitle}>{item.subtitle}</Text>
          ) : null}
          <Text style={styles.recItemBlurb}>{item.blurb}</Text>
          {item.minutes ? (
            <Text style={styles.footerNote}>{item.minutes} min</Text>
          ) : null}
          {item.tags && item.tags.length > 0 ? (
            <Text style={styles.chipRowText}>
              {item.tags.map((t) => `#${t}`).join("  ")}
            </Text>
          ) : null}
        </View>
      ))}

      {footerNote ? (
        <Text style={[styles.footerNote, { marginTop: 8 }]}>{footerNote}</Text>
      ) : null}
    </View>
  );
}

/* ──────────────────────────────────────────────
 * ROOT APP + NAV
 * ────────────────────────────────────────────── */

const Tab = createBottomTabNavigator();

const todayStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050715",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  kicker: {
    color: "#7b8ac9",
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headline: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "600",
  },
  subheadline: {
    color: "#cbd5ff",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#070b1d",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1b2440",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#f9fbff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  vibePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#0b1f1a",
    borderWidth: 1,
    borderColor: "#2bb39a",
  },
  vibePillText: {
    color: "#b4f5e7",
    fontSize: 11,
    fontWeight: "500",
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#0b1120",
    borderWidth: 1,
    borderColor: "#27345a",
  },
  badgeLabel: {
    color: "#cbd5ff",
    fontSize: 11,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  metricChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#050816",
    borderWidth: 1,
    borderColor: "#2b375f",
  },
  metricLabel: {
    color: "#e2e8ff",
    fontSize: 11,
  },
  sectionSpacing: {
    marginTop: 18,
  },
  sectionLabel: {
    color: "#9fa8ff",
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionCaption: {
    color: "#a3b0de",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  wearableGrid: {
    marginTop: 4,
    gap: 10,
  },
  wearablePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#050816",
    borderWidth: 1,
    borderColor: "#27345a",
  },
  wearableIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121a33",
    marginRight: 10,
  },
  wearableIconText: {
    fontSize: 18,
  },
  wearableTextCol: {
    flex: 1,
  },
  wearableLabel: {
    color: "#f9fbff",
    fontSize: 13,
    fontWeight: "500",
  },
  wearableCaption: {
    color: "#9fa8ff",
    fontSize: 11,
  },
  demoNote: {
    color: "#6b7280",
    fontSize: 11,
    marginTop: 10,
  },
  bodyCopy: {
    color: "#d2dcff",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#4f46e5",
  },
  primaryButtonText: {
    color: "#e5e7ff",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  linkText: {
    color: "#9ca3ff",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  practiceCard: {
    marginTop: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#050816",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  practiceTitle: {
    color: "#f9fbff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  practiceBody: {
    color: "#cbd5ff",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#020617",
    color: "#cbd5ff",
    fontSize: 11,
  },
  playlistRow: {
    marginTop: 10,
    gap: 10,
  },
  playlistCard: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#050816",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  playlistTag: {
    color: "#9fa8ff",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  playlistTitle: {
    color: "#f9fbff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  playButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4f46e5",
  },
  playButtonText: {
    color: "#c4c6ff",
    fontSize: 12,
  },
  bottomCtaRow: {
    marginTop: 4,
    marginBottom: 8,
    gap: 10,
  },
  bottomCta: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#050816",
    borderWidth: 1,
    borderColor: "#27345a",
  },
  bottomCtaText: {
    color: "#e2e8ff",
    fontSize: 13,
    textAlign: "center",
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const icon = (() => {
            switch (route.name) {
              case "Today":
                return "☀️";
              case "Guide":
                return "🜃";
              case "Insights":
                return "﹏";
              case "Community":
                return "ૐ";
              case "Studio":
                return "𓁿";
              case "Feedback":
                return "🧪";
            }
          })();
          return {
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#020617",
              borderTopColor: "#111827",
              borderTopWidth: 1,
              paddingBottom: 4,
              paddingTop: 4,
              height: 62,
            },
            tabBarActiveTintColor: "#f9fafb",
            tabBarInactiveTintColor: "#6b7280",
            tabBarLabelStyle: {
              fontSize: 11,
            },
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 18 }}>{icon}</Text>
            ),
          };
        }}
      >
        <Tab.Screen name="Today" component={TodayScreen} />
        <Tab.Screen name="Guide" component={GuideScreen} />
        <Tab.Screen name="Insights" component={InsightsScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Studio" component={StudioScreen} />
        <Tab.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{ title: "Beta" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/* ──────────────────────────────────────────────
 * STYLES
 * ────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screenPadding: {
    padding: 20,
    paddingBottom: 80,
  },

  /* Headings / hero */
  heroLabel: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#f9fafb",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  heroSub: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 20,
  },

  /* Vibe chip */
  vibeChip: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "rgba(168,85,247,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  vibeChipText: {
    color: "#f9fafb",
    fontSize: 12,
    fontWeight: "500",
  },
  vibeTagline: {
    color: "#e5e7eb",
    fontSize: 13,
    marginTop: 6,
  },

  /* Cards */
  card: {
    backgroundColor: "#020617",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "600",
  },
  cardHint: {
    color: "#9ca3af",
    fontSize: 12,
  },

  chipRowText: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },

  /* Health screen */
  healthTitle: {
    color: "#f9fafb",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  healthSubtitle: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 12,
  },
  healthButton: {
    backgroundColor: "#a855f7",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  healthButtonText: {
    color: "#f9fafb",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionHeading: {
    color: "#e5e7eb",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  healthStat: {
    color: "#d1d5db",
    fontSize: 13,
    marginTop: 4,
  },

  /* Connect wearable */
  connectCard: {
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
    padding: 12,
    backgroundColor: "#020617",
  },
  connectTitle: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  connectSubtitle: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 10,
  },
  wearablesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  wearablePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4b5563",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  wearablePillText: {
    color: "#e5e7eb",
    fontSize: 12,
  },
  connectFooter: {
    color: "#6b7280",
    fontSize: 11,
    marginTop: 4,
  },

  /* Insight of the day */
  insightText: {
    color: "#e5e7eb",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  primaryPillButton: {
    backgroundColor: "#a855f7",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryPillButtonText: {
    color: "#f9fafb",
    fontSize: 13,
    fontWeight: "600",
  },
  linkText: {
    color: "#c4b5fd",
    fontSize: 13,
  },

  /* Grid */
  grid2: {
    gap: 12,
  },

  /* Zen playlists */
  zenCard: {
    backgroundColor: "#020617",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 16,
  },
  zenLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  zenTitle: {
    color: "#f9fafb",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  zenSubtitle: {
    color: "#d1d5db",
    fontSize: 13,
    marginBottom: 12,
  },
  zenGrid: {
    gap: 10,
  },
  zenItem: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
    padding: 12,
  },
  zenMood: {
    color: "#a5b4fc",
    fontSize: 11,
    marginBottom: 2,
  },
  zenItemTitle: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  zenItemDescription: {
    color: "#d1d5db",
    fontSize: 12,
    marginBottom: 8,
  },
  zenPlayLabel: {
    color: "#c4b5fd",
    fontSize: 12,
  },
  zenRequires: {
    color: "#6b7280",
    fontSize: 11,
  },

  /* Quick links */
  quickLinksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  quickLink: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4b5563",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickLinkText: {
    color: "#e5e7eb",
    fontSize: 12,
  },

  /* Reusable rec item */
  recItem: {
    marginTop: 8,
    paddingTop: 4,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#111827",
  },
  recItemTitle: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
  },
  recItemSubtitle: {
    color: "#a5b4fc",
    fontSize: 12,
    marginBottom: 2,
  },
  recItemBlurb: {
    color: "#d1d5db",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },

  footerNote: {
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 8,
  },

  /* Feedback */
  miniChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
  },
  miniChipText: {
    fontSize: 12,
  },
  feedbackInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#f9fafb",
    fontSize: 13,
    marginTop: 6,
  },
});

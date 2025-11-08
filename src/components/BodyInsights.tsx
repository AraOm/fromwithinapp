import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Apple, Gem, Activity, Zap } from "lucide-react";

interface Recommendation {
  type: "food" | "crystal" | "yoga" | "reiki" | "mantra";
  title: string;
  description: string;
  chakra?: string;
  icon: string;
}

/* ──────────────────────────────────────────────────────────────
   Glow Pill Button (matches “open” gradient glow vibe)
   ────────────────────────────────────────────────────────────── */

type GlowMoodButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

function GlowMoodButton({ active, label, onClick }: GlowMoodButtonProps) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30 transition
      ${active ? "opacity-100 scale-[1.02]" : "opacity-70 hover:opacity-100 hover:scale-[1.01]"}`}
    >
      <Button
        type="button"
        onClick={onClick}
        variant="ghost"
        className={`rounded-full px-4 py-1.5 text-xs md:text-sm font-medium 
        bg-slate-950/95 text-slate-50 shadow-inner shadow-slate-900/60
        transition-colors
        ${active ? "bg-slate-900" : "bg-slate-950/80"}`}
      >
        {label}
      </Button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────── */

const BodyInsights: React.FC = () => {
  const [currentMood, setCurrentMood] = useState("balanced");
  const [heartRate, setHeartRate] = useState(72);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    generateRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMood, heartRate]);

  const generateRecommendations = () => {
    const recs: Recommendation[] = [];

    // Food recommendations
    if (currentMood === "anxious") {
      recs.push({
        type: "food",
        title: "Chamomile Tea & Almonds",
        description:
          "Calming herbs and magnesium-rich nuts to soothe your nervous system.",
        chakra: "Heart",
        icon: "🍵",
      });
    } else if (currentMood === "tired") {
      recs.push({
        type: "food",
        title: "Golden Turmeric Latte",
        description:
          "Anti-inflammatory spices to boost energy and solar plexus chakra.",
        chakra: "Solar Plexus",
        icon: "☕",
      });
    }

    // Crystal recommendations
    if (heartRate > 80) {
      recs.push({
        type: "crystal",
        title: "Amethyst & Rose Quartz",
        description: "Place over heart to calm elevated energy and promote peace.",
        chakra: "Heart",
        icon: "💎",
      });
    } else {
      recs.push({
        type: "crystal",
        title: "Citrine & Tiger's Eye",
        description: "Energizing stones to boost confidence and personal power.",
        chakra: "Solar Plexus",
        icon: "🔶",
      });
    }

    // Yoga recommendations
    recs.push({
      type: "yoga",
      title: "Hip Opening Flow",
      description:
        "Release stored emotions with pigeon pose and butterfly stretch.",
      chakra: "Sacral",
      icon: "🧘‍♀️",
    });

    // Reiki symbols
    recs.push({
      type: "reiki",
      title: "Cho Ku Rei Symbol",
      description: "Draw this power symbol to amplify healing energy.",
      icon: "🔮",
    });

    // Mantras
    recs.push({
      type: "mantra",
      title: "I Am Grounded & Safe",
      description: "Repeat 108 times to activate root chakra stability.",
      chakra: "Root",
      icon: "📿",
    });

    setRecommendations(recs);
  };

  const moodOptions = [
    { value: "anxious", label: "Anxious" },
    { value: "tired", label: "Tired" },
    { value: "balanced", label: "Balanced" },
    { value: "energetic", label: "Energetic" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "food":
        return <Apple className="h-4 w-4 text-emerald-200" />;
      case "crystal":
        return <Gem className="h-4 w-4 text-fuchsia-200" />;
      case "yoga":
        return <Activity className="h-4 w-4 text-sky-200" />;
      case "reiki":
        return <Zap className="h-4 w-4 text-amber-200" />;
      case "mantra":
        return <Heart className="h-4 w-4 text-rose-200" />;
      default:
        return <Heart className="h-4 w-4 text-slate-200" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        {/* Header (match Play page structure) */}
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Biometrics
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Body Insights
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Personalized guidance from your heart rate, mood, and subtle body
              — translated into food, crystals, movement, and mantra.
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Body · Breath · Energy
            </p>
          </div>
        </header>

        {/* Current Status */}
        <Card className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl">
          {/* Soft glows */}
          <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative z-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-50">
                <Heart className="h-5 w-5 text-rose-300" />
                Current Energy Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-50">
                    {heartRate} BPM
                  </div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    Heart Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-50">7.2 Hz</div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    Brainwave (Alpha)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-50">85%</div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    HRV Score
                  </div>
                </div>
              </div>

              {/* Mood buttons – all are “open” gradient glow buttons */}
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Current Mood
                </p>
                <div className="flex flex-wrap gap-3">
                  {moodOptions.map((mood) => (
                    <GlowMoodButton
                      key={mood.value}
                      label={mood.label}
                      active={currentMood === mood.value}
                      onClick={() => setCurrentMood(mood.value)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Recommendations grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((rec, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl transition hover:border-violet-500/60 hover:bg-slate-900/90"
            >
              {/* Soft colored glows per type */}
              <div
                className={`pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full blur-3xl
                ${
                  rec.type === "food"
                    ? "bg-emerald-500/10"
                    : rec.type === "crystal"
                    ? "bg-fuchsia-500/10"
                    : rec.type === "yoga"
                    ? "bg-sky-500/10"
                    : rec.type === "reiki"
                    ? "bg-amber-500/10"
                    : "bg-rose-500/10"
                }`}
              />
              <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

              <div className="relative z-10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-50">
                    <div className="rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950">
                        {getTypeIcon(rec.type)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{rec.icon}</span>
                      <span>{rec.title}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-slate-300">
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {rec.chakra && (
                      <Badge
                        variant="secondary"
                        className="bg-slate-800/80 text-xs font-medium text-slate-100"
                      >
                        {rec.chakra} Chakra
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize border-slate-600/70 bg-slate-900/60 text-slate-100`}
                    >
                      {rec.type}
                    </Badge>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Biometric Integration */}
        <Card className="relative mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl">
          <div className="pointer-events-none absolute -left-12 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative z-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-50">
                <Activity className="h-5 w-5 text-emerald-300" />
                📱 Wearable Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 p-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-50">
                      Apple Watch Connected
                    </div>
                    <div className="text-xs text-slate-400">
                      Syncing HRV & heart rate.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 p-3">
                  <div className="h-3 w-3 rounded-full bg-sky-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-50">
                      Oura Ring Detected
                    </div>
                    <div className="text-xs text-slate-400">
                      Sleep & recovery data.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BodyInsights;

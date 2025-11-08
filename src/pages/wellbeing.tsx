import React, { useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";

type FoodItem = {
  id: string;
  kind: "Meal" | "Snack" | "Juice" | "Remedy";
  text: string;
};

type AreaKey =
  | "Jaw"
  | "Neck & Shoulders"
  | "Chest"
  | "Upper Back"
  | "Lower Back"
  | "Belly"
  | "Hips"
  | "Knees"
  | "Feet"
  | "Head";

type Chakra =
  | "Root"
  | "Sacral"
  | "Solar Plexus"
  | "Heart"
  | "Throat"
  | "Third Eye"
  | "Crown";

const BODY_AREAS: AreaKey[] = [
  "Jaw",
  "Neck & Shoulders",
  "Chest",
  "Upper Back",
  "Lower Back",
  "Belly",
  "Hips",
  "Knees",
  "Feet",
  "Head",
];

const AREA_TO_CHAKRAS: Record<AreaKey, Chakra[]> = {
  Jaw: ["Throat"],
  "Neck & Shoulders": ["Throat", "Heart"],
  Chest: ["Heart"],
  "Upper Back": ["Heart"],
  "Lower Back": ["Root"],
  Belly: ["Solar Plexus"],
  Hips: ["Sacral", "Root"],
  Knees: ["Root"],
  Feet: ["Root"],
  Head: ["Crown", "Third Eye"],
};

const AREA_PRACTICES: Record<
  AreaKey,
  { stretches: string[]; breath: string[]; micros: string[] }
> = {
  Jaw: {
    stretches: ["Gentle jaw release", "Neck side stretch", "Lion’s breath stretch"],
    breath: ["Box breathing 4-4-4-4", "Soft ujjayi (3 min)"],
    micros: ["Unclench jaw cue", "Tongue drop from palate"],
  },
  "Neck & Shoulders": {
    stretches: ["Thread the needle", "Eagle arms", "Neck rolls (slow)"],
    breath: ["4-7-8 x 3 rounds", "Longer exhales (1:2)"],
    micros: ["Shoulder shrug & drop", "Phone-at-eye-level cue"],
  },
  Chest: {
    stretches: ["Supported fish", "Doorway pec stretch", "Sphinx pose"],
    breath: ["Heart-focused breathing (HeartMath)", "Coherent breath (5s in/5s out)"],
    micros: ["1-minute gratitude pause", "Open posture reset"],
  },
  "Upper Back": {
    stretches: ["Cat–cow", "Child’s pose", "Thoracic twists"],
    breath: ["Back-body breathing", "Humming exhale (vagal)"],
    micros: ["Posture check", "10 shoulder blade squeezes"],
  },
  "Lower Back": {
    stretches: ["Knees-to-chest", "Supine twist", "Figure 4 stretch"],
    breath: ["Belly breathing (hands-on-belly)", "3-part yogic breath"],
    micros: ["Hip hinge cue", "Stand & sway 30s"],
  },
  Belly: {
    stretches: ["Sphinx pose", "Gentle cobra", "Seated side bend"],
    breath: ["Kapalabhati (light) if energized", "Slow diaphragmatic breath"],
    micros: ["Relax belly cue", "Warm tea break"],
  },
  Hips: {
    stretches: ["Lizard lunge", "Pigeon (supported)", "Butterfly fold"],
    breath: ["Box breathing", "Square breath 4-4-4-4"],
    micros: ["90-second hip opener", "Walk 2–3 min"],
  },
  Knees: {
    stretches: ["Hamstring floss", "Quad stretch", "Calf stretch on wall"],
    breath: ["Relaxed nasal breathing", "4-4 cadence"],
    micros: ["Microbend cue", "Foot tripod awareness"],
  },
  Feet: {
    stretches: ["Toe squat (gentle)", "Ankle circles", "Calf release"],
    breath: ["Steady nasal breath", "1:1 calm rhythm"],
    micros: ["Barefoot ground contact", "Tennis ball foot roll"],
  },
  Head: {
    stretches: ["Suboccipital release", "Seated forward fold with strap"],
    breath: ["Humming exhale", "Alternate nostril (no holds)"],
    micros: ["Screen-break 20-20-20", "Eye softening"],
  },
};

const CHAKRA_CRYSTALS: Record<
  Chakra,
  { crystals: string[]; placement: string }
> = {
  Root: {
    crystals: ["Red Jasper", "Hematite", "Smoky Quartz"],
    placement: "Base of spine, hips, or in pocket during walks.",
  },
  Sacral: {
    crystals: ["Carnelian", "Orange Calcite", "Moonstone"],
    placement: "Lower belly/hip area; place on sacrum in rest.",
  },
  "Solar Plexus": {
    crystals: ["Citrine", "Tiger’s Eye", "Pyrite"],
    placement: "Upper abdomen; rest during breathwork.",
  },
  Heart: {
    crystals: ["Rose Quartz", "Green Aventurine", "Malachite"],
    placement: "Center of chest; hold during coherent breathing.",
  },
  Throat: {
    crystals: ["Blue Lace Agate", "Aquamarine", "Sodalite"],
    placement: "Collarbone/throat area; wear as pendant.",
  },
  "Third Eye": {
    crystals: ["Amethyst", "Lapis Lazuli", "Sodalite"],
    placement: "Between eyebrows while resting (few minutes).",
  },
  Crown: {
    crystals: ["Clear Quartz", "Selenite", "Amethyst"],
    placement: "Above head on pillow edge during meditation.",
  },
};

export default function WellbeingPage() {
  // Food as Medicine (in-memory demo)
  const [kind, setKind] = useState<FoodItem["kind"]>("Meal");
  const [text, setText] = useState("");
  const [items, setItems] = useState<FoodItem[]>([]);

  // Body Tension Mapping
  const [selectedAreas, setSelectedAreas] = useState<AreaKey[]>([]);

  const toggleArea = (a: AreaKey) =>
    setSelectedAreas((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const selectedChakras: Chakra[] = useMemo(() => {
    const set = new Set<Chakra>();
    selectedAreas.forEach((a) => AREA_TO_CHAKRAS[a].forEach((c) => set.add(c)));
    return Array.from(set);
  }, [selectedAreas]);

  const practices = useMemo(() => {
    const coll = { stretches: new Set<string>(), breath: new Set<string>(), micros: new Set<string>() };
    selectedAreas.forEach((a) => {
      AREA_PRACTICES[a].stretches.forEach((s) => coll.stretches.add(s));
      AREA_PRACTICES[a].breath.forEach((b) => coll.breath.add(b));
      AREA_PRACTICES[a].micros.forEach((m) => coll.micros.add(m));
    });
    return {
      stretches: Array.from(coll.stretches),
      breath: Array.from(coll.breath),
      micros: Array.from(coll.micros),
    };
  }, [selectedAreas]);

  // Simple 14-day plan from chosen areas
  const [plan, setPlan] = useState<{ day: number; focus: AreaKey; practice: string }[]>([]);
  const buildPlan = () => {
    const areas = selectedAreas.length ? selectedAreas : (["Hips", "Lower Back"] as AreaKey[]);
    const picks: AreaKey[] = areas.slice(0, 2);
    const out: { day: number; focus: AreaKey; practice: string }[] = [];
    for (let d = 1; d <= 14; d++) {
      const focus = picks[(d - 1) % picks.length];
      const s = AREA_PRACTICES[focus].stretches;
      const b = AREA_PRACTICES[focus].breath;
      const m = AREA_PRACTICES[focus].micros;
      const pool = [...s, ...b, ...m];
      out.push({
        day: d,
        focus,
        practice: pool[(d - 1) % pool.length],
      });
    }
    setPlan(out);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setItems((prev) => [{ id: String(Date.now()), kind, text: t }, ...prev]);
    setText("");
  };
  const del = (id: string) => setItems((p) => p.filter((x) => x.id !== id));

  return (
    <AppLayout>
      <h1 className="sr-only">Body Insights</h1>

      <section className="space-y-10">
        {/* ===== Header & Core Engine Note ===== */}
        <div>
          <h2 className="text-2xl font-semibold">Body Insights</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Your mind–body patterns and supportive practices.
          </p>
          <p className="mt-3 text-sm text-neutral-600">
            <span className="font-medium">Core engine:</span> real-time body &amp; energy guidance from your inputs.
          </p>
        </div>

        {/* ===== Body Tension Mapping ===== */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Body Tension Mapping</h3>
          <p className="text-neutral-600 text-sm">
            Tap areas where you felt tension; we’ll suggest stretches, breathwork, and micro-practices.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BODY_AREAS.map((a) => {
              const active = selectedAreas.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleArea(a)}
                  className={`rounded-2xl px-3 py-2 text-sm border transition ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 hover:bg-black/5"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>

          {selectedAreas.length > 0 && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-neutral-200 p-4">
                <div className="font-medium mb-2">Stretches</div>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  {practices.stretches.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-neutral-200 p-4">
                <div className="font-medium mb-2">Breathwork</div>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  {practices.breath.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-neutral-200 p-4">
                <div className="font-medium mb-2">Micro-practices</div>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  {practices.micros.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ===== Energy Insights (AI placeholder logic) ===== */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Energy Insights</h3>
          <p className="text-neutral-600 text-sm">
            We translate your tension + breath patterns into chakra insights.
          </p>

          {selectedAreas.length === 0 ? (
            <p className="text-sm text-neutral-500">Select at least one area above to see insights.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedChakras.map((c) => (
                <div key={c} className="rounded-2xl border border-neutral-200 p-4">
                  <div className="font-semibold">{c} chakra</div>
                  <p className="text-sm text-neutral-600 mt-1">
                    {c === "Root" && "Stability, grounding, safety. Rebuild calm with slow, heavy breaths + walking."}
                    {c === "Sacral" && "Fluidity, creativity, emotions. Hip openers + rhythmic breath support release."}
                    {c === "Solar Plexus" && "Drive, will, digestion. Gentle core + steady belly breathing help balance."}
                    {c === "Heart" && "Openness, compassion. Coherent breathing and chest openers soften tension."}
                    {c === "Throat" && "Expression, truth. Neck/shoulder release + humming exhale clear stagnation."}
                    {c === "Third Eye" && "Clarity, insight. Soften eyes, humming breath, brief meditation to reset."}
                    {c === "Crown" && "Connection, stillness. Restorative postures + quiet attention restore ease."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== Crystal Placement ===== */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Crystal Placement</h3>
          <p className="text-neutral-600 text-sm">
            Suggestions are based on the chakras involved in your selections.
          </p>

          {selectedChakras.length === 0 ? (
            <p className="text-sm text-neutral-500">Select an area above to see crystal suggestions.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedChakras.map((c) => (
                <div key={c} className="rounded-2xl border border-neutral-200 p-4">
                  <div className="font-semibold">{c}</div>
                  <div className="text-sm mt-1">
                    <span className="font-medium">Crystals:</span>{" "}
                    {CHAKRA_CRYSTALS[c].crystals.join(", ")}
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    <span className="font-medium">Placement:</span> {CHAKRA_CRYSTALS[c].placement}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== Sleep Rituals ===== */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Sleep Rituals</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-neutral-200 p-4">
              <div className="font-medium">Before Sleep (5–8 min)</div>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>Cat–cow x 6 + knees-to-chest</li>
                <li>Supported forward fold (2 min)</li>
                <li>Coherent breathing (5s in / 5s out, 3 min)</li>
                <li>1 sentence journal: “One thing I release…”</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 p-4">
              <div className="font-medium">Morning Reset (5–8 min)</div>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>Gentle spinal twists in bed</li>
                <li>Sun breath x 8 (arms up on inhale, down on exhale)</li>
                <li>Box breathing 4-4-4-4 (2–3 min)</li>
                <li>Set focus: “What energy do I choose?”</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Personalized 2-week Plan ===== */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Personalized Plan</h3>
          <p className="text-neutral-600 text-sm">
            Builds a 14-day micro-practice plan from your selected areas.
          </p>
          <button
            onClick={buildPlan}
            className="rounded-2xl border border-neutral-300 px-4 py-2 text-sm hover:bg-black/5"
          >
            Generate 2-week plan
          </button>

          {plan.length > 0 && (
            <div className="mt-2 rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50">
                  <tr className="text-left">
                    <th className="p-3 w-16">Day</th>
                    <th className="p-3">Focus</th>
                    <th className="p-3">Practice</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.map((p) => (
                    <tr key={p.day} className="border-t border-neutral-100">
                      <td className="p-3">{p.day}</td>
                      <td className="p-3">{p.focus}</td>
                      <td className="p-3">{p.practice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== Food as Medicine (ANCHOR) ===== */}
        <div id="food-as-medicine">
          <h3 className="text-2xl font-semibold">Food as Medicine</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Add meals, snacks, juices, or remedies that support your current body insights.
          </p>

          <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <div className="font-semibold">Suggested for you</div>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Warm lentil soup with turmeric + ginger</li>
              <li>Chamomile or lemon balm tea with honey</li>
            </ul>
          </div>

          <form onSubmit={addItem} className="mt-4 flex items-center gap-2">
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as FoodItem["kind"])}
              className="rounded-xl border border-neutral-300 bg-transparent px-3 py-2 text-sm"
            >
              <option>Meal</option>
              <option>Snack</option>
              <option>Juice</option>
              <option>Remedy</option>
            </select>

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., quinoa bowl with roasted veggies"
              className="flex-1 rounded-xl border border-neutral-300 bg-transparent px-3 py-2 text-sm"
            />

            <button type="submit" className="rounded-xl bg-black text-white px-4 py-2 text-sm font-medium">
              Add
            </button>
          </form>

          <div className="mt-3">
            {items.length === 0 ? (
              <p className="text-sm text-neutral-500">No items yet.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((i) => (
                  <li
                    key={i.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3 py-2"
                  >
                    <div className="text-sm">
                      <span className="font-medium">{i.kind}:</span> <span>{i.text}</span>
                    </div>
                    <button
                      onClick={() => del(i.id)}
                      className="text-sm rounded-xl border border-neutral-300 px-3 py-1 hover:bg-black/5 transition"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

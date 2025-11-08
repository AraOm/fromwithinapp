// src/components/FoodAsMedicineSection.tsx
import React, { useEffect, useMemo, useState } from "react";

type Item = { id: string; kind: "meal"|"snack"|"juice"|"other"; text: string; ts: number };

export default function FoodAsMedicineSection({ signals }: { signals?: string[] }) {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState("");
  const [kind, setKind] = useState<Item["kind"]>("meal");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gw-food-medicine");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("gw-food-medicine", JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = () => {
    if (!text.trim()) return;
    setItems(prev => [{ id: crypto.randomUUID(), kind, text: text.trim(), ts: Date.now() }, ...prev]);
    setText("");
  };

  const suggestions = useMemo(() => {
    const s = (signals || []).map((x) => x.toLowerCase());
    const out: string[] = [];
    if (s.some(x => x.includes("tired") || x.includes("low energy"))) out.push("Warm lentil soup with turmeric + ginger");
    if (s.some(x => x.includes("anx") || x.includes("stress"))) out.push("Chamomile or lemon balm tea with honey");
    if (s.some(x => x.includes("inflammation") || x.includes("achy"))) out.push("Beet + carrot + celery + lemon juice");
    if (s.some(x => x.includes("digest") || x.includes("bloat"))) out.push("Ginger mint water; papaya with lime");
    return out;
  }, [signals]);

  return (
    <section id="food-as-medicine" className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Food as Medicine</h3>
        <p className="text-sm text-gray-500">
          Add meals, snacks, juices, or remedies that support your current body insights.
        </p>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3">
          <strong className="block mb-1">Suggested for you</strong>
          <ul className="list-disc pl-5 space-y-1">
            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <select
          className="border rounded px-2 py-1"
          value={kind}
          onChange={(e) => setKind(e.target.value as Item["kind"])}
        >
          <option value="meal">Meal</option>
          <option value="snack">Snack</option>
          <option value="juice">Juice</option>
          <option value="other">Other</option>
        </select>
        <input
          className="flex-1 border rounded px-2 py-1"
          placeholder="e.g., quinoa bowl with roasted veggies"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={add} className="px-3 py-1 rounded bg-blue-600 text-white">Add</button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No items yet.</p>
        ) : (
          items.map(it => (
            <div key={it.id} className="border rounded p-2 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wide text-gray-500">{it.kind}</span>
                <div>{it.text}</div>
              </div>
              <button
                className="text-xs text-red-600"
                onClick={() => setItems(prev => prev.filter(p => p.id !== it.id))}
              >
                remove
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

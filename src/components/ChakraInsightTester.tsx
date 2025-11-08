import React, { useState } from "react";
import { getChakraInsight } from "@/lib/backend";

export default function ChakraInsightTester() {
  const [chakra, setChakra] = useState("heart");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const run = async () => {
    setLoading(true);
    setResult("");
    try {
      const msg = await getChakraInsight({ chakra, notes });
      setResult(msg);
    } catch (e: any) {
      setResult(`Error: ${e.message || e.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-3 p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-semibold">Chakra Insight Tester</h2>
      <div className="flex gap-2">
        <select
          className="border rounded px-2 py-1"
          value={chakra}
          onChange={(e) => setChakra(e.target.value)}
        >
          <option value="root">root</option>
          <option value="sacral">sacral</option>
          <option value="solar_plexus">solar_plexus</option>
          <option value="heart">heart</option>
          <option value="throat">throat</option>
          <option value="third_eye">third_eye</option>
          <option value="crown">crown</option>
        </select>
        <input
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type your notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          onClick={run}
          disabled={loading}
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Get insight"}
        </button>
      </div>

      {result && (
        <pre className="whitespace-pre-wrap bg-gray-50 border rounded p-3 mt-2">
          {result}
        </pre>
      )}
    </div>
  );
}

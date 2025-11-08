// src/pages/mentor-test.tsx (or pages/mentor-test.tsx)
import { useState } from "react";
import { getChakraInsight } from "@/lib/backend";

export default function MentorTestPage() {
  const [input, setInput] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setInsight("");
    try {
      const msg = await getChakraInsight({ chakra: "heart", notes: input });
      setInsight(msg);
    } catch (err: any) {
      setInsight(`Error: ${err.message || err.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mentor Test</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
        style={{ marginRight: 10 }}
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
      {insight && (
        <div style={{ marginTop: 20 }}>
          <strong>Insight:</strong> {insight}
        </div>
      )}
    </div>
  );
}

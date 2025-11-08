import dynamic from "next/dynamic";

// Journaling hub
const VoiceJournaling = dynamic(() => import("@/components/VoiceJournaling"), {
  ssr: false,
  loading: () => <p className="p-6">Loading check-in…</p>,
});

export default function CheckInPage() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Check-In</h2>
      <VoiceJournaling />
    </div>
  );
}

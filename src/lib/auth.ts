import type { NextRequest } from "next/server";

export type Session = { user: { id: string; email?: string } } | null;
export type Profile = {
  wearable_provider?: "fitbit" | "oura" | "googlefit";
  wearable_connected?: boolean;
} | null;
export type Subscription = { status: "trialing" | "active" | "canceled" | "incomplete" } | null;

// In real life this pulls from Supabase/DB.
// For now we read simple cookies we set during onboarding.
export async function getSessionAndProfile(req: NextRequest): Promise<{
  session: Session;
  profile: Profile;
  subscription: Subscription;
}> {
  const cookies = req.cookies;
  const loggedIn = cookies.get("gw_logged_in")?.value === "1"; // dev only
  const wearableConnected = cookies.get("gw_wearable_connected")?.value === "1";
  const wearableProvider = (cookies.get("gw_wearable_provider")?.value ??
    undefined) as Profile["wearable_provider"];
  const subStatus = (cookies.get("gw_sub_status")?.value ??
    undefined) as Subscription["status"];

  return {
    session: loggedIn ? { user: { id: "dev-user" } } : null,
    profile: loggedIn
      ? {
          wearable_connected: !!wearableConnected,
          wearable_provider: wearableProvider,
        }
      : null,
    subscription: loggedIn && subStatus ? { status: subStatus } : null,
  };
}

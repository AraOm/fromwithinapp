// src/pages/api/wearables/fitbit/auth.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Require login
  if (!user) {
    // tweak this to your auth route if needed
    return res.redirect("/?auth=required");
  }

  const clientId = process.env.FITBIT_CLIENT_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!clientId) {
    return res
      .status(500)
      .json({ error: "FITBIT_CLIENT_ID env var not set" });
  }

  const redirectUri = `${appUrl}/api/wearables/fitbit/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "heartrate activity sleep profile",
    prompt: "consent",
  });

  const authUrl = `https://www.fitbit.com/oauth2/authorize?${params.toString()}`;

  return res.redirect(authUrl);
}

// src/pages/api/wearables/oura/auth.ts
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

  // User must be logged in to link Oura
  if (!user) {
    // Adjust this redirect to your auth route if needed
    return res.redirect("/?auth=required");
  }

  const clientId = process.env.OURA_CLIENT_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!clientId) {
    return res
      .status(500)
      .json({ error: "OURA_CLIENT_ID env var not set" });
  }

  const redirectUri = `${appUrl}/api/wearables/oura/callback`;

  // Oura OAuth2 authorization endpoint
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "email personal daily heartrate sleep",
    // You can add a CSRF state param here and store it in a cookie/session
    // state: "some-random-string",
  });

  const authUrl = `https://cloud.ouraring.com/oauth/authorize?${params.toString()}`;

  return res.redirect(authUrl);
}

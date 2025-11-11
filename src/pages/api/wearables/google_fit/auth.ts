// src/pages/api/wearables/google_fit/auth.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.GOOGLE_FIT_CLIENT_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!clientId) {
    return res
      .status(500)
      .json({ error: "GOOGLE_FIT_CLIENT_ID env var not set" });
  }

  const redirectUri = `${appUrl}/api/wearables/google_fit/callback`;

  const scopes = [
    "https://www.googleapis.com/auth/fitness.heart_rate.read",
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.sleep.read",
  ];

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    access_type: "offline",
    include_granted_scopes: "true",
    scope: scopes.join(" "),
    prompt: "consent",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return res.redirect(authUrl);
}

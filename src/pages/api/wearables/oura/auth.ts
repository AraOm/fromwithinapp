// src/pages/api/wearables/oura/auth.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
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

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    // Oura scopes – adjust if your app config uses different ones
    scope: "email personal daily heartrate sleep",
  });

  const authUrl = `https://cloud.ouraring.com/oauth/authorize?${params.toString()}`;

  return res.redirect(authUrl);
}

// src/pages/api/wearables/fitbit/callback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BETA_USER_ID = "7b9710c3-6cf0-40e4-86be-35836e042df2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, error } = req.query;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const clientId = process.env.FITBIT_CLIENT_ID;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET;

  if (error) {
    return res.redirect(
      `/insights?wearable=fitbit&status=error&reason=${encodeURIComponent(
        String(error)
      )}`
    );
  }

  if (!code || typeof code !== "string") {
    return res.redirect(
      "/insights?wearable=fitbit&status=error&reason=missing_code"
    );
  }

  if (!clientId || !clientSecret) {
    console.error("Missing Fitbit env vars");
    return res
      .status(500)
      .json({ error: "Missing FITBIT_CLIENT_ID or FITBIT_CLIENT_SECRET" });
  }

  const redirectUri = `${appUrl}/api/wearables/fitbit/callback`;

  const tokenParams = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch("https://api.fitbit.com/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenParams.toString(),
    });
  } catch (e) {
    console.error("Fitbit token fetch error:", e);
    return res.redirect(
      "/insights?wearable=fitbit&status=error&reason=token_fetch_failed"
    );
  }

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    console.error("Fitbit token error:", tokenResponse.status, text);
    return res.redirect(
      "/insights?wearable=fitbit&status=error&reason=token_response_not_ok"
    );
  }

  const tokenJson = (await tokenResponse.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  };

  const { access_token, refresh_token, expires_in, scope } = tokenJson;

  const expiresAt = expires_in
    ? new Date(Date.now() + expires_in * 1000).toISOString()
    : null;

  const { error: dbError } = await supabaseAdmin
    .from("wearable_connections")
    .upsert(
      {
        user_id: BETA_USER_ID,
        provider: "fitbit",
        access_token,
        refresh_token: refresh_token ?? null,
        expires_at: expiresAt,
        scopes: scope ? scope.split(" ") : null,
        source_device: "Fitbit",
      },
      { onConflict: "user_id,provider" }
    );

  if (dbError) {
    console.error("Error saving Fitbit connection:", dbError);
    return res.redirect(
      "/insights?wearable=fitbit&status=error&reason=db_error"
    );
  }

  return res.redirect("/insights?wearable=fitbit&status=connected");
}

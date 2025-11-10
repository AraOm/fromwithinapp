// src/pages/api/wearables/oura/callback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type OuraTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, error } = req.query;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const clientId = process.env.OURA_CLIENT_ID;
  const clientSecret = process.env.OURA_CLIENT_SECRET;

  if (error) {
    return res.redirect(
      `/insights?wearable=oura&status=error&reason=${encodeURIComponent(
        String(error)
      )}`
    );
  }

  if (!code || typeof code !== "string") {
    return res.redirect(
      "/insights?wearable=oura&status=error&reason=missing_code"
    );
  }

  if (!clientId || !clientSecret) {
    return res
      .status(500)
      .json({ error: "Missing OURA_CLIENT_ID or OURA_CLIENT_SECRET" });
  }

  const redirectUri = `${appUrl}/api/wearables/oura/callback`;

  // Exchange authorization code for access + refresh tokens
  const tokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch("https://api.ouraring.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenParams.toString(),
    });
  } catch (e) {
    console.error("Oura token fetch error:", e);
    return res.redirect(
      "/insights?wearable=oura&status=error&reason=token_fetch_failed"
    );
  }

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    console.error("Oura token error:", tokenResponse.status, text);
    return res.redirect(
      "/insights?wearable=oura&status=error&reason=token_response_not_ok"
    );
  }

  const tokenJson = (await tokenResponse.json()) as OuraTokenResponse;
  const { access_token, refresh_token, expires_in, scope } = tokenJson;

  // Get current user from Supabase
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return res.redirect(
      "/insights?wearable=oura&status=error&reason=no_user"
    );
  }

  // Compute expiry timestamp if expires_in provided
  const expiresAt = expires_in
    ? new Date(Date.now() + expires_in * 1000).toISOString()
    : null;

  // Save / update wearable connection for this user + provider
  const { error: dbError } = await supabaseAdmin
    .from("wearable_connections")
    .upsert(
      {
        user_id: user.id,
        provider: "oura", // must match enum value in wearable_provider
        access_token,
        refresh_token: refresh_token ?? null,
        expires_at: expiresAt,
        scopes: scope ? scope.split(" ") : null,
        source_device: "Oura Ring",
      },
      { onConflict: "user_id,provider" }
    );

  if (dbError) {
    console.error("Error saving Oura connection:", dbError);
    return res.redirect(
      "/insights?wearable=oura&status=error&reason=db_error"
    );
  }

  // Success → back to Insights
  return res.redirect("/insights?wearable=oura&status=connected");
}

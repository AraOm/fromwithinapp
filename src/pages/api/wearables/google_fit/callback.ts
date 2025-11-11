// src/pages/api/wearables/google_fit/callback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, error } = req.query;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const clientId = process.env.GOOGLE_FIT_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_FIT_CLIENT_SECRET;

  if (error) {
    return res.redirect(
      `/insights?wearable=google_fit&status=error&reason=${encodeURIComponent(
        String(error)
      )}`
    );
  }

  if (!code || typeof code !== "string") {
    return res.redirect(
      "/insights?wearable=google_fit&status=error&reason=missing_code"
    );
  }

  if (!clientId || !clientSecret) {
    return res
      .status(500)
      .json({ error: "Missing Google Fit client env vars" });
  }

  const redirectUri = `${appUrl}/api/wearables/google_fit/callback`;

  const tokenParams = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenParams.toString(),
    });
  } catch (e) {
    console.error("Google Fit token fetch error:", e);
    return res.redirect(
      "/insights?wearable=google_fit&status=error&reason=token_fetch_failed"
    );
  }

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    console.error("Google Fit token error:", tokenResponse.status, text);
    return res.redirect(
      "/insights?wearable=google_fit&status=error&reason=token_response_not_ok"
    );
  }

  const tokenJson = (await tokenResponse.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  };

  const { access_token, refresh_token, expires_in, scope } = tokenJson;

  // Look up current Supabase user
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return res.redirect(
      "/insights?wearable=google_fit&status=error&reason=no_user"
    );
  }

  const expiresAt = expires_in
    ? new Date(Date.now() + expires_in * 1000).toISOString()
    : null;

  // Save into wearable_connections
  const { error: dbError } = await supabaseAdmin
    .from("wearable_connections")
    .upsert(
      {
        user_id: user.id,
        provider: "google_fit", // must match your enum value
        access_token,
        refresh_token: refresh_token ?? null,
        expires_at: expiresAt,
        scopes: scope ? scope.split(" ") : null,
        source_device: "Google Fit",
      },
      { onConflict: "user_id,provider" }
    );

  if (dbError) {
    console.error("Google Fit save error:", dbError);
    return res.redirect(
      "/insights?wearable=google_fit&status=error&reason=db_error"
    );
  }

  return res.redirect("/insights?wearable=google_fit&status=connected");
}

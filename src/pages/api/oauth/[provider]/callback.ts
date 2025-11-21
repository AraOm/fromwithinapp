import type { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from "buffer";

async function exchangeFitbit(code: string) {
  const basic = Buffer.from(
    `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
  ).toString("base64");

  const resp = await fetch("https://api.fitbit.com/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.FITBIT_REDIRECT_URI as string,
    }),
  });
  if (!resp.ok) throw new Error("Fitbit token exchange failed");
  return resp.json();
}

async function exchangeOura(code: string) {
  const resp = await fetch("https://api.ouraring.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.OURA_REDIRECT_URI as string,
      client_id: process.env.OURA_CLIENT_ID as string,
      client_secret: process.env.OURA_CLIENT_SECRET as string,
    }),
  });
  if (!resp.ok) throw new Error("Oura token exchange failed");
  return resp.json();
}

async function exchangeGoogle(code: string) {
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_FIT_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_FIT_CLIENT_SECRET as string,
      redirect_uri: process.env.GOOGLE_FIT_REDIRECT_URI as string,
      grant_type: "authorization_code",
    }),
  });
  if (!resp.ok) throw new Error("Google Fit token exchange failed");
  return resp.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query as { code?: string };
  const { provider } = req.query as {
    provider: "fitbit" | "oura" | "google" | "googlefit" | "samsung";
  };

  if (!code) return res.status(400).send("Missing code");

  try {
    if (provider === "fitbit") await exchangeFitbit(code);
    if (provider === "oura") await exchangeOura(code);
    if (provider === "google" || provider === "googlefit")
      await exchangeGoogle(code);

    // For now we don't have Samsung's real OAuth wired:
    if (provider === "samsung") {
      console.log("Samsung callback hit (no token exchange implemented yet)");
      // you could add future Samsung token exchange logic here
    }

    // Dev: mark wearable connected + pick provider
    res.setHeader("Set-Cookie", [
      `gw_logged_in=1; Path=/; HttpOnly; SameSite=Lax`,
      `gw_wearable_connected=1; Path=/; HttpOnly; SameSite=Lax`,
      `gw_wearable_provider=${provider}; Path=/; HttpOnly; SameSite=Lax`,
    ]);

    // Next stop: Stripe trial
    return res.redirect(302, "/onboarding/checkout");
  } catch (e) {
    console.error(e);
    return res.redirect(302, `/onboarding?error=oauth_${provider}`);
  }
}

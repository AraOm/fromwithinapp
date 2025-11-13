import type { NextApiRequest, NextApiResponse } from "next";

const scopes = {
  fitbit: [
    "sleep",
    "heartrate",
    "activity",
    "profile",
  ].join(" "),
  oura: [
    "email",
    "personal",
    "daily", // readiness/sleep summary (v2 apps often use "daily" scopes)
  ].join(" "),
  googlefit: process.env.GOOGLE_FIT_SCOPES || "",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider } = req.query as { provider: "fitbit" | "oura" | "googlefit" };

  const base = process.env.APP_BASE_URL || "http://localhost:3000";

  try {
    if (provider === "fitbit") {
      const auth = new URL("https://www.fitbit.com/oauth2/authorize");
      auth.searchParams.set("response_type", "code");
      auth.searchParams.set("client_id", process.env.FITBIT_CLIENT_ID as string);
      auth.searchParams.set("redirect_uri", process.env.FITBIT_REDIRECT_URI as string);
      auth.searchParams.set("scope", scopes.fitbit);
      auth.searchParams.set("prompt", "consent");
      return res.redirect(auth.toString());
    }

    if (provider === "oura") {
      const auth = new URL("https://cloud.ouraring.com/oauth/authorize");
      auth.searchParams.set("response_type", "code");
      auth.searchParams.set("client_id", process.env.OURA_CLIENT_ID as string);
      auth.searchParams.set("redirect_uri", process.env.OURA_REDIRECT_URI as string);
      auth.searchParams.set("scope", scopes.oura);
      return res.redirect(auth.toString());
    }

    if (provider === "googlefit") {
      const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      auth.searchParams.set("response_type", "code");
      auth.searchParams.set("client_id", process.env.GOOGLE_FIT_CLIENT_ID as string);
      auth.searchParams.set("redirect_uri", process.env.GOOGLE_FIT_REDIRECT_URI as string);
      auth.searchParams.set("scope", scopes.googlefit);
      auth.searchParams.set("access_type", "offline");
      auth.searchParams.set("include_granted_scopes", "true");
      auth.searchParams.set("prompt", "consent");
      return res.redirect(auth.toString());
    }

    return res.status(400).json({ error: "Unknown provider" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "OAuth start failed" });
  }
}

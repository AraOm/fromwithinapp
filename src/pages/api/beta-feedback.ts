// src/pages/api/beta-feedback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.warn(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env for /api/beta-feedback"
  );
}

const supabase =
  supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey)
    : null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabase) {
    return res
      .status(500)
      .json({ error: "Supabase not configured on server" });
  }

  const { issueType, page, description, email } = req.body || {};

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  const { error } = await supabase.from("beta_feedback").insert({
    issue_type: issueType || null,
    page: page || null,
    description,
    email: email || null,
  });

  if (error) {
    console.error("Error inserting beta feedback:", error);
    return res.status(500).json({ error: "Failed to save feedback" });
  }

  return res.status(200).json({ ok: true });
}

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Manifest = {
  ambience: string[];
  bowls: string[];
  chimes: string[];
  birds: string[];
};

const ALLOWED = new Set([".mp3", ".wav", ".m4a", ".ogg"]);
const ROOT = path.join(process.cwd(), "public", "soundscapes");

function list(folder: string) {
  const dir = path.join(ROOT, folder);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => ALLOWED.has(path.extname(f).toLowerCase()))
      .map((f) => `/soundscapes/${folder}/${f}`);
  } catch {
    return [];
  }
}

export default function handler(_req: NextApiRequest, res: NextApiResponse<Manifest>) {
  res.status(200).json({
    ambience: list("ambience"),
    bowls: list("bowls"),
    chimes: list("chimes"),
    birds: list("birds"),
  });
}

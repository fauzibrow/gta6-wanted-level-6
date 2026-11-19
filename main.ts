// Entry program for the make.fun GTA 6 meme bounty (gta6-meme-x-01).
// The judged entry is the X post named in POST.json; this program only
// copies that file into the output directory for the house to read.
// It sanity-checks the file first, so a bad POST.json fails loudly here
// instead of silently passing an empty output through.
//
// Local test:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "POST.json");
const target = join(outDir, "POST.json");

let text: string;
try {
  text = readFileSync(source, "utf8");
} catch (err) {
  console.error(`cannot read ${source}: ${(err as Error).message}`);
  process.exit(1);
}

let post: unknown;
try {
  post = JSON.parse(text);
} catch {
  console.error("POST.json is not valid JSON");
  process.exit(1);
}

if (
  typeof post !== "object" ||
  post === null ||
  typeof (post as { url?: unknown }).url !== "string" ||
  !/^https:\/\/(www\.|mobile\.)?(x|twitter)\.com\/[^/]+\/status\/\d+/.test(
    (post as { url: string }).url,
  )
) {
  console.error('POST.json must hold a valid X post url, like https://x.com/<handle>/status/<id>');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, text);

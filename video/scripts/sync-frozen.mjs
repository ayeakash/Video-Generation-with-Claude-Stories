// Copies the FROZEN episode files into the engine after verifying their checksums.
// Refuses to continue if anything changed: the approved timing must never drift.
import { createHash } from "node:crypto";
import { readFileSync, copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const EP = resolve(import.meta.dirname, "../..");
const sums = readFileSync(resolve(EP, "frozen.sha256"), "utf8").trim().split("\n").map((l) => {
  const [hash, ...name] = l.split(/\s+/);
  return { hash, name: name.join(" ") };
});
for (const { hash, name } of sums) {
  const got = createHash("sha256").update(readFileSync(resolve(EP, name))).digest("hex");
  if (got !== hash) { console.error(`FROZEN FILE CHANGED: ${name}`); process.exit(1); }
}
const copies = [
  ["arjuna narration.mp3", "public/narration.mp3"],
  ["word-timestamps.json", "src/data/word-timestamps.json"],
  ["phrases.json", "src/data/phrases.json"],
];
for (const [from, to] of copies) copyFileSync(resolve(EP, from), resolve(import.meta.dirname, "..", to));
if (!existsSync(resolve(import.meta.dirname, "../public/paper-grain.png"))) console.warn("paper-grain.png missing (run scripts/make-grain.sh)");
console.log(`frozen files verified (${sums.length}) and synced`);

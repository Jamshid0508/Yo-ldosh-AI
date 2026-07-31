import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, "..", "prompts");
const dest = join(__dirname, "..", "dist", "prompts");

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log(`prompts/ -> dist/prompts/ nusxalandi`);

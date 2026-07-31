import type { AiProvider } from "./types.js";

let cached: AiProvider | null = null;
let cachedName: string | null = null;

/**
 * Qaysi AI provayder ishlatilishini AI_PROVIDER env orqali tanlaymiz.
 * Standart — "gemini" (Google AI Studio'da bepul tarif mavjud, matn + rasm).
 * "anthropic" ga o'tish uchun AI_PROVIDER=anthropic va ANTHROPIC_API_KEY kerak.
 */
export async function getProvider(): Promise<AiProvider> {
  const name = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (cached && cachedName === name) return cached;

  if (name === "anthropic") {
    const { anthropicProvider } = await import("./anthropic.js");
    cached = anthropicProvider;
  } else {
    const { geminiProvider } = await import("./gemini.js");
    cached = geminiProvider;
  }
  cachedName = name;
  return cached;
}

export function currentProviderName(): string {
  return (process.env.AI_PROVIDER || "gemini").toLowerCase();
}

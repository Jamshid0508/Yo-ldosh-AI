import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getProvider } from "./providers/index.js";
import type { ChatTurn, ContentPart } from "./providers/types.js";
import {
  belgiCheckSchema,
  extractJson,
  testQuestionSchema,
  vaziyatResponseSchema,
} from "./validators.js";

export { AiUnavailableError } from "./providers/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadPrompt(name: string): string {
  return readFileSync(join(__dirname, "prompts", `${name}.txt`), "utf-8");
}

function loadPromptSafe(name: string): string {
  try {
    return loadPrompt(name);
  } catch {
    return "";
  }
}

const prompts = {
  chat: loadPromptSafe("chat"),
  test: loadPromptSafe("test"),
  vaziyat: loadPromptSafe("vaziyat"),
  belgi: loadPromptSafe("belgi"),
};

type ChatHistoryItem = { role: "user" | "assistant"; content: string };

export async function runChat(payload: {
  message: string;
  history?: ChatHistoryItem[];
  context?: { belgi_id?: string; belgi_nom?: string; mavzu?: string };
}): Promise<{ reply: string }> {
  const provider = await getProvider();
  const history = (payload.history ?? []).slice(-20);
  let contextLine = "";
  if (payload.context?.belgi_id) {
    contextLine = `\n\n[Kontekst: foydalanuvchi "${payload.context.belgi_nom ?? ""}" (${payload.context.belgi_id}) belgisi sahifasidan savol yubordi.]`;
  } else if (payload.context?.mavzu) {
    contextLine = `\n\n[Kontekst: mavzu — ${payload.context.mavzu}]`;
  }

  const messages: ChatTurn[] = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: payload.message + contextLine },
  ];

  const reply = await provider.generate({ system: prompts.chat, messages, maxTokens: 1024 });
  return { reply };
}

export async function runTest(payload: { mavzu: string; qiyinlik?: number; avoid?: string[] }) {
  const provider = await getProvider();
  const avoidText = payload.avoid?.length
    ? `\n\nOldin berilgan savollar (takrorlama):\n${payload.avoid.map((s) => `- ${s}`).join("\n")}`
    : "";
  const userMsg = `Mavzu: ${payload.mavzu}\nQiyinlik darajasi: ${payload.qiyinlik ?? 2}${avoidText}`;

  const text = await provider.generate({
    system: prompts.test,
    messages: [{ role: "user", content: userMsg }],
    maxTokens: 800,
    jsonMode: true,
  });

  const parsed = testQuestionSchema.safeParse(extractJson(text));
  if (!parsed.success) throw new Error("AI noto'g'ri formatda savol qaytardi");
  return parsed.data;
}

export async function runVaziyat(payload: { matn: string }) {
  const provider = await getProvider();

  async function attempt(extra?: string) {
    const text = await provider.generate({
      system: prompts.vaziyat,
      messages: [{ role: "user", content: extra ? `${payload.matn}\n\n${extra}` : payload.matn }],
      maxTokens: 1400,
      jsonMode: true,
    });
    return vaziyatResponseSchema.parse(extractJson(text));
  }

  try {
    return await attempt();
  } catch {
    try {
      return await attempt(
        "(Diqqat: oldingi javobing noto'g'ri JSON edi. FAQAT belgilangan JSON strukturasida, boshqa matnsiz qayta javob ber.)"
      );
    } catch {
      return null; // fallback: frontend faqat matn asosida umumiy xabar ko'rsatadi
    }
  }
}

export async function runBelgi(payload: { image_base64?: string; media_type?: string; matn?: string }) {
  const provider = await getProvider();
  const content: ContentPart[] = [];
  if (payload.image_base64) {
    content.push({
      type: "image",
      base64: payload.image_base64,
      mediaType: payload.media_type ?? "image/jpeg",
    });
  }
  content.push({ type: "text", text: payload.matn || "Ushbu belgi rasmini tahlil qil." });

  const text = await provider.generate({
    system: prompts.belgi,
    messages: [{ role: "user", content }],
    maxTokens: 900,
    jsonMode: true,
  });

  const parsed = belgiCheckSchema.safeParse(extractJson(text));
  if (!parsed.success) throw new Error("AI noto'g'ri formatda javob qaytardi");
  return parsed.data;
}

import Anthropic from "@anthropic-ai/sdk";
import { AiUnavailableError, type AiProvider, type ChatTurn, type GenerateParams } from "./types.js";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AiUnavailableError("ANTHROPIC_API_KEY sozlanmagan");
  }
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

function toAnthropicContent(content: ChatTurn["content"]): Anthropic.MessageParam["content"] {
  if (typeof content === "string") return content;
  return content.map((part) =>
    part.type === "text"
      ? { type: "text" as const, text: part.text }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: part.mediaType as "image/jpeg" | "image/png",
            data: part.base64,
          },
        }
  );
}

export const anthropicProvider: AiProvider = {
  async generate({ system, messages, maxTokens }: GenerateParams): Promise<string> {
    const anthropic = getClient();

    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: messages.map((m) => ({ role: m.role, content: toAnthropicContent(m.content) })),
    });

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    if (!text) throw new Error("Claude bo'sh javob qaytardi");
    return text;
  },
};

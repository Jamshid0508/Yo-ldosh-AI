import { GoogleGenAI } from "@google/genai";
import { AiUnavailableError, type AiProvider, type ChatTurn, type GenerateParams } from "./types.js";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new AiUnavailableError("GEMINI_API_KEY sozlanmagan");
  }
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

function toGeminiParts(content: ChatTurn["content"]) {
  if (typeof content === "string") return [{ text: content }];
  return content.map((part) =>
    part.type === "text"
      ? { text: part.text }
      : { inlineData: { data: part.base64, mimeType: part.mediaType } }
  );
}

export const geminiProvider: AiProvider = {
  async generate({ system, messages, maxTokens, jsonMode }: GenerateParams): Promise<string> {
    const ai = getClient();

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: toGeminiParts(m.content),
    }));

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: system,
        maxOutputTokens: maxTokens,
        ...(jsonMode ? { responseMimeType: "application/json" } : {}),
      },
    });

    const text = response.text;
    if (!text) throw new Error("Gemini bo'sh javob qaytardi");
    return text;
  },
};

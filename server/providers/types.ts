export type ContentPart = { type: "text"; text: string } | { type: "image"; base64: string; mediaType: string };

export interface ChatTurn {
  role: "user" | "assistant";
  content: string | ContentPart[];
}

export interface GenerateParams {
  system: string;
  messages: ChatTurn[];
  maxTokens: number;
  /** true bo'lsa, provider imkon qadar (masalan Gemini JSON mode orqali) faqat JSON qaytarishga majburlanadi. */
  jsonMode?: boolean;
}

export interface AiProvider {
  generate(params: GenerateParams): Promise<string>;
}

export class AiUnavailableError extends Error {}

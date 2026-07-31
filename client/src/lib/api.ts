import type { BelgiCheckResult, VaziyatResponse } from "../types";
import { getClientId } from "./storage";

/**
 * Bir vercel loyihasida (client+server bitta domenda) bo'sh qoldiring — "/api" nisbiy yo'l ishlaydi.
 * Backend alohida domenda joylashgan bo'lsa (masalan alohida Vercel loyihasi), shu yerga uning
 * to'liq manzilini yozing: VITE_API_BASE_URL=https://yoldosh-ai-api.vercel.app
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

async function callAi<T>(type: string, payload: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/api/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": getClientId(),
    },
    body: JSON.stringify({ type, payload }),
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok || !body?.ok) {
    throw new ApiError(
      body?.message || "AI hozircha javob bera olmadi. Birozdan so'ng qayta urinib ko'ring.",
      res.status
    );
  }
  return body.data as T;
}

export interface ChatContext {
  belgi_id?: string;
  belgi_nom?: string;
  mavzu?: string;
}

export async function aiChat(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  context?: ChatContext
): Promise<string> {
  const data = await callAi<{ reply: string }>("chat", { message, history, context });
  return data.reply;
}

export async function aiGenerateTest(mavzu: string, qiyinlik = 2, avoid: string[] = []) {
  return callAi<{
    savol: string;
    variantlar: string[];
    togri: number;
    izoh: string;
    qiyinlik: number;
  }>("test", { mavzu, qiyinlik, avoid });
}

export async function aiVaziyat(matn: string): Promise<VaziyatResponse | null> {
  return callAi<VaziyatResponse | null>("vaziyat", { matn });
}

export async function aiBelgiCheck(
  imageBase64?: string,
  mediaType?: string,
  matn?: string
): Promise<BelgiCheckResult> {
  return callAi<BelgiCheckResult>("belgi", {
    image_base64: imageBase64,
    media_type: mediaType,
    matn,
  });
}

export interface SyncSnapshot {
  progress: unknown;
  mistakes: unknown;
  updatedAt: string;
}

/** MongoDB ulanmagan bo'lsa ham xato tashlamaydi — shunchaki synced:false qaytaradi. */
export async function syncPush(progress: unknown, mistakes: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/sync/${getClientId()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress, mistakes }),
    });
    if (!res.ok) return false;
    const body = await res.json();
    return Boolean(body?.synced);
  } catch {
    return false;
  }
}

export async function syncPull(): Promise<SyncSnapshot | null> {
  try {
    const res = await fetch(`${API_BASE}/api/sync/${getClientId()}`);
    if (!res.ok) return null;
    const body = await res.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
}

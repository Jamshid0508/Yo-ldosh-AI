import { getDb } from "./mongo.js";

const COLLECTION = "ai_usage";

interface AiUsageDoc {
  key: string; // "user:<id>" yoki "guest:<clientId>"
  day: string; // YYYY-MM-DD
  count: number;
}

/** Bugungi so'rovlar sonini 1 taga oshiradi va yangi qiymatni qaytaradi. Mongo bo'lmasa null. */
export async function incrementAiUsage(key: string, day: string): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db
      .collection<AiUsageDoc>(COLLECTION)
      .findOneAndUpdate(
        { key, day },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: "after" }
      );
    return result?.count ?? null;
  } catch (err) {
    console.error("[ai_usage] mongo yozishda xato, xotiradagi limitga o'tildi:", err);
    return null;
  }
}

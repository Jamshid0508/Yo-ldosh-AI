import { getDb } from "./mongo.js";

const COLLECTION = "progress_snapshots";

export interface SnapshotDoc {
  clientId: string;
  progress: unknown;
  mistakes: unknown;
  updatedAt: Date;
}

/**
 * Mehmon/qurilma darajasidagi progress zaxirasi — TZ'dagi Supabase `progress`/`mistakes`
 * jadvallarining soddalashtirilgan MongoDB muqobili. `clientId` — frontendda localStorage'da
 * saqlanadigan qurilma identifikatori (haqiqiy foydalanuvchi autentifikatsiyasi hali yo'q,
 * bu shunchaki qurilmalar orasida zaxira/tiklash imkonini beradi).
 */
export async function saveSnapshot(clientId: string, progress: unknown, mistakes: unknown): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db
    .collection<SnapshotDoc>(COLLECTION)
    .updateOne(
      { clientId },
      { $set: { clientId, progress, mistakes, updatedAt: new Date() } },
      { upsert: true }
    );
  return true;
}

export async function loadSnapshot(clientId: string): Promise<SnapshotDoc | null> {
  const db = await getDb();
  if (!db) return null;
  return db.collection<SnapshotDoc>(COLLECTION).findOne({ clientId }, { projection: { _id: 0 } });
}

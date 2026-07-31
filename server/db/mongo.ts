import { Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;
let dbPromise: Promise<Db> | null = null;

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

/** Bir marta ulanadi va keshlaydi. MONGODB_URI bo'lmasa yoki ulanish muvaffaqiyatsiz bo'lsa null qaytaradi. */
export async function getDb(): Promise<Db | null> {
  if (!isMongoConfigured()) return null;

  if (!dbPromise) {
    dbPromise = (async () => {
      client = new MongoClient(process.env.MONGODB_URI!);
      await client.connect();
      return client.db(process.env.MONGODB_DB_NAME || "yoldosh_ai");
    })();
  }

  try {
    return await dbPromise;
  } catch (err) {
    console.error("[mongo] ulanib bo'lmadi:", err);
    dbPromise = null;
    return null;
  }
}

export async function closeMongo(): Promise<void> {
  await client?.close();
  client = null;
  dbPromise = null;
}

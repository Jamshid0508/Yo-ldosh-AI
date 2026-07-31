import "dotenv/config";
import cors from "cors";
import express from "express";
import { AiUnavailableError, runBelgi, runChat, runTest, runVaziyat } from "./ai.js";
import { isMongoConfigured } from "./db/mongo.js";
import { loadSnapshot, saveSnapshot } from "./db/snapshots.js";
import { aiRateLimit } from "./limits.js";
import { currentProviderName } from "./providers/index.js";

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // origin yo'q (server-to-server, curl, mobil) — ruxsat beriladi
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS: ruxsat etilmagan origin"));
    },
  })
);
app.use(express.json({ limit: "6mb" })); // rasm base64 uchun

app.get("/api/health", (_req, res) => {
  const provider = currentProviderName();
  const aiConfigured =
    provider === "anthropic" ? Boolean(process.env.ANTHROPIC_API_KEY) : Boolean(process.env.GEMINI_API_KEY);
  res.json({ ok: true, aiProvider: provider, aiConfigured, mongoConfigured: isMongoConfigured() });
});

app.post("/api/ai", aiRateLimit, async (req, res) => {
  const { type, payload } = req.body ?? {};

  try {
    switch (type) {
      case "chat": {
        const result = await runChat(payload ?? {});
        return res.json({ ok: true, data: result });
      }
      case "test": {
        const result = await runTest(payload ?? {});
        return res.json({ ok: true, data: result });
      }
      case "vaziyat": {
        const result = await runVaziyat(payload ?? {});
        if (!result) {
          return res.json({
            ok: true,
            data: null,
            fallback: true,
            message:
              "AI sxema tuza olmadi, lekin savolingizni matn sifatida qayta yuboring — umumiy tahlil beramiz.",
          });
        }
        return res.json({ ok: true, data: result });
      }
      case "belgi": {
        const result = await runBelgi(payload ?? {});
        return res.json({ ok: true, data: result });
      }
      default:
        return res.status(400).json({ ok: false, error: "invalid_type" });
    }
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      return res.status(503).json({
        ok: false,
        error: "ai_unavailable",
        message: "AI hozircha ishlamayapti. Lokal savollar bazasi bilan davom eting.",
      });
    }
    console.error("[/api/ai] error:", err);
    return res.status(502).json({
      ok: false,
      error: "ai_bad_response",
      message: "AI javobini tushunib bo'lmadi. Birozdan so'ng qayta urinib ko'ring.",
    });
  }
});

// Qurilma darajasidagi progress zaxirasi (MongoDB Atlas). Haqiqiy auth hali yo'q —
// clientId localStorage'da yaratiladigan qurilma identifikatori (client/src/lib/storage.ts).
// Mongo ulanmagan bo'lsa bu endpointlar sokin ravishda "sync o'chirilgan" javobini beradi,
// ilova esa localStorage bilan to'liq ishlayveradi.
app.post("/api/sync/:clientId", async (req, res) => {
  const { clientId } = req.params;
  const { progress, mistakes } = req.body ?? {};
  const saved = await saveSnapshot(clientId, progress, mistakes);
  res.json({ ok: true, synced: saved });
});

app.get("/api/sync/:clientId", async (req, res) => {
  const snapshot = await loadSnapshot(req.params.clientId);
  res.json({ ok: true, data: snapshot });
});

app.use((_req, res) => res.status(404).json({ ok: false, error: "not_found" }));

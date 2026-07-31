import type { NextFunction, Request, Response } from "express";
import { incrementAiUsage } from "./db/aiUsage.js";

const GUEST_DAILY_LIMIT = 10;
const USER_DAILY_LIMIT = 30;

type Bucket = { day: string; count: number };
const memoryBuckets = new Map<string, Bucket>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function identify(req: Request): { key: string; limit: number } {
  const userId = req.header("x-user-id");
  if (userId) return { key: `user:${userId}`, limit: USER_DAILY_LIMIT };
  const clientId = req.header("x-client-id") ?? req.ip ?? "anon";
  return { key: `guest:${clientId}`, limit: GUEST_DAILY_LIMIT };
}

function incrementInMemory(key: string, day: string): number {
  const existing = memoryBuckets.get(key);
  if (!existing || existing.day !== day) {
    memoryBuckets.set(key, { day, count: 1 });
    return 1;
  }
  existing.count += 1;
  return existing.count;
}

/**
 * MVP rate limit: MongoDB ulangan bo'lsa (MONGODB_URI) hisoblagich durable (server
 * qayta ishga tushsa ham saqlanadi), aks holda jarayon xotirasida (in-memory) hisoblanadi.
 * x-user-id hozircha Supabase/boshqa auth JWT'siz ishonch bilan qabul qilinadi — bu MVP
 * uchun yetarli, lekin haqiqiy auth qo'shilganda token tekshiruvi bilan almashtirilishi kerak.
 */
export async function aiRateLimit(req: Request, res: Response, next: NextFunction) {
  const { key, limit } = identify(req);
  const day = today();

  let count = await incrementAiUsage(key, day);
  if (count === null) count = incrementInMemory(key, day);

  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - count)));

  if (count > limit) {
    return res.status(429).json({
      error: "rate_limited",
      message:
        "Bugungi AI so'rovlar limiti tugadi. Ertaga qayta urinib ko'ring yoki ro'yxatdan o'ting (limit oshadi).",
    });
  }

  next();
}

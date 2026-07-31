import type { Daraja } from "../types";

const DARAJA_THRESHOLDS: [number, Daraja][] = [
  [0, "Yangi haydovchi"],
  [100, "Shogird"],
  [300, "Haydovchi"],
  [700, "Usta"],
  [1500, "Yo'l ustasi"],
];

export function darajaForXp(xp: number): Daraja {
  let result: Daraja = "Yangi haydovchi";
  for (const [threshold, daraja] of DARAJA_THRESHOLDS) {
    if (xp >= threshold) result = daraja;
  }
  return result;
}

export function nextDarajaInfo(xp: number): { next: Daraja | null; needed: number } {
  const idx = DARAJA_THRESHOLDS.findIndex(([threshold]) => xp < threshold);
  if (idx === -1) return { next: null, needed: 0 };
  const [threshold, daraja] = DARAJA_THRESHOLDS[idx];
  return { next: daraja, needed: threshold - xp };
}

export const XP_PER_CORRECT = 10;
export const XP_PER_WRONG = 2; // urinish uchun ozgina XP
export const XP_LESSON_BONUS = 20;
export const XP_EXAM_PASS_BONUS = 50;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + "T00:00:00");
  const d2 = new Date(b + "T00:00:00");
  return Math.round((d2.getTime() - d1.getTime()) / 86_400_000);
}

/** Bugungi faollikni hisobga olib streak'ni yangilaydi. Duolingo mantiqi: ketma-ket kunlar. */
export function updateStreak(oxirgiFaollik: string | null, currentStreak: number): {
  streak: number;
  oxirgiFaollik: string;
  changed: boolean;
} {
  const today = todayISO();
  if (!oxirgiFaollik) return { streak: 1, oxirgiFaollik: today, changed: true };
  const diff = daysBetween(oxirgiFaollik, today);
  if (diff === 0) return { streak: currentStreak, oxirgiFaollik: today, changed: false };
  if (diff === 1) return { streak: currentStreak + 1, oxirgiFaollik: today, changed: true };
  return { streak: 1, oxirgiFaollik: today, changed: true };
}

/** Agar oxirgi faollikdan beri 1 kundan ko'p o'tgan bo'lsa, streak "o'chgan" hisoblanadi (ko'rsatish uchun). */
export function isStreakAlive(oxirgiFaollik: string | null): boolean {
  if (!oxirgiFaollik) return false;
  return daysBetween(oxirgiFaollik, todayISO()) <= 1;
}

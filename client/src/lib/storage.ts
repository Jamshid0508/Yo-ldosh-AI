import type { MistakeEntry, Question, UserProgress } from "../types";
import { darajaForXp, updateStreak } from "./gamification";

const KEYS = {
  progress: "yai_progress",
  mistakes: "yai_mistakes",
  onboarded: "yai_onboarded",
  settings: "yai_settings",
  clientId: "yai_client_id",
  chatHistory: "yai_chat_history",
} as const;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Settings {
  darkMode: boolean | "system";
  sound: boolean;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getClientId(): string {
  let id = localStorage.getItem(KEYS.clientId);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEYS.clientId, id);
  }
  return id;
}

export function getSettings(): Settings {
  return read(KEYS.settings, { darkMode: "system", sound: true });
}

export function saveSettings(settings: Settings): void {
  write(KEYS.settings, settings);
}

export function isOnboarded(): boolean {
  return read(KEYS.onboarded, false);
}

export function markOnboarded(): void {
  write(KEYS.onboarded, true);
}

const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  oxirgiFaollik: null,
  daraja: "Yangi haydovchi",
  mavzular: {},
  yechilganSavollar: 0,
  togriJavoblar: 0,
  completedLessons: [],
};

export function getProgress(): UserProgress {
  return read(KEYS.progress, defaultProgress);
}

export function saveProgress(progress: UserProgress): void {
  write(KEYS.progress, progress);
}

/** Bir savol yechilganda progress + XP + streak'ni yangilaydi, natijani qaytaradi. */
export function recordAnswer(mavzu: string, togriMi: boolean): UserProgress {
  const p = getProgress();
  const { streak, oxirgiFaollik } = updateStreak(p.oxirgiFaollik, p.streak);

  const mavzuStat = p.mavzular[mavzu] ?? { yechilgan: 0, togri: 0 };
  mavzuStat.yechilgan += 1;
  if (togriMi) mavzuStat.togri += 1;

  const xpGain = togriMi ? 10 : 2;
  const xp = p.xp + xpGain;

  const updated: UserProgress = {
    ...p,
    xp,
    streak,
    oxirgiFaollik,
    daraja: darajaForXp(xp),
    mavzular: { ...p.mavzular, [mavzu]: mavzuStat },
    yechilganSavollar: p.yechilganSavollar + 1,
    togriJavoblar: p.togriJavoblar + (togriMi ? 1 : 0),
  };
  saveProgress(updated);
  return updated;
}

export function completeLesson(mavzu: string): UserProgress {
  const p = getProgress();
  if (p.completedLessons.includes(mavzu)) return p;
  const updated = { ...p, completedLessons: [...p.completedLessons, mavzu] };
  saveProgress(updated);
  return updated;
}

export function addBonusXp(amount: number): UserProgress {
  const p = getProgress();
  const xp = p.xp + amount;
  const updated = { ...p, xp, daraja: darajaForXp(xp) };
  saveProgress(updated);
  return updated;
}

export function getMistakes(): MistakeEntry[] {
  return read(KEYS.mistakes, []);
}

export function addMistake(savol: Question, tanlangan: number): void {
  const mistakes = getMistakes();
  mistakes.unshift({
    id: `${savol.id}_${Date.now()}`,
    savol,
    tanlangan,
    sana: new Date().toISOString(),
    qaytaYechildi: false,
  });
  write(KEYS.mistakes, mistakes.slice(0, 200));
}

export function saveMistakes(mistakes: MistakeEntry[]): void {
  write(KEYS.mistakes, mistakes.slice(0, 200));
}

export function markMistakeSolved(id: string): void {
  const mistakes = getMistakes().map((m) => (m.id === id ? { ...m, qaytaYechildi: true } : m));
  write(KEYS.mistakes, mistakes);
}

export function getChatHistory(): ChatMessage[] {
  return read(KEYS.chatHistory, []);
}

export function saveChatHistory(messages: ChatMessage[]): void {
  write(KEYS.chatHistory, messages.slice(-20));
}

export function clearAccount(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

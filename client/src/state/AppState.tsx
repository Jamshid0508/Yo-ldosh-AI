import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { syncPull, syncPush } from "../lib/api";
import type { MistakeEntry, Question, UserProgress } from "../types";
import {
  addBonusXp,
  addMistake,
  completeLesson as completeLessonStorage,
  getMistakes,
  getProgress,
  getSettings,
  markMistakeSolved,
  recordAnswer,
  saveMistakes,
  saveProgress,
  saveSettings,
  type Settings,
} from "../lib/storage";

interface AppStateValue {
  progress: UserProgress;
  mistakes: MistakeEntry[];
  settings: Settings;
  answerQuestion: (mavzu: string, correct: boolean, question?: Question, chosenIdx?: number) => void;
  bonusXp: (amount: number) => void;
  completeLesson: (mavzu: string) => void;
  resolveMistake: (id: string) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  isDark: boolean;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function resolveIsDark(mode: Settings["darkMode"]): boolean {
  if (mode === "system") {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  }
  return mode;
}

function isFreshProgress(p: UserProgress): boolean {
  return p.xp === 0 && p.yechilganSavollar === 0 && p.completedLessons.length === 0;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(getProgress);
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(getMistakes);
  const [settings, setSettings] = useState<Settings>(getSettings);
  const [isDark, setIsDark] = useState(() => resolveIsDark(getSettings().darkMode));
  const hydrated = useRef(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (settings.darkMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => setIsDark(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [settings.darkMode]);

  // MongoDB Atlas ulangan bo'lsa: qurilmada progress bo'sh bo'lsa, serverdagi zaxiradan tiklaydi.
  // Mongo ulanmagan bo'lsa syncPull() jim null qaytaradi — ilova xatosiz localStorage'da davom etadi.
  useEffect(() => {
    (async () => {
      const snapshot = await syncPull();
      if (snapshot && isFreshProgress(getProgress())) {
        if (snapshot.progress) {
          saveProgress(snapshot.progress as UserProgress);
          setProgress(snapshot.progress as UserProgress);
        }
        if (snapshot.mistakes) {
          saveMistakes(snapshot.mistakes as MistakeEntry[]);
          setMistakes(snapshot.mistakes as MistakeEntry[]);
        }
      }
      hydrated.current = true;
    })();
  }, []);

  // Har o'zgarishdan 1.5s o'tib serverga zaxiralaydi (debounce). Mongo yo'q bo'lsa bu shunchaki muvaffaqiyatsiz bo'ladi va e'tiborsiz qoldiriladi.
  useEffect(() => {
    if (!hydrated.current) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      syncPush(progress, mistakes);
    }, 1500);
    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [progress, mistakes]);

  const answerQuestion = useCallback(
    (mavzu: string, correct: boolean, question?: Question, chosenIdx?: number) => {
      const updated = recordAnswer(mavzu, correct);
      setProgress(updated);
      if (!correct && question && chosenIdx !== undefined) {
        addMistake(question, chosenIdx);
        setMistakes(getMistakes());
      }
    },
    []
  );

  const bonusXp = useCallback((amount: number) => {
    setProgress(addBonusXp(amount));
  }, []);

  const completeLesson = useCallback((mavzu: string) => {
    setProgress(completeLessonStorage(mavzu));
  }, []);

  const resolveMistake = useCallback((id: string) => {
    markMistakeSolved(id);
    setMistakes(getMistakes());
  }, []);

  const toggleDarkMode = useCallback(() => {
    setSettings((prev) => {
      const currentlyDark = resolveIsDark(prev.darkMode);
      const next: Settings = { ...prev, darkMode: !currentlyDark };
      saveSettings(next);
      setIsDark(!currentlyDark);
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, sound: !prev.sound };
      saveSettings(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      progress,
      mistakes,
      settings,
      answerQuestion,
      bonusXp,
      completeLesson,
      resolveMistake,
      toggleDarkMode,
      toggleSound,
      isDark,
    }),
    [
      progress,
      mistakes,
      settings,
      answerQuestion,
      bonusXp,
      completeLesson,
      resolveMistake,
      toggleDarkMode,
      toggleSound,
      isDark,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState AppStateProvider ichida ishlatilishi kerak");
  return ctx;
}

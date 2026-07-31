import { motion } from "framer-motion";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LearningPath from "../components/LearningPath";
import { LESSONS, lessonStatus } from "../data/lessons";
import { isStreakAlive } from "../lib/gamification";
import { useAppState } from "../state/AppState";

export default function Home() {
  const { progress } = useAppState();
  const navigate = useNavigate();

  const streakOn = isStreakAlive(progress.oxirgiFaollik);

  const currentLesson = useMemo(
    () => LESSONS.find((l) => lessonStatus(l.id, progress.completedLessons) === "current") ?? LESSONS[0],
    [progress.completedLessons]
  );

  const accuracy = progress.yechilganSavollar
    ? Math.round((progress.togriJavoblar / progress.yechilganSavollar) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-extrabold">Salom! 👋</h1>
          <p className="text-sm text-[var(--fg)]/70">Bugun ham mashq qilaylik</p>
        </div>
        <motion.div
          animate={streakOn ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 1.4, repeat: streakOn ? Infinity : 0 }}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 font-heading font-bold ${
            streakOn ? "bg-marking/20 text-marking" : "bg-gray-200 text-gray-400 dark:bg-gray-700"
          }`}
        >
          🔥 {progress.streak}
        </motion.div>
      </div>

      <button
        onClick={() => navigate(currentLesson.id === "imtihon" ? "/exam" : `/lesson/${currentLesson.id}`)}
        className="card focus-ring flex items-center gap-4 p-4 text-left"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sign-blue text-2xl text-white">
          {currentLesson.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase text-gray-400">Bugungi mashq</p>
          <p className="font-heading font-bold">{currentLesson.nom}</p>
        </div>
        <span className="btn-3d rounded-btn bg-marking px-4 py-2 font-heading text-sm font-bold text-asphalt">
          Boshlash
        </span>
      </button>

      <div>
        <h2 className="mb-1 font-heading text-sm font-bold uppercase text-gray-400">O'quv yo'li</h2>
        <div className="card py-2">
          <LearningPath />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate("/situation")} className="card focus-ring flex flex-col gap-2 p-4 text-left">
          <span className="text-2xl">🧩</span>
          <span className="font-heading text-sm font-bold">Vaziyat tahlili</span>
          <span className="text-xs text-gray-500">AI sxema chizadi</span>
        </button>
        <button onClick={() => navigate("/sign-check")} className="card focus-ring flex flex-col gap-2 p-4 text-left">
          <span className="text-2xl">📷</span>
          <span className="font-heading text-sm font-bold">Belgi tekshiruvi</span>
          <span className="text-xs text-gray-500">Rasmni yuklang</span>
        </button>
      </div>

      <div className="card grid grid-cols-3 divide-x divide-gray-100 p-4 text-center dark:divide-gray-700">
        <div>
          <p className="font-mono-num text-lg font-bold text-sign-blue dark:text-marking">
            {progress.completedLessons.filter((l) => l !== "imtihon").length}/{LESSONS.length - 1}
          </p>
          <p className="text-[11px] text-gray-500">Darslar</p>
        </div>
        <div>
          <p className="font-mono-num text-lg font-bold text-sign-blue dark:text-marking">{progress.yechilganSavollar}</p>
          <p className="text-[11px] text-gray-500">Savollar</p>
        </div>
        <div>
          <p className="font-mono-num text-lg font-bold text-sign-blue dark:text-marking">{accuracy}%</p>
          <p className="text-[11px] text-gray-500">Aniqlik</p>
        </div>
      </div>
    </div>
  );
}

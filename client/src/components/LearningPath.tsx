import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LESSONS, lessonStatus } from "../data/lessons";
import { useAppState } from "../state/AppState";

const ZIGZAG = [0, 34, -34, 44, -20, 20, -44, 30, -30, 0];

export default function LearningPath() {
  const { progress } = useAppState();
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto flex flex-col items-center gap-2 px-12 py-4">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[64px] -translate-x-1/2 rounded-full"
        style={{
          background: "var(--asphalt)",
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--marking) 0 14px, transparent 14px 28px)",
          backgroundSize: "6px 100%",
          backgroundPosition: "center",
          backgroundRepeat: "repeat-y",
          opacity: 0.9,
        }}
        aria-hidden
      />

      {LESSONS.map((lesson, idx) => {
        const status = lessonStatus(lesson.id, progress.completedLessons);
        const offset = ZIGZAG[idx % ZIGZAG.length];
        const isExam = lesson.id === "imtihon";

        const colors =
          status === "completed"
            ? "bg-success text-white shadow-btn-3d-success"
            : status === "current"
            ? isExam
              ? "bg-danger text-white shadow-btn-3d-danger"
              : "bg-sign-blue text-white shadow-btn-3d"
            : "bg-gray-300 text-gray-500 shadow-none dark:bg-gray-700 dark:text-gray-500";

        return (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 16, x: offset }}
            animate={{ opacity: 1, y: 0, x: offset }}
            transition={{ delay: idx * 0.04 }}
            className="relative z-10 flex flex-col items-center gap-1"
          >
            <motion.button
              disabled={status === "locked"}
              onClick={() => navigate(isExam ? "/exam" : `/lesson/${lesson.id}`)}
              whileTap={status !== "locked" ? { scale: 0.92 } : undefined}
              animate={status === "current" ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 1.6, repeat: status === "current" ? Infinity : 0 }}
              className={`focus-ring flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-2xl transition-colors dark:border-[#1b1e24] ${colors}`}
              aria-label={lesson.nom}
            >
              {status === "completed" ? "✓" : lesson.icon}
            </motion.button>
            <span className="max-w-[88px] text-center font-heading text-[11px] font-semibold leading-tight text-[var(--fg)]">
              {lesson.nom}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

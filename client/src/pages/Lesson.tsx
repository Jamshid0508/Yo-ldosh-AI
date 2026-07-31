import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuizRunner, { type QuizResult } from "../components/QuizRunner";
import { LESSONS } from "../data/lessons";
import questionsData from "../data/questions.json";
import { useAppState } from "../state/AppState";
import type { Question } from "../types";

const XP_LESSON_BONUS = 20;

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { completeLesson, bonusXp } = useAppState();
  const [result, setResult] = useState<QuizResult | null>(null);

  const lesson = LESSONS.find((l) => l.id === id);

  const questions = useMemo(() => {
    if (!lesson) return [];
    const all = questionsData as Question[];
    return all.filter((q) => q.mavzu === lesson.mavzu).slice(0, 10);
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="p-6 text-center">
        <p>Dars topilmadi.</p>
        <button onClick={() => navigate("/home")} className="mt-3 text-sign-blue underline">
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  function handleFinish(r: QuizResult) {
    setResult(r);
    completeLesson(lesson!.id);
    bonusXp(XP_LESSON_BONUS);
  }

  if (result) {
    const foiz = result.jami ? Math.round((result.togri / result.jami) * 100) : 0;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-6xl">{foiz >= 80 ? "🎉" : foiz >= 50 ? "👍" : "💪"}</div>
        <h1 className="font-heading text-2xl font-extrabold">Dars tugadi!</h1>
        <p className="text-[var(--fg)]/80">
          {result.togri}/{result.jami} to'g'ri ({foiz}%) · +{XP_LESSON_BONUS} XP
        </p>
        <button
          onClick={() => navigate("/home")}
          className="btn-3d focus-ring w-full max-w-xs rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 border-b p-4" style={{ borderColor: "var(--card-border)" }}>
        <button onClick={() => navigate(-1)} className="focus-ring text-xl" aria-label="Orqaga">
          ←
        </button>
        <h1 className="font-heading font-bold">{lesson.nom}</h1>
      </div>
      {questions.length > 0 ? (
        <QuizRunner questions={questions} onFinish={handleFinish} />
      ) : (
        <p className="p-6 text-center text-sm text-gray-500">
          Bu mavzu uchun hozircha lokal savollar yo'q. Tez orada qo'shiladi!
        </p>
      )}
    </div>
  );
}

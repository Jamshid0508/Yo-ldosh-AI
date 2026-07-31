import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizRunner, { type QuizResult } from "../components/QuizRunner";
import questionsData from "../data/questions.json";
import { useAppState } from "../state/AppState";
import type { Question } from "../types";

const EXAM_QUESTION_COUNT = 20;
const EXAM_TIME_SEC = 25 * 60;
const EXAM_MAX_MISTAKES = 2;
const XP_EXAM_PASS_BONUS = 50;

export default function Exam() {
  const navigate = useNavigate();
  const { bonusXp, progress } = useAppState();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const questions = useMemo(() => {
    const all = questionsData as Question[];
    const nonExamPool = all.filter((q) => q.mavzu !== "imtihon");
    const shuffled = [...nonExamPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, EXAM_QUESTION_COUNT);
  }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFinish(r: QuizResult) {
    setResult(r);
    if (r.muvaffaqiyatli) bonusXp(XP_EXAM_PASS_BONUS);
  }

  function share() {
    if (!result) return;
    const text = `Yo'ldosh AI imtihon simulyatorida ${result.togri}/${result.jami} to'g'ri javob bilan ${
      result.muvaffaqiyatli ? "MUVAFFAQIYATLI o'tdim! 🏆" : "sinovdan o'tdim."
    }`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
    }
  }

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-6xl">🏁</div>
        <h1 className="font-heading text-2xl font-extrabold">Imtihon simulyatori</h1>
        <p className="max-w-xs text-[var(--fg)]/80">
          {EXAM_QUESTION_COUNT} savol · {EXAM_TIME_SEC / 60} daqiqa · ko'pi bilan {EXAM_MAX_MISTAKES} xato — real
          imtihon shartlarida.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="btn-3d focus-ring w-full max-w-xs rounded-btn bg-danger py-3 font-heading font-bold text-white shadow-btn-3d-danger"
        >
          Boshlash
        </button>
        <button onClick={() => navigate(-1)} className="focus-ring text-sm text-gray-500">
          Bekor qilish
        </button>
      </div>
    );
  }

  if (result) {
    const foiz = Math.round((result.togri / result.jami) * 100);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <div
          className={`card w-full max-w-xs border-2 p-6 ${
            result.muvaffaqiyatli ? "border-success" : "border-danger"
          }`}
        >
          <p className="text-5xl">{result.muvaffaqiyatli ? "🏆" : "😔"}</p>
          <h1 className="mt-2 font-heading text-xl font-extrabold">
            {result.muvaffaqiyatli ? "Imtihondan o'tdingiz!" : "Bu safar omad kelmadi"}
          </h1>
          <p className="mt-2 font-mono-num text-3xl font-bold text-sign-blue dark:text-marking">
            {result.togri}/{result.jami}
          </p>
          <p className="text-sm text-gray-500">({foiz}% to'g'ri javob)</p>
          <p className="mt-2 text-xs text-gray-400">Daraja: {progress.daraja}</p>
        </div>
        <button
          onClick={share}
          className="btn-3d focus-ring w-full max-w-xs rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
        >
          Natijani ulashish
        </button>
        <button onClick={() => navigate("/home")} className="focus-ring text-sm text-gray-500">
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 border-b p-4" style={{ borderColor: "var(--card-border)" }}>
        <h1 className="font-heading font-bold">🏁 Imtihon simulyatori</h1>
      </div>
      <QuizRunner
        questions={questions}
        timeLimitSec={EXAM_TIME_SEC}
        maxMistakes={EXAM_MAX_MISTAKES}
        onFinish={handleFinish}
        allowAskAi={false}
      />
    </div>
  );
}

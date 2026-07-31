import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Question } from "../types";
import { useAppState } from "../state/AppState";
import QuizCard from "./QuizCard";

export interface QuizResult {
  togri: number;
  jami: number;
  vaqtTugadimi: boolean;
  muvaffaqiyatli: boolean;
}

interface Props {
  questions: Question[];
  timeLimitSec?: number;
  maxMistakes?: number;
  onFinish: (result: QuizResult) => void;
  onEachAnswer?: (question: Question, correct: boolean) => void;
  trackProgress?: boolean;
  allowAskAi?: boolean;
}

export default function QuizRunner({
  questions,
  timeLimitSec,
  maxMistakes,
  onFinish,
  onEachAnswer,
  trackProgress = true,
  allowAskAi = true,
}: Props) {
  const [index, setIndex] = useState(0);
  const [togri, setTogri] = useState(0);
  const [xato, setXato] = useState(0);
  const [answeredIdx, setAnsweredIdx] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(timeLimitSec ?? 0);
  const { answerQuestion } = useAppState();
  const navigate = useNavigate();

  const current = questions[index];

  useEffect(() => {
    if (!timeLimitSec) return;
    const timer = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timer);
          finish(togri, true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimitSec]);

  function finish(finalTogri: number, vaqtTugadimi: boolean, finalXato = xato) {
    const muvaffaqiyatli = maxMistakes === undefined ? true : finalXato <= maxMistakes;
    onFinish({ togri: finalTogri, jami: questions.length, vaqtTugadimi, muvaffaqiyatli });
  }

  function handleAnswer(correct: boolean, chosenIdx: number) {
    if (trackProgress) answerQuestion(current.mavzu, correct, current, chosenIdx);
    onEachAnswer?.(current, correct);
    const newTogri = correct ? togri + 1 : togri;
    const newXato = correct ? xato : xato + 1;
    setTogri(newTogri);
    setXato(newXato);
    setAnsweredIdx(index);

    if (maxMistakes !== undefined && newXato > maxMistakes) {
      setTimeout(() => finish(newTogri, false, newXato), 1400);
      return;
    }
    if (index === questions.length - 1) {
      setTimeout(() => finish(newTogri, false, newXato), 1400);
    }
  }

  function next() {
    if (index < questions.length - 1) setIndex(index + 1);
  }

  function askAi() {
    navigate("/chat", {
      state: { context: { mavzu: current.mavzu, belgi_id: current.belgi_id ?? undefined } },
    });
  }

  if (!current) {
    return <p className="p-4 text-center text-sm text-gray-500">Savollar topilmadi.</p>;
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>
          Savol {index + 1}/{questions.length}
        </span>
        {timeLimitSec !== undefined && (
          <span className="font-mono-num text-sign-blue dark:text-marking">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        )}
        {maxMistakes !== undefined && (
          <span className={xato > 0 ? "text-danger" : "text-gray-400"}>
            Xato: {xato}/{maxMistakes + 1}
          </span>
        )}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-sign-blue transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <QuizCard
        key={current.id}
        question={current}
        onAnswer={handleAnswer}
        onAskAi={allowAskAi ? askAi : undefined}
      />

      {index < questions.length - 1 && answeredIdx === index && (
        <button
          onClick={next}
          className="btn-3d focus-ring rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
        >
          Keyingi savol
        </button>
      )}
    </div>
  );
}

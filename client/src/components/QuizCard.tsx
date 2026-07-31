import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Question } from "../types";
import SceneRenderer from "./SceneRenderer/SceneRenderer";
import SignImage from "./SignImage";

interface Props {
  question: Question;
  onAnswer: (correct: boolean, chosenIdx: number) => void;
  onAskAi?: () => void;
}

export default function QuizCard({ question, onAnswer, onAskAi }: Props) {
  const [chosen, setChosen] = useState<number | null>(null);
  const answered = chosen !== null;
  const correct = chosen === question.togri;

  function pick(idx: number) {
    if (answered) return;
    setChosen(idx);
    onAnswer(idx === question.togri, idx);
  }

  return (
    <div className="card flex flex-col gap-4 p-4">
      <p className="font-heading text-lg font-bold leading-snug">{question.savol}</p>

      {question.belgi_id && (
        <div className="flex justify-center py-2">
          <SignImage id={question.belgi_id} size={120} />
        </div>
      )}

      {question.sxema && (
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--card-border)" }}>
          <SceneRenderer scene={question.sxema} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {question.variantlar.map((variant, idx) => {
          const isCorrect = idx === question.togri;
          const isChosen = idx === chosen;
          let stateClasses = "border-gray-200 dark:border-gray-700";
          if (answered && isCorrect) {
            stateClasses = "border-success bg-success/10 text-success";
          } else if (answered && isChosen && !isCorrect) {
            stateClasses = "border-danger bg-danger/10 text-danger";
          }

          return (
            <motion.button
              key={idx}
              disabled={answered}
              onClick={() => pick(idx)}
              whileTap={!answered ? { scale: 0.98 } : undefined}
              animate={answered && isChosen && !isCorrect ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.35 }}
              className={`focus-ring rounded-btn border-2 px-4 py-3 text-left font-medium transition-colors disabled:cursor-default ${stateClasses}`}
            >
              {variant}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-btn p-3 text-sm ${
              correct ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            }`}
          >
            <p className="mb-1 font-heading font-bold">
              {correct ? "✅ To'g'ri!" : "❌ Noto'g'ri"}
            </p>
            <p className="text-[var(--fg)]">{question.izoh}</p>
            {onAskAi && (
              <button
                onClick={onAskAi}
                className="focus-ring mt-2 text-sm font-semibold text-sign-blue underline dark:text-marking"
              >
                🤖 AI'dan batafsil so'rash
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

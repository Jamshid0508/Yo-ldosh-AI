import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizRunner, { type QuizResult } from "../components/QuizRunner";
import questionsData from "../data/questions.json";
import { markOnboarded } from "../lib/storage";
import type { Question } from "../types";

const SLIDES = [
  { icon: "📝", title: "Test yeching", text: "Rasmli savollar bilan YHQ bo'yicha bilimingizni sinang." },
  { icon: "🧩", title: "Vaziyatni tasvirlang", text: "So'z bilan yozing — AI chorraha sxemasini chizib, tahlil qiladi." },
  { icon: "📷", title: "Belgini tekshiring", text: "Ko'chadagi belgi rasmini yuklang — AI uning to'g'ri o'rnatilganini baholaydi." },
];

type Stage = "slides" | "levelcheck" | "result";

export default function Onboarding() {
  const [slide, setSlide] = useState(0);
  const [stage, setStage] = useState<Stage>("slides");
  const [result, setResult] = useState<QuizResult | null>(null);
  const navigate = useNavigate();

  const levelQuestions = useMemo(() => {
    const all = questionsData as Question[];
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  function finishOnboarding() {
    markOnboarded();
    navigate("/home", { replace: true });
  }

  if (stage === "levelcheck") {
    return (
      <div className="mx-auto min-h-screen max-w-[520px] bg-[var(--bg)] text-[var(--fg)]">
        <div className="p-4">
          <h1 className="font-heading text-lg font-bold">Daraja aniqlash testi</h1>
          <p className="text-sm text-gray-500">5 ta savol — bu boshlanish nuqtangizni belgilaydi.</p>
        </div>
        <QuizRunner
          questions={levelQuestions}
          onFinish={(r) => {
            setResult(r);
            setStage("result");
          }}
        />
      </div>
    );
  }

  if (stage === "result" && result) {
    const foiz = Math.round((result.togri / result.jami) * 100);
    const tavsiya =
      foiz >= 80
        ? "Siz yaxshi tayyorgarlikka egasiz — imtihon simulyatoridan boshlashingiz mumkin!"
        : foiz >= 40
        ? "Yaxshi boshlanish! Umumiy qoidalar darsidan boshlashni tavsiya qilamiz."
        : "Hech qisi yo'q — Umumiy qoidalar va Belgilar darslaridan boshlaymiz.";

    return (
      <div className="mx-auto flex min-h-screen max-w-[520px] flex-col items-center justify-center gap-4 bg-[var(--bg)] p-6 text-center text-[var(--fg)]">
        <div className="text-6xl">{foiz >= 80 ? "🏆" : foiz >= 40 ? "👍" : "🌱"}</div>
        <h1 className="font-heading text-2xl font-extrabold">
          {result.togri}/{result.jami} to'g'ri ({foiz}%)
        </h1>
        <p className="max-w-xs text-[var(--fg)]/80">{tavsiya}</p>
        <button
          onClick={finishOnboarding}
          className="btn-3d focus-ring w-full rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
        >
          Boshlash
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[520px] flex-col justify-between bg-[var(--bg)] p-6 text-[var(--fg)]">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-7xl">{SLIDES[slide].icon}</div>
            <h1 className="font-heading text-2xl font-extrabold">{SLIDES[slide].title}</h1>
            <p className="max-w-xs text-[var(--fg)]/80">{SLIDES[slide].text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === slide ? "bg-sign-blue" : "bg-gray-300 dark:bg-gray-600"}`}
            />
          ))}
        </div>
        <button
          onClick={() => (slide < SLIDES.length - 1 ? setSlide(slide + 1) : setStage("levelcheck"))}
          className="btn-3d focus-ring rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
        >
          {slide < SLIDES.length - 1 ? "Davom etish" : "Daraja aniqlash testi"}
        </button>
        <button onClick={finishOnboarding} className="focus-ring py-2 text-sm font-medium text-gray-500">
          O'tkazib yuborish
        </button>
      </div>
    </div>
  );
}

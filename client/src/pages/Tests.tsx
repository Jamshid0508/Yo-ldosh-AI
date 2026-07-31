import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/QuizCard";
import QuizRunner, { type QuizResult } from "../components/QuizRunner";
import { LESSONS } from "../data/lessons";
import questionsData from "../data/questions.json";
import { aiGenerateTest, ApiError } from "../lib/api";
import { useAppState } from "../state/AppState";
import type { Question } from "../types";

type View = "hub" | "quick-pick" | "quick-run" | "quick-result" | "endless-pick" | "endless-run" | "mistakes-run" | "mistakes-result";

export default function Tests() {
  const [view, setView] = useState<View>("hub");
  const [mavzu, setMavzu] = useState<string>(LESSONS[0].mavzu);
  const [quickQuestions, setQuickQuestions] = useState<Question[]>([]);
  const [quickResult, setQuickResult] = useState<QuizResult | null>(null);
  const [mistakesResult, setMistakesResult] = useState<QuizResult | null>(null);
  const { mistakes, resolveMistake } = useAppState();
  const navigate = useNavigate();

  const unsolvedMistakes = useMemo(() => mistakes.filter((m) => !m.qaytaYechildi), [mistakes]);

  function startQuickTest() {
    const all = questionsData as Question[];
    const pool = all.filter((q) => q.mavzu === mavzu);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuickQuestions(shuffled);
    setView("quick-run");
  }

  if (view === "quick-pick") {
    return (
      <TopicPicker
        title="Tez test — mavzu tanlang"
        onBack={() => setView("hub")}
        selected={mavzu}
        onSelect={setMavzu}
        onConfirm={startQuickTest}
      />
    );
  }

  if (view === "quick-run") {
    return (
      <QuizRunner
        questions={quickQuestions}
        onFinish={(r) => {
          setQuickResult(r);
          setView("quick-result");
        }}
      />
    );
  }

  if (view === "quick-result" && quickResult) {
    const foiz = Math.round((quickResult.togri / quickResult.jami) * 100);
    return (
      <ResultScreen
        emoji={foiz >= 80 ? "🎉" : foiz >= 50 ? "👍" : "💪"}
        title={`${quickResult.togri}/${quickResult.jami} to'g'ri (${foiz}%)`}
        onBack={() => setView("hub")}
      />
    );
  }

  if (view === "endless-pick") {
    return (
      <TopicPicker
        title="Cheksiz rejim — mavzu tanlang"
        onBack={() => setView("hub")}
        selected={mavzu}
        onSelect={setMavzu}
        onConfirm={() => setView("endless-run")}
      />
    );
  }

  if (view === "endless-run") {
    return <EndlessMode mavzu={mavzu} onExit={() => setView("hub")} />;
  }

  if (view === "mistakes-run") {
    return (
      <QuizRunner
        questions={unsolvedMistakes.map((m) => m.savol)}
        trackProgress={false}
        onEachAnswer={(q, correct) => {
          if (correct) {
            const mistake = unsolvedMistakes.find((m) => m.savol.id === q.id);
            if (mistake) resolveMistake(mistake.id);
          }
        }}
        onFinish={(r) => {
          setMistakesResult(r);
          setView("mistakes-result");
        }}
      />
    );
  }

  if (view === "mistakes-result" && mistakesResult) {
    return (
      <ResultScreen
        emoji="🧹"
        title={`${mistakesResult.togri}/${mistakesResult.jami} to'g'ri tuzatildi`}
        onBack={() => setView("hub")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-heading text-xl font-extrabold">Testlar</h1>

      <button onClick={() => setView("quick-pick")} className="card focus-ring flex items-center gap-4 p-4 text-left">
        <span className="text-3xl">⚡</span>
        <div>
          <p className="font-heading font-bold">Tez test</p>
          <p className="text-xs text-gray-500">Mavzu tanlang — 5 ta savol</p>
        </div>
      </button>

      <button onClick={() => navigate("/exam")} className="card focus-ring flex items-center gap-4 p-4 text-left">
        <span className="text-3xl">🏁</span>
        <div>
          <p className="font-heading font-bold">Imtihon simulyatori</p>
          <p className="text-xs text-gray-500">20 savol · 25 daqiqa · ko'pi bilan 2 xato</p>
        </div>
      </button>

      <button onClick={() => setView("endless-pick")} className="card focus-ring flex items-center gap-4 p-4 text-left">
        <span className="text-3xl">🤖</span>
        <div>
          <p className="font-heading font-bold">Cheksiz rejim (AI)</p>
          <p className="text-xs text-gray-500">AI doimiy yangi savollar tuzadi</p>
        </div>
      </button>

      <button
        onClick={() => unsolvedMistakes.length > 0 && setView("mistakes-run")}
        disabled={unsolvedMistakes.length === 0}
        className="card focus-ring flex items-center gap-4 p-4 text-left disabled:opacity-50"
      >
        <span className="text-3xl">🧹</span>
        <div>
          <p className="font-heading font-bold">Xatolar ustida ishlash</p>
          <p className="text-xs text-gray-500">
            {unsolvedMistakes.length > 0 ? `${unsolvedMistakes.length} ta noto'g'ri javob` : "Xatolaringiz yo'q — zo'r!"}
          </p>
        </div>
      </button>
    </div>
  );
}

function TopicPicker({
  title,
  selected,
  onSelect,
  onConfirm,
  onBack,
}: {
  title: string;
  selected: string;
  onSelect: (m: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const topics = LESSONS.filter((l) => l.id !== "imtihon");
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="focus-ring text-xl" aria-label="Orqaga">
          ←
        </button>
        <h1 className="font-heading font-bold">{title}</h1>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {topics.map((t) => (
          <button
            key={t.mavzu}
            onClick={() => onSelect(t.mavzu)}
            className={`focus-ring rounded-btn border-2 p-3 text-left ${
              selected === t.mavzu ? "border-sign-blue bg-sign-blue/10" : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <p className="mt-1 text-sm font-semibold">{t.nom}</p>
          </button>
        ))}
      </div>
      <button
        onClick={onConfirm}
        className="btn-3d focus-ring rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
      >
        Boshlash
      </button>
    </div>
  );
}

function ResultScreen({ emoji, title, onBack }: { emoji: string; title: string; onBack: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-6xl">{emoji}</div>
      <h1 className="font-heading text-2xl font-extrabold">{title}</h1>
      <button
        onClick={onBack}
        className="btn-3d focus-ring w-full max-w-xs rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
      >
        Testlarga qaytish
      </button>
    </div>
  );
}

function EndlessMode({ mavzu, onExit }: { mavzu: string; onExit: () => void }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState({ togri: 0, jami: 0 });
  const [askedTexts, setAskedTexts] = useState<string[]>([]);
  const { answerQuestion } = useAppState();

  async function loadNext() {
    setLoading(true);
    setError(null);
    try {
      const q = await aiGenerateTest(mavzu, 2, askedTexts.slice(-8));
      setAskedTexts((prev) => [...prev, q.savol]);
      setQuestion({
        id: `ai_${Date.now()}`,
        savol: q.savol,
        belgi_id: null,
        sxema: null,
        variantlar: q.variantlar,
        togri: q.togri,
        izoh: q.izoh,
        mavzu,
        qiyinlik: q.qiyinlik,
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "AI hozircha javob bera olmadi.");
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  }

  useMemo(() => {
    loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="focus-ring text-xl" aria-label="Orqaga">
          ←
        </button>
        <span className="font-mono-num text-sm">
          {score.togri}/{score.jami} to'g'ri
        </span>
      </div>

      {loading && <p className="p-8 text-center text-sm text-gray-500">AI savol tuzmoqda...</p>}

      {error && (
        <div className="card p-4 text-center">
          <p className="mb-2 text-sm text-danger">{error}</p>
          <p className="mb-3 text-xs text-gray-500">
            Tashvishlanmang — lokal savollar bazasi bilan "Tez test" rejimida davom etishingiz mumkin.
          </p>
          <button onClick={loadNext} className="btn-3d focus-ring rounded-btn bg-sign-blue px-4 py-2 text-sm font-bold text-white">
            Qayta urinish
          </button>
        </div>
      )}

      {!loading && !error && question && (
        <QuizCard
          key={question.id}
          question={question}
          onAnswer={(correct) => {
            answerQuestion(mavzu, correct);
            setScore((s) => ({ togri: s.togri + (correct ? 1 : 0), jami: s.jami + 1 }));
          }}
        />
      )}

      {!loading && question && (
        <button
          onClick={loadNext}
          className="btn-3d focus-ring rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
        >
          Keyingi savol
        </button>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignImage from "../components/SignImage";
import { getAllSigns } from "../lib/signAssets";
import type { RoadSign } from "../types";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildOptions(correct: RoadSign, all: RoadSign[]): string[] {
  const others = shuffle(all.filter((s) => s.id !== correct.id)).slice(0, 3).map((s) => s.nom);
  return shuffle([correct.nom, ...others]);
}

export default function SignsFlashcards() {
  const navigate = useNavigate();
  const allSigns = useMemo(() => getAllSigns(), []);
  const [queue, setQueue] = useState<RoadSign[]>(() => shuffle(allSigns));
  const [stats, setStats] = useState({ togri: 0, jami: 0 });
  const [chosen, setChosen] = useState<string | null>(null);

  const current = queue[0];
  const options = useMemo(() => (current ? buildOptions(current, allSigns) : []), [current, allSigns]);

  function answer(option: string) {
    if (chosen || !current) return;
    setChosen(option);
    const correct = option === current.nom;
    setStats((s) => ({ togri: s.togri + (correct ? 1 : 0), jami: s.jami + 1 }));

    setTimeout(() => {
      setQueue((q) => {
        const [first, ...rest] = q;
        if (correct) return rest;
        const insertAt = Math.min(3, rest.length);
        return [...rest.slice(0, insertAt), first, ...rest.slice(insertAt)];
      });
      setChosen(null);
    }, 900);
  }

  if (!current) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-6xl">🎉</div>
        <h1 className="font-heading text-2xl font-extrabold">Barcha kartalar tugadi!</h1>
        <p className="text-[var(--fg)]/80">
          {stats.togri}/{stats.jami} to'g'ri urinish
        </p>
        <button
          onClick={() => navigate("/signs")}
          className="btn-3d focus-ring w-full max-w-xs rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
        >
          Katalogga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="focus-ring text-xl" aria-label="Orqaga">
          ←
        </button>
        <span className="font-mono-num text-sm text-gray-400">Qoldi: {queue.length}</span>
      </div>

      <div className="flex justify-center py-6">
        <SignImage id={current.id} size={160} />
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          let cls = "border-gray-200 dark:border-gray-700";
          if (chosen) {
            if (opt === current.nom) cls = "border-success bg-success/10 text-success";
            else if (opt === chosen) cls = "border-danger bg-danger/10 text-danger";
          }
          return (
            <button
              key={opt}
              onClick={() => answer(opt)}
              disabled={!!chosen}
              className={`focus-ring rounded-btn border-2 px-4 py-3 text-left font-medium disabled:cursor-default ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

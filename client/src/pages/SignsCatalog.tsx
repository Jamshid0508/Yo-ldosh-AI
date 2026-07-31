import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignImage from "../components/SignImage";
import { getAllSigns } from "../lib/signAssets";
import type { SignCategory } from "../types";

const CATEGORIES: { key: SignCategory | "hammasi"; label: string }[] = [
  { key: "hammasi", label: "Hammasi" },
  { key: "ogohlantiruvchi", label: "Ogohlantiruvchi" },
  { key: "imtiyoz", label: "Imtiyoz" },
  { key: "taqiqlovchi", label: "Taqiqlovchi" },
  { key: "buyuruvchi", label: "Buyuruvchi" },
  { key: "axborot-ishora", label: "Axborot-ishora" },
  { key: "servis", label: "Servis" },
  { key: "qoshimcha", label: "Qo'shimcha lavha" },
];

export default function SignsCatalog() {
  const [category, setCategory] = useState<SignCategory | "hammasi">("hammasi");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const allSigns = useMemo(() => getAllSigns(), []);

  const filtered = allSigns.filter((s) => {
    const matchesCategory = category === "hammasi" || s.kategoriya === category;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || s.nom.toLowerCase().includes(q) || s.id.includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-extrabold">Belgilar</h1>
        <button
          onClick={() => navigate("/signs/cards")}
          className="btn-3d focus-ring rounded-btn bg-marking px-3 py-2 text-sm font-bold text-asphalt"
        >
          🃏 Flashcard
        </button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nom yoki raqam bo'yicha qidiring..."
        className="focus-ring rounded-btn border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-600"
      />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`focus-ring shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              category === c.key
                ? "bg-sign-blue text-white"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="pt-8 text-center text-sm text-gray-500">Hech narsa topilmadi.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/signs/${s.id}`)}
              className="focus-ring flex flex-col items-center gap-1.5 rounded-card p-2 text-center"
            >
              <SignImage id={s.id} size={64} />
              <span className="font-mono-num text-[10px] text-gray-400">{s.id}</span>
              <span className="line-clamp-2 text-[11px] font-medium leading-tight">{s.nom}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

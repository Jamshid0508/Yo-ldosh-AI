import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SceneRenderer from "../components/SceneRenderer/SceneRenderer";
import { aiVaziyat, ApiError } from "../lib/api";
import { downloadSvgAsPng } from "../lib/exportSvg";
import type { VaziyatResponse } from "../types";

const EXAMPLES = [
  "Teng ahamiyatli chorrahada men to'g'riga, chapdan kelayotgan mashina o'ngga burilmoqchi. Kim o'tadi?",
  "Bosh yo'ldan ketyapman, kichik yo'ldan chiquvchi mashina to'xtamadi. Kim aybdor?",
  "Piyodalar o'tish joyida piyoda o'tayapti, men to'g'riga ketyapman. Nima qilishim kerak?",
];

export default function Situation() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VaziyatResponse | null>(null);
  const [fallbackMsg, setFallbackMsg] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  async function analyze(input: string) {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    setFallbackMsg(null);
    setResult(null);
    try {
      const data = await aiVaziyat(trimmed);
      if (!data) {
        setFallbackMsg(
          "AI aniq sxema tuza olmadi, lekin savolingizni qayta, biroz aniqroq (masalan qaysi tomondan kim kelayotgani) tasvirlab ko'ring."
        );
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "AI hozircha javob bera olmadi.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPng() {
    if (!svgRef.current) return;
    try {
      await downloadSvgAsPng(svgRef.current, "yoldosh-ai-sxema.png");
    } catch {
      setError("Sxemani yuklab bo'lmadi.");
    }
  }

  function share() {
    if (!result) return;
    const text = `Yo'ldosh AI vaziyat tahlili:\n${result.tahlil.xulosa}\nKim haq: ${result.tahlil.kim_haq}`;
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="focus-ring text-xl" aria-label="Orqaga">
          ←
        </button>
        <h1 className="font-heading text-lg font-bold">🧩 Vaziyat tahlili</h1>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Vaziyatni so'z bilan tasvirlab yozing..."
        rows={4}
        className="focus-ring rounded-btn border border-gray-300 bg-transparent p-3 text-sm dark:border-gray-600"
      />

      {!result && !loading && (
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setText(ex)}
              className="focus-ring rounded-full border border-gray-300 px-3 py-1.5 text-left text-xs text-gray-500 dark:border-gray-600"
            >
              {ex.length > 40 ? ex.slice(0, 40) + "…" : ex}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => analyze(text)}
        disabled={loading || !text.trim()}
        className="btn-3d focus-ring rounded-btn bg-sign-blue py-3 font-heading font-bold text-white disabled:opacity-50"
      >
        {loading ? "Tahlil qilinmoqda..." : "Tahlil qilish"}
      </button>

      {error && (
        <div className="rounded-btn bg-danger/10 p-3 text-sm text-danger">
          {error}
          <p className="mt-1 text-xs">Internet yoki AI mavjud bo'lmasa ham, lokal testlar va belgilar katalogi ishlayveradi.</p>
        </div>
      )}

      {fallbackMsg && <div className="rounded-btn bg-marking/15 p-3 text-sm">{fallbackMsg}</div>}

      {result && (
        <div className="flex flex-col gap-3">
          {result.sxema && (
            <div className="overflow-hidden rounded-card border" style={{ borderColor: "var(--card-border)" }}>
              <SceneRenderer ref={svgRef} scene={result.sxema} />
            </div>
          )}

          <div className="card flex flex-col gap-3 p-4">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Xulosa</p>
              <p className="text-sm">{result.tahlil.xulosa}</p>
            </div>
            {result.tahlil.qoidalar.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Tegishli qoidalar</p>
                <ul className="list-inside list-disc text-sm">
                  {result.tahlil.qoidalar.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Kim haq</p>
              <p className="text-sm">{result.tahlil.kim_haq}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Javobgarlik</p>
              <p className="text-sm">{result.tahlil.javobgarlik}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Maslahat</p>
              <p className="text-sm">{result.tahlil.maslahat}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {result.sxema && (
              <button
                onClick={downloadPng}
                className="focus-ring rounded-btn border-2 border-sign-blue py-2.5 text-sm font-bold text-sign-blue"
              >
                ⬇️ Sxemani yuklab olish
              </button>
            )}
            <button
              onClick={share}
              className="focus-ring rounded-btn border-2 border-sign-blue py-2.5 text-sm font-bold text-sign-blue"
            >
              📤 Ulashish
            </button>
          </div>
        </div>
      )}

      <p className="pb-4 text-center text-[11px] text-gray-400">
        AI javoblari o'quv-maslahat xarakteriga ega. Rasmiy manba — YHQ va MJtK.
      </p>
    </div>
  );
}

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aiBelgiCheck, ApiError } from "../lib/api";
import { resizeImageToBase64 } from "../lib/image";
import type { BelgiCheckResult } from "../types";

const ISHONCH_LABEL: Record<string, string> = {
  yuqori: "Yuqori ishonch",
  orta: "O'rtacha ishonch",
  past: "Past ishonch",
};

export default function SignCheck() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BelgiCheckResult | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const { base64, mediaType } = await resizeImageToBase64(file);
      const data = await aiBelgiCheck(base64, mediaType);
      setResult(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Rasmni tahlil qilib bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="focus-ring text-xl" aria-label="Orqaga">
          ←
        </button>
        <h1 className="font-heading text-lg font-bold">📷 Belgi tekshiruvi</h1>
      </div>

      <p className="text-sm text-[var(--fg)]/70">
        Ko'chadagi haqiqiy yo'l belgisi rasmini yuklang — AI uni aniqlab, to'g'ri o'rnatilganini baholaydi.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="card focus-ring flex flex-col items-center justify-center gap-2 border-2 border-dashed p-8 text-center"
        style={{ borderColor: "var(--card-border)" }}
      >
        {preview ? (
          <img src={preview} alt="Yuklangan belgi" className="max-h-56 rounded-btn object-contain" />
        ) : (
          <>
            <span className="text-4xl">📷</span>
            <span className="font-heading font-bold">Rasm yuklash</span>
            <span className="text-xs text-gray-400">Kamera yoki galereyadan tanlang</span>
          </>
        )}
      </button>

      {loading && <p className="text-center text-sm text-gray-500">AI rasmni tahlil qilmoqda...</p>}

      {error && (
        <div className="rounded-btn bg-danger/10 p-3 text-sm text-danger">
          {error}
          <button onClick={() => fileInputRef.current?.click()} className="mt-2 block underline">
            Qayta urinish
          </button>
        </div>
      )}

      {result && (
        <div className="card flex flex-col gap-3 p-4">
          {!result.aniqlandi ? (
            <p className="text-sm text-danger">
              Belgi aniqlanmadi. {result.nom || "Iltimos, aniqroq rasm yuklang."}
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold">{result.nom}</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-800">
                  {ISHONCH_LABEL[result.ishonch] ?? result.ishonch}
                </span>
              </div>
              <p className="text-xs font-bold uppercase text-gray-400">{result.kategoriya}</p>
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Haydovchiga talab</p>
                <p className="text-sm">{result.haydovchiga_talab}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">O'rnatilish tahlili</p>
                <p className="text-sm">{result.ornatilish_tahlili}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Agar muammo bo'lsa</p>
                <p className="text-sm">{result.muammo_bolsa}</p>
              </div>
            </>
          )}
        </div>
      )}

      <p className="pb-4 text-center text-[11px] text-gray-400">
        AI javoblari o'quv-maslahat xarakteriga ega. Rasmiy manba — YHQ va MJtK.
      </p>
    </div>
  );
}

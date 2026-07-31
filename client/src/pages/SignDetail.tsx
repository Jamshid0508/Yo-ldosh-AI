import { useNavigate, useParams } from "react-router-dom";
import SignImage from "../components/SignImage";
import { getSign } from "../lib/signAssets";

const KATEGORIYA_LABEL: Record<string, string> = {
  ogohlantiruvchi: "Ogohlantiruvchi belgi",
  imtiyoz: "Imtiyoz (ustunlik) belgisi",
  taqiqlovchi: "Taqiqlovchi belgi",
  buyuruvchi: "Buyuruvchi belgi",
  "axborot-ishora": "Axborot-ishora belgisi",
  servis: "Servis belgisi",
  qoshimcha: "Qo'shimcha lavha",
};

export default function SignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sign = id ? getSign(id) : undefined;

  if (!sign) {
    return (
      <div className="p-6 text-center">
        <p>Belgi topilmadi.</p>
        <button onClick={() => navigate("/signs")} className="mt-3 text-sign-blue underline">
          Katalogga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="focus-ring text-xl" aria-label="Orqaga">
          ←
        </button>
        <span className="text-xs font-semibold uppercase text-gray-400">
          {KATEGORIYA_LABEL[sign.kategoriya] ?? sign.kategoriya}
        </span>
      </div>

      <div className="flex justify-center py-4">
        <SignImage id={sign.id} size={180} />
      </div>

      <div className="text-center">
        <p className="font-mono-num text-sm text-gray-400">{sign.id}</p>
        <h1 className="font-heading text-xl font-extrabold">{sign.nom}</h1>
      </div>

      <div className="card flex flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-bold uppercase text-gray-400">Ma'nosi</p>
          <p className="text-sm">{sign.tavsif}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-400">Amal qilish zonasi</p>
          <p className="text-sm">{sign.amal_zonasi}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-gray-400">Javobgarlik</p>
          <p className="text-sm">{sign.jarima_izoh}</p>
        </div>
      </div>

      <button
        onClick={() =>
          navigate("/chat", { state: { context: { belgi_id: sign.id, belgi_nom: sign.nom } } })
        }
        className="btn-3d focus-ring rounded-btn bg-sign-blue py-3 font-heading font-bold text-white"
      >
        🤖 AI'dan shu belgi haqida so'rash
      </button>
    </div>
  );
}

import { getSign, signSvgUrl } from "../lib/signAssets";

interface Props {
  id: string;
  size?: number;
  className?: string;
  bare?: boolean; // true bo'lsa oq fon/karta bo'lmaydi (masalan sxema ichida)
}

export default function SignImage({ id, size = 72, className = "", bare = false }: Props) {
  const sign = getSign(id);
  const url = signSvgUrl(id);

  const img = url ? (
    <img
      src={url}
      width={size}
      height={size}
      alt={sign?.nom ?? `Belgi ${id}`}
      className="h-full w-full object-contain"
      draggable={false}
    />
  ) : (
    <div
      className="flex h-full w-full items-center justify-center rounded-full border-4 border-danger text-xs font-bold text-danger"
      style={{ fontSize: size / 5 }}
    >
      {id}
    </div>
  );

  if (bare) {
    return (
      <div className={className} style={{ width: size, height: size }}>
        {img}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-white p-1.5 ${className}`}
      style={{ width: size, height: size }}
    >
      {img}
    </div>
  );
}

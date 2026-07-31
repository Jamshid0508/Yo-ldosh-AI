import type { Tomon } from "../../types";

export const CENTER = 160;
export const VIEWBOX = 320;
export const ROAD_HALF = 55;

interface TomonInfo {
  away: { x: number; y: number }; // birlik vektor: markazdan shu tomonga
  laneOffset: { x: number; y: number }; // to'g'ri tomon qoidasi (o'ngdan yurish)
  rotation: number; // "yuqoriga qaragan" ikonka uchun burchak
}

export const TOMON_INFO: Record<Tomon, TomonInfo> = {
  shimol: { away: { x: 0, y: -1 }, laneOffset: { x: -18, y: 0 }, rotation: 180 },
  janub: { away: { x: 0, y: 1 }, laneOffset: { x: 18, y: 0 }, rotation: 0 },
  sharq: { away: { x: 1, y: 0 }, laneOffset: { x: 0, y: -18 }, rotation: 270 },
  garb: { away: { x: -1, y: 0 }, laneOffset: { x: 0, y: 18 }, rotation: 90 },
};

export function carPosition(tomon: Tomon, index: number) {
  const info = TOMON_INFO[tomon];
  const dist = 78 + index * 42;
  const x = CENTER + info.away.x * dist + info.laneOffset.x;
  const y = CENTER + info.away.y * dist + info.laneOffset.y;
  return { x, y, rotation: info.rotation };
}

export function signPosition(tomon: Tomon, index: number) {
  const info = TOMON_INFO[tomon];
  const dist = 122 + index * 34;
  const lateral = 2.4; // laneOffset'dan ko'proq chetga suriladi
  const x = CENTER + info.away.x * dist + info.laneOffset.x * lateral;
  const y = CENTER + info.away.y * dist + info.laneOffset.y * lateral;
  return { x, y };
}

export function pedestrianPosition(tomon: Tomon, index: number) {
  const info = TOMON_INFO[tomon];
  const dist = 96 + index * 26;
  const x = CENTER + info.away.x * dist - info.laneOffset.x * 0.4;
  const y = CENTER + info.away.y * dist - info.laneOffset.y * 0.4;
  return { x, y };
}

export function arrowForManevr(manevr: string): number {
  // rotation qo'shimchasi - car rotation ustiga qo'shiladi (strelka relative)
  switch (manevr) {
    case "chapga":
      return -90;
    case "onga":
      return 90;
    case "burilish_orqaga":
      return 180;
    default:
      return 0; // togri
  }
}

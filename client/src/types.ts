export type SignCategory =
  | "ogohlantiruvchi"
  | "imtiyoz"
  | "taqiqlovchi"
  | "buyuruvchi"
  | "axborot-ishora"
  | "servis"
  | "qoshimcha";

export interface RoadSign {
  id: string;
  nom: string;
  kategoriya: SignCategory;
  svg: string;
  tavsif: string;
  amal_zonasi: string;
  jarima_izoh: string;
}

export interface Question {
  id: string;
  savol: string;
  belgi_id: string | null;
  sxema: Scene | null;
  variantlar: string[];
  togri: number;
  izoh: string;
  mavzu: string;
  qiyinlik: number;
}

export type Tomon = "shimol" | "janub" | "sharq" | "garb";
export type YolTuri =
  | "togri_yol"
  | "chorraha_4"
  | "chorraha_T"
  | "aylanma"
  | "hovli_chiqish"
  | "piyoda_otish";
export type Manevr = "togri" | "chapga" | "onga" | "burilish_orqaga" | "toxtagan";

export interface SceneBelgi {
  belgi_id: string;
  tomon: Tomon;
}

export interface SceneMashina {
  harf: string;
  rang: string;
  tomon: Tomon;
  manevr: Manevr;
  meniki: boolean;
}

export interface ScenePiyoda {
  tomon: Tomon;
  harakat: "otmoqda" | "kutmoqda";
}

export interface Scene {
  yol_turi: YolTuri;
  izoh: string;
  svetofor: "qizil" | "sariq" | "yashil" | null;
  belgilar: SceneBelgi[];
  mashinalar: SceneMashina[];
  piyodalar: ScenePiyoda[];
  yol_boyi_chizigi: "uzuq" | "yaxlit" | "yoq";
}

export interface Tahlil {
  xulosa: string;
  qoidalar: string[];
  kim_haq: string;
  javobgarlik: string;
  maslahat: string;
}

export interface VaziyatResponse {
  sxema: Scene | null;
  tahlil: Tahlil;
}

export interface BelgiCheckResult {
  aniqlandi: boolean;
  belgi_id: string;
  nom: string;
  kategoriya: string;
  haydovchiga_talab: string;
  ornatilish_tahlili: string;
  muammo_bolsa: string;
  ishonch: "yuqori" | "orta" | "past";
}

export const DARAJALAR = [
  "Yangi haydovchi",
  "Shogird",
  "Haydovchi",
  "Usta",
  "Yo'l ustasi",
] as const;
export type Daraja = (typeof DARAJALAR)[number];

export interface UserProgress {
  xp: number;
  streak: number;
  oxirgiFaollik: string | null; // ISO date
  daraja: Daraja;
  mavzular: Record<string, { yechilgan: number; togri: number }>;
  yechilganSavollar: number;
  togriJavoblar: number;
  completedLessons: string[];
}

export interface MistakeEntry {
  id: string;
  savol: Question;
  tanlangan: number;
  sana: string;
  qaytaYechildi: boolean;
}

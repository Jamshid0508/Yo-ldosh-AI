import { z } from "zod";

export const testQuestionSchema = z.object({
  savol: z.string().min(1),
  variantlar: z.array(z.string().min(1)).length(4),
  togri: z.number().int().min(0).max(3),
  izoh: z.string().min(1),
  qiyinlik: z.number().int().min(1).max(3),
});
export type TestQuestion = z.infer<typeof testQuestionSchema>;

const belgiRefSchema = z.object({
  belgi_id: z.string(),
  tomon: z.enum(["shimol", "janub", "sharq", "garb"]),
});

const mashinaSchema = z.object({
  harf: z.string(),
  rang: z.string(),
  tomon: z.enum(["shimol", "janub", "sharq", "garb"]),
  manevr: z.enum(["togri", "chapga", "onga", "burilish_orqaga", "toxtagan"]),
  meniki: z.boolean(),
});

const piyodaSchema = z.object({
  tomon: z.enum(["shimol", "janub", "sharq", "garb"]),
  harakat: z.enum(["otmoqda", "kutmoqda"]),
});

export const sceneSchema = z.object({
  yol_turi: z.enum([
    "togri_yol",
    "chorraha_4",
    "chorraha_T",
    "aylanma",
    "hovli_chiqish",
    "piyoda_otish",
  ]),
  izoh: z.string(),
  svetofor: z.enum(["qizil", "sariq", "yashil"]).nullable(),
  belgilar: z.array(belgiRefSchema),
  mashinalar: z.array(mashinaSchema),
  piyodalar: z.array(piyodaSchema),
  yol_boyi_chizigi: z.enum(["uzuq", "yaxlit", "yoq"]),
});
export type Scene = z.infer<typeof sceneSchema>;

export const tahlilSchema = z.object({
  xulosa: z.string(),
  qoidalar: z.array(z.string()),
  kim_haq: z.string(),
  javobgarlik: z.string(),
  maslahat: z.string(),
});
export type Tahlil = z.infer<typeof tahlilSchema>;

export const vaziyatResponseSchema = z.object({
  sxema: sceneSchema.nullable(),
  tahlil: tahlilSchema,
});
export type VaziyatResponse = z.infer<typeof vaziyatResponseSchema>;

export const belgiCheckSchema = z.object({
  aniqlandi: z.boolean(),
  belgi_id: z.string(),
  nom: z.string(),
  kategoriya: z.string(),
  haydovchiga_talab: z.string(),
  ornatilish_tahlili: z.string(),
  muammo_bolsa: z.string(),
  ishonch: z.enum(["yuqori", "orta", "past"]),
});
export type BelgiCheck = z.infer<typeof belgiCheckSchema>;

/** Claude ba'zan javobni ```json fensi ichida qaytarishi mumkin — shuni tozalaymiz. */
export function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(candidate);
}

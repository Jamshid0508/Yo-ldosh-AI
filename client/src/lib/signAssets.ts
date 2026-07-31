import signsData from "../data/signs.json";
import type { RoadSign } from "../types";

const svgModules = import.meta.glob("../assets/signs/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const signsById = new Map((signsData as RoadSign[]).map((s) => [s.id, s]));

export function getSign(id: string): RoadSign | undefined {
  return signsById.get(id);
}

export function getAllSigns(): RoadSign[] {
  return signsData as RoadSign[];
}

export function signSvgUrl(id: string): string | null {
  const sign = getSign(id);
  if (!sign) return null;
  const entry = Object.entries(svgModules).find(([path]) => path.endsWith(`/${sign.svg}`));
  return entry ? entry[1] : null;
}

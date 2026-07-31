export interface LessonDef {
  id: string;
  mavzu: string;
  nom: string;
  icon: string;
}

export const LESSONS: LessonDef[] = [
  { id: "umumiy", mavzu: "umumiy", nom: "Umumiy qoidalar", icon: "📖" },
  { id: "belgilar", mavzu: "belgilar", nom: "Belgilar", icon: "🛑" },
  { id: "svetofor", mavzu: "svetofor", nom: "Svetofor", icon: "🚦" },
  { id: "chorrahalar", mavzu: "chorrahalar", nom: "Chorrahalar", icon: "➕" },
  { id: "quvib-otish", mavzu: "quvib_otish", nom: "Quvib o'tish", icon: "🚗" },
  { id: "tezlik", mavzu: "tezlik", nom: "Tezlik", icon: "⚡" },
  { id: "toxtash", mavzu: "toxtash", nom: "To'xtash", icon: "🅿️" },
  { id: "piyodalar", mavzu: "piyodalar", nom: "Piyodalar", icon: "🚶" },
  { id: "maxsus", mavzu: "maxsus", nom: "Maxsus holatlar", icon: "⚠️" },
  { id: "imtihon", mavzu: "imtihon", nom: "IMTIHON", icon: "🏁" },
];

export function lessonStatus(
  lessonId: string,
  completed: string[]
): "completed" | "current" | "locked" {
  const idx = LESSONS.findIndex((l) => l.id === lessonId);
  if (completed.includes(lessonId)) return "completed";
  const firstIncompleteIdx = LESSONS.findIndex((l) => !completed.includes(l.id));
  return idx === firstIncompleteIdx ? "current" : "locked";
}

// ===== lib/scores.ts — puntuaciones mock vía localStorage =====

export interface ScoreEntry {
  game: string;
  score: number;
  name: string;
  at: number;
}

const KEY = "av_scores";

export function saveScore(entry: Omit<ScoreEntry, "at">) {
  try {
    const all: ScoreEntry[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    all.push({ ...entry, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // localStorage no disponible; se ignora silenciosamente, como en el template original.
  }
}

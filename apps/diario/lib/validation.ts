import { isISODate } from "@/shared/lib/date";
import { MAX_SHORT_TEXT, PROJECTS } from "../constants";
import type { DailyEntry, EntryDraft, ProjectProgress, Scale } from "../types";

export type ValidationResult =
  | { ok: true; entry: DailyEntry }
  | { ok: false; errors: Partial<Record<string, string>> };

const isScale = (n: number | null): n is Scale =>
  n !== null && Number.isInteger(n) && n >= 1 && n <= 5;

const trimmed = (s: string) => s.trim() || undefined;

export function emptyDraft(date: string): EntryDraft {
  return {
    date,
    energy: null,
    sleepHours: null,
    sleepQuality: null,
    workHighs: [],
    workLows: [],
    workNote: "",
    projects: {},
    rechargers: [],
    leaks: [],
    leisureScreenHours: null,
  };
}

export function draftFromEntry(e: DailyEntry): EntryDraft {
  return {
    date: e.date,
    energy: e.energy,
    sleepHours: e.sleep.hours,
    sleepQuality: e.sleep.quality,
    workHighs: e.work.highs,
    workLows: e.work.lows,
    workNote: e.work.note ?? "",
    projects: Object.fromEntries(e.projects.map((p) => [p.name, p.progress])),
    rechargers: e.rechargers,
    leaks: e.leaks ?? [],
    leisureScreenHours: e.leisureScreenHours ?? null,
  };
}

export function validateEntry(d: EntryDraft): ValidationResult {
  const errors: Partial<Record<string, string>> = {};
  if (!isISODate(d.date)) errors.date = "Elige una fecha válida.";
  if (!isScale(d.energy)) errors.energy = "Indica tu nivel de energía.";
  if (d.sleepHours === null) errors.sleepHours = "Indica las horas de sueño.";
  if (!isScale(d.sleepQuality)) errors.sleepQuality = "Indica la calidad del sueño.";
  if (d.workNote.length > MAX_SHORT_TEXT) {
    errors.workNote = `Máximo ${MAX_SHORT_TEXT} caracteres.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const projects = PROJECTS.flatMap((name) => {
    const progress = d.projects[name];
    if (progress === null || progress === undefined) return [];
    return [{ name, progress: progress as ProjectProgress }];
  });

  return {
    ok: true,
    entry: {
      date: d.date,
      energy: d.energy as Scale,
      sleep: { hours: d.sleepHours as number, quality: d.sleepQuality as Scale },
      work: { highs: d.workHighs, lows: d.workLows, note: trimmed(d.workNote) },
      projects,
      rechargers: d.rechargers,
      leaks: d.leaks,
      leisureScreenHours: d.leisureScreenHours,
    },
  };
}

export type Scale = 1 | 2 | 3 | 4 | 5;
/** 0 = sin tocar (neutro, sin carga moral), 1 = poco, 2 = bueno, 3 = muy bueno. */
export type ProjectProgress = 0 | 1 | 2 | 3;

export type DailyEntry = {
  /** YYYY-MM-DD. También es el id del documento (una entrada por día). */
  date: string;
  energy: Scale;
  sleep: { hours: number; quality: Scale };
  work: { highs: string[]; lows: string[]; note?: string };
  projects: { name: string; progress: ProjectProgress }[];
  /** Qué recargó energía. */
  rechargers: string[];
  /** Fugas de energía/atención fuera del trabajo. */
  leaks: string[];
  /** Horas de pantalla de ocio (fuera del trabajo); null = no indicado. */
  leisureScreenHours: number | null;
};

/** Estado editable del formulario (los obligatorios pueden estar vacíos). */
export type EntryDraft = {
  date: string;
  energy: number | null;
  sleepHours: number | null;
  sleepQuality: number | null;
  workHighs: string[];
  workLows: string[];
  workNote: string;
  /** nombre de proyecto → progreso (null = sin indicar) */
  projects: Record<string, number | null>;
  rechargers: string[];
  leaks: string[];
  leisureScreenHours: number | null;
};

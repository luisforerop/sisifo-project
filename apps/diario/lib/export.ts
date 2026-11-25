import type { DailyEntry } from "../types";

export const EXPORT_SCHEMA_VERSION = 1;

export type JournalExport = {
  schemaVersion: number;
  exportedAt: string;
  entries: DailyEntry[];
};

/** Arma el JSON de exportación (ordenado por fecha asc.), opcionalmente por rango. */
export function buildExport(
  entries: DailyEntry[],
  range?: { from?: string; to?: string },
): JournalExport {
  const filtered = entries
    .filter((e) => (!range?.from || e.date >= range.from) && (!range?.to || e.date <= range.to))
    .sort((a, b) => a.date.localeCompare(b.date));
  return {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    entries: filtered,
  };
}

/** Descarga el JSON como archivo (solo cliente). */
export function downloadExport(data: JournalExport, filename = "diario-sisifo.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

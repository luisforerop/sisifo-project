"use client";

import { useMemo } from "react";
import { useCollection } from "@/shared/services/storage";
import { COLLECTION, SCHEMA_VERSION } from "../constants";
import type { DailyEntry } from "../types";

/** Entradas del diario (más reciente primero). `id` del documento = fecha. */
export function useDailyEntries() {
  const { items, loading, error, save, remove } = useCollection<DailyEntry>(
    "diario",
    COLLECTION,
    SCHEMA_VERSION,
  );
  const entries = useMemo(
    () => [...items].sort((a, b) => b.date.localeCompare(a.date)),
    [items],
  );
  return {
    entries,
    loading,
    error,
    saveEntry: (entry: DailyEntry) => save(entry.date, entry),
    removeEntry: (date: string) => remove(date),
  };
}

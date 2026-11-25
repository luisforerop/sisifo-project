"use client";

import { useSearchParams } from "next/navigation";
import { isISODate, todayISO } from "@/shared/lib/date";
import { DailyEntryForm } from "./daily-entry-form";

/** Lee `?fecha=YYYY-MM-DD` (para editar días anteriores); por defecto, hoy. */
export function DailyEntryScreen() {
  const fecha = useSearchParams().get("fecha");
  const initialDate = isISODate(fecha) ? fecha : todayISO();
  return <DailyEntryForm key={initialDate} initialDate={initialDate} />;
}

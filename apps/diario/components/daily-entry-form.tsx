"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, ChipGroup, DateField, Field, NumberStepper, ScaleSelect, ShortTextField } from "@/shared/components/ui";
import { todayISO } from "@/shared/lib/date";
import {
  DEFAULT_LEISURE_SCREEN_HOURS,
  DEFAULT_SLEEP_HOURS,
  LEAKS,
  MAX_SHORT_TEXT,
  PROGRESS_OPTIONS,
  PROJECTS,
  RECHARGERS,
  WORK_HIGHS,
  WORK_LOWS,
} from "../constants";
import { useDailyEntries } from "../hooks/use-daily-entries";
import { draftFromEntry, emptyDraft, validateEntry } from "../lib/validation";
import type { DailyEntry, EntryDraft } from "../types";

/** Contenedor: carga las entradas y (re)monta el formulario al cambiar la fecha. */
export function DailyEntryForm({ initialDate }: { initialDate: string }) {
  const [date, setDate] = useState(initialDate);
  const { entries, loading, error, saveEntry } = useDailyEntries();

  if (loading) return <p className="text-muted">Cargando…</p>;
  if (error) return <p role="alert" className="text-danger">No se pudieron cargar los datos.</p>;

  return (
    <FormBody
      key={date}
      date={date}
      existing={entries.find((e) => e.date === date)}
      onDateChange={setDate}
      onSave={saveEntry}
    />
  );
}

type FormBodyProps = {
  date: string;
  existing?: DailyEntry;
  onDateChange: (date: string) => void;
  onSave: (entry: DailyEntry) => Promise<void>;
};

function FormBody({ date, existing, onDateChange, onSave }: FormBodyProps) {
  const [draft, setDraft] = useState<EntryDraft>(() =>
    existing ? draftFromEntry(existing) : emptyDraft(date),
  );
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  const set = <K extends keyof EntryDraft>(key: K, value: EntryDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setStatus("idle");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateEntry(draft);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("idle");
      return;
    }
    setErrors({});
    setStatus("saving");
    try {
      await onSave(result.entry);
      setStatus("saved");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-7 pb-24" noValidate>
      {/* 1. Cuerpo y descanso */}
      <Field label="Fecha" error={errors.date} hint={existing ? "Ya hay un registro de este día: lo estás editando." : undefined}>
        <DateField value={draft.date} max={todayISO()} onChange={onDateChange} label="Fecha" />
      </Field>

      <Field label="Horas de sueño" error={errors.sleepHours}>
        <NumberStepper label="Horas de sueño" value={draft.sleepHours} start={DEFAULT_SLEEP_HOURS} max={16} unit="h" onChange={(v) => set("sleepHours", v)} />
      </Field>

      <Field label="Calidad del sueño" error={errors.sleepQuality}>
        <ScaleSelect label="Calidad del sueño" value={draft.sleepQuality} onChange={(v) => set("sleepQuality", v)} endLabels={["Malo", "Excelente"]} />
      </Field>

      <Field label="Energía" hint="¿Cómo estuvo tu nivel de energía?" error={errors.energy}>
        <ScaleSelect label="Energía" value={draft.energy} onChange={(v) => set("energy", v)} endLabels={["Agotado", "Con mucha energía"]} />
      </Field>

      {/* 2. Trabajo */}
      <Field label="Picos del trabajo" hint="Lo mejor del día (opcional)">
        <ChipGroup multi label="Picos del trabajo" options={WORK_HIGHS} value={draft.workHighs} onChange={(v) => set("workHighs", v)} />
      </Field>

      <Field label="Valles del trabajo" hint="Lo que pesó (opcional)">
        <ChipGroup multi label="Valles del trabajo" options={WORK_LOWS} value={draft.workLows} onChange={(v) => set("workLows", v)} />
      </Field>

      <Field label="Trabajo en 2-3 palabras" error={errors.workNote}>
        <ShortTextField label="Trabajo en 2-3 palabras" maxLength={MAX_SHORT_TEXT} value={draft.workNote} onChange={(v) => set("workNote", v)} placeholder="Opcional" />
      </Field>

      {/* 3. Proyectos clave */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Avance de proyectos</h2>
          <p className="text-sm text-muted">«Sin tocar» es normal: un foco principal por semana y mantenimiento ligero en el otro.</p>
        </div>
        {PROJECTS.map((name) => (
          <Field key={name} label={name}>
            <ChipGroup
              label={`Avance en ${name}`}
              options={PROGRESS_OPTIONS}
              value={draft.projects[name] != null ? [String(draft.projects[name])] : []}
              onChange={(v) =>
                set("projects", { ...draft.projects, [name]: v.length ? Number(v[0]) : null })
              }
            />
          </Field>
        ))}
      </section>

      {/* 4. Balance y cierre */}
      <Field label="¿Qué te recargó?" hint="Opcional">
        <ChipGroup multi label="Actividades que recargan" options={RECHARGERS} value={draft.rechargers} onChange={(v) => set("rechargers", v)} />
      </Field>

      <Field label="Fugas / Dispersión" hint="¿Qué te drenó fuera del trabajo? (opcional)">
        <ChipGroup multi label="Fugas y dispersión" options={LEAKS} value={draft.leaks} onChange={(v) => set("leaks", v)} />
      </Field>

      <Field label="Pantalla de ocio" hint="Horas fuera del trabajo (celular, iPad, series…). No cuentes la pantalla laboral.">
        <NumberStepper label="Horas de pantalla de ocio" value={draft.leisureScreenHours} start={DEFAULT_LEISURE_SCREEN_HOURS} unit="h" onChange={(v) => set("leisureScreenHours", v)} />
      </Field>

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="text-danger">Revisa los campos marcados.</p>
      )}

      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0">
        <Button type="submit" disabled={status === "saving"} className="flex-1">
          {status === "saving" ? "Guardando…" : existing ? "Actualizar día" : "Guardar día"}
        </Button>
        {status === "saved" && <span role="status" className="text-sm text-muted">Guardado ✓</span>}
        {status === "failed" && <span role="alert" className="text-sm text-danger">No se pudo guardar</span>}
        <Link href="/diario/historial" className="flex min-h-11 items-center px-2 text-accent underline">
          Historial
        </Link>
      </div>
    </form>
  );
}

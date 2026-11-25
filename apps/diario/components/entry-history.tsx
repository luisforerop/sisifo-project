"use client";

import Link from "next/link";
import { Button, Card } from "@/shared/components/ui";
import { formatDateEs } from "@/shared/lib/date";
import { useDailyEntries } from "../hooks/use-daily-entries";
import { ExportPanel } from "./export-panel";

export function EntryHistory() {
  const { entries, loading, error, removeEntry } = useDailyEntries();

  if (loading) return <p className="text-muted">Cargando…</p>;
  if (error) return <p role="alert" className="text-danger">No se pudieron cargar los datos.</p>;

  return (
    <div className="space-y-6">
      {entries.length === 0 ? (
        <p className="text-muted">
          Aún no hay registros.{" "}
          <Link href="/diario" className="text-accent underline">Registrar hoy</Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.date}>
              <Card className="space-y-3">
                <div>
                  <p className="font-medium capitalize">{formatDateEs(e.date)}</p>
                  <p className="text-sm text-muted">
                    Energía {e.energy}/5 · Sueño {e.sleep.hours} h ({e.sleep.quality}/5)
                    {e.leisureScreenHours != null && ` · Pantalla ocio ${e.leisureScreenHours} h`}
                  </p>
                  {e.leaks?.length > 0 && (
                    <p className="mt-1 text-sm">Fugas: {e.leaks.join(", ")}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/diario?fecha=${e.date}`}
                    className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-border text-base font-medium"
                  >
                    Editar
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar el registro del ${formatDateEs(e.date)}?`)) {
                        void removeEntry(e.date);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <ExportPanel entries={entries} />
    </div>
  );
}

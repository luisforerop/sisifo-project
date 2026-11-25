"use client";

import { useState } from "react";
import { Button, Card, DateField, Field } from "@/shared/components/ui";
import { buildExport, downloadExport } from "../lib/export";
import type { DailyEntry } from "../types";

export function ExportPanel({ entries }: { entries: DailyEntry[] }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  return (
    <Card className="space-y-4">
      <h2 className="font-semibold">Exportar para análisis</h2>
      <p className="text-sm text-muted">Descarga un JSON para pasárselo a tu agente. Sin fechas exporta todo.</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Desde"><DateField label="Desde" value={from} onChange={setFrom} /></Field>
        <Field label="Hasta"><DateField label="Hasta" value={to} onChange={setTo} /></Field>
      </div>
      <Button
        className="w-full"
        disabled={entries.length === 0}
        onClick={() => downloadExport(buildExport(entries, { from: from || undefined, to: to || undefined }))}
      >
        Exportar JSON
      </Button>
    </Card>
  );
}

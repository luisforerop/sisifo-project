import type { Metadata } from "next";
import { Suspense } from "react";
import { DailyEntryScreen } from "@/apps/diario/components/daily-entry-screen";
import { PageHeader } from "@/shared/components/layout/page-header";

export const metadata: Metadata = { title: "Diario del día" };

export default function DiarioPage() {
  return (
    <main>
      <PageHeader title="Diario del día" subtitle="Un minuto para registrar tu día" backHref="/" />
      <Suspense fallback={<p className="text-muted">Cargando…</p>}>
        <DailyEntryScreen />
      </Suspense>
    </main>
  );
}

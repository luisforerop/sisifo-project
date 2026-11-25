import type { Metadata } from "next";
import { EntryHistory } from "@/apps/diario/components/entry-history";
import { PageHeader } from "@/shared/components/layout/page-header";

export const metadata: Metadata = { title: "Historial del diario" };

export default function HistorialPage() {
  return (
    <main>
      <PageHeader title="Historial" backHref="/diario" />
      <EntryHistory />
    </main>
  );
}

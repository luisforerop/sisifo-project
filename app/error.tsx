"use client";

import { PageHeader } from "@/shared/components/layout/page-header";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  console.error(error);
  return (
    <main>
      <PageHeader title="Algo salió mal" subtitle="Ocurrió un error inesperado." />
      <button
        onClick={() => retry()}
        className="min-h-11 rounded-xl bg-accent px-5 font-medium text-accent-foreground"
      >
        Reintentar
      </button>
    </main>
  );
}

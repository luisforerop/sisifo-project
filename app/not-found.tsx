import Link from "next/link";
import { PageHeader } from "@/shared/components/layout/page-header";

export default function NotFound() {
  return (
    <main>
      <PageHeader title="Página no encontrada" subtitle="Esta ruta no existe." />
      <Link href="/" className="font-medium text-accent underline">
        Volver al inicio
      </Link>
    </main>
  );
}

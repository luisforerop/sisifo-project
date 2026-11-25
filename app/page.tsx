import Link from "next/link";
import { subApps } from "@/apps/registry";
import { PageHeader } from "@/shared/components/layout/page-header";

export default function Home() {
  return (
    <main>
      <PageHeader title="Sísifo" subtitle="Tus apps para el día a día" />
      <ul className="grid gap-3 sm:grid-cols-2">
        {subApps.map((app) => (
          <li key={app.id}>
            <Link
              href={app.href}
              className="flex min-h-24 items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors active:bg-border md:hover:border-accent"
            >
              <span className="text-3xl" aria-hidden>
                {app.icon}
              </span>
              <span>
                <span className="block font-medium">{app.name}</span>
                <span className="block text-sm text-muted">{app.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

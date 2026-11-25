import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Si se indica, muestra un botón para volver. */
  backHref?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, backHref, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex items-start gap-3">
      {backHref && (
        <Link
          href={backHref}
          aria-label="Volver"
          className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full text-xl hover:bg-border"
        >
          ←
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions}
    </header>
  );
}

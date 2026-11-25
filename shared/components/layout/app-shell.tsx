import type { ReactNode } from "react";

/**
 * Contenedor común: ancho completo en celular, centrado con ancho máximo
 * en iPad/Mac, respetando las áreas seguras (notch, barra inferior).
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-6 md:py-10">
      {children}
    </div>
  );
}

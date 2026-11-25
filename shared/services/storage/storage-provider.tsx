"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { LocalStorageService } from "./local-storage-service";
import type { StorageService } from "./types";

const StorageContext = createContext<StorageService | null>(null);

/**
 * Único punto donde se elige la implementación de almacenamiento.
 * Para migrar a la app de JSONs, pasar otra implementación en `service`
 * (o cambiar el valor por defecto de aquí).
 */
export function StorageProvider({
  children,
  service,
}: {
  children: ReactNode;
  service?: StorageService;
}) {
  const [value] = useState<StorageService>(() => service ?? new LocalStorageService());
  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export function useStorage(): StorageService {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error("useStorage debe usarse dentro de <StorageProvider>");
  return ctx;
}

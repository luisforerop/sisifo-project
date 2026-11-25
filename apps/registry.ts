import type { SubAppManifest } from "@/shared/types/sub-app";
import { diarioManifest } from "./diario/manifest";

/**
 * Registro central de sub-apps. Es la única fuente para el home.
 * Para agregar una sub-app: exportar su manifest y añadirlo aquí.
 */
export const subApps: SubAppManifest[] = [diarioManifest];

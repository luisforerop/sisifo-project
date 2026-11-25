## Context

Repo actual: scaffold de Next.js 16.4 (App Router, sin `src/`), React 19, Tailwind 4, alias `@/*` → raíz. No hay código de producto. `AGENTS.md` advierte que Next 16 tiene cambios respecto a versiones previas (p. ej. `middleware` pasó a llamarse `proxy.ts`), por lo que antes de implementar se deben consultar las guías en `node_modules/next/dist/docs/`. Motivación y alcance: ver `proposal.md`; requisitos: ver `specs/`.

## Goals / Non-Goals

**Goals:**
- Estructura que permita añadir sub-apps de forma incremental y aislada.
- Persistencia intercambiable (localStorage → app de JSONs) con cambio en un solo punto.
- UI mobile-first que no se degrade en iPad/Mac.
- Dejar el terreno listo para auth sin implementarla.

**Non-Goals:**
- Implementar autenticación, sincronización remota o multiusuario real.
- Sistema de diseño completo o librería de componentes externa.
- Análisis con IA de los datos (solo se exportan).
- Soporte offline/PWA (puede venir después).

## Decisions

### D1. Rutas finas en `app/`, lógica de cada sub-app en `apps/<nombre>/`
```
app/
  layout.tsx            # shell común (lang="es", providers, contenedor)
  page.tsx              # home/marketplace
  diario/page.tsx       # delgado: importa de @/apps/diario
apps/
  registry.ts           # lista de manifests de sub-apps
  diario/
    manifest.ts         # nombre, descripción, ruta, ícono
    components/  hooks/  lib/  types.ts
shared/
  components/ui/        # Button, Chip, ChipGroup, NumberField, ScaleSelect, Card…
  components/layout/    # AppShell, PageHeader
  hooks/  lib/  types/
  services/storage/     # StorageService, LocalStorageService, provider, useStorage…
  user/                 # UserContext (usuario "local")
docs/adding-a-subapp.md
```
Rationale: `app/` queda solo para enrutado (patrón recomendado en Next; las carpetas `_privadas` también serían válidas, pero separar módulos facilita aislar y mover una sub-app). Alternativas: colocar todo dentro de `app/diario/_components` (más simple, pero mezcla dominio con enrutado y dificulta extraer la app luego); mover a `src/` (churn innecesario). Regla de dependencias: `apps/X` → `shared` permitido; `apps/X` → `apps/Y` prohibido (se refuerza con regla ESLint `no-restricted-imports`).

### D2. Registro central por manifests
Cada sub-app exporta un `manifest` tipado (`SubAppManifest`: `id`, `name`, `description`, `href`, `icon`); `apps/registry.ts` los agrega y el home lo recorre. Alternativa: descubrir carpetas dinámicamente (rechazado: magia, difícil de tipar y de ordenar). Registrar a mano es un paso explícito de la guía.

### D3. Persistencia: interfaz `StorageService` asíncrona + Provider de React
```ts
interface StorageService {
  get<T>(key: StorageKey): Promise<T | null>;
  list<T>(scope: StorageScope): Promise<T[]>;   // por prefijo
  set<T>(key: StorageKey, value: T): Promise<void>;
  remove(key: StorageKey): Promise<void>;
}
```
- Es **asíncrona** aunque localStorage sea síncrono, para que la futura API HTTP no obligue a cambiar firmas.
- Clave lógica `{ userId, appId, collection, id }` serializada como `sisifo:<userId>/<appId>/<collection>/<id>`.
- `StorageProvider` inyecta la implementación (hoy `LocalStorageService`); el hook `useStorage()` la expone y un hook `useCollection(appId, collection)` ofrece estado (loading/error/items) y operaciones. Las sub-apps solo usan estos hooks.
- Cada documento se guarda con envoltorio `{ schemaVersion, updatedAt, data }` para facilitar migraciones de esquema y la futura sincronización.
- Alternativas: Zustand/persist (acopla UI y medio de guardado), llamar a localStorage directo (migración costosa), IndexedDB (sobredimensionado hoy).
- Lectura solo tras montar en cliente para evitar errores de hidratación/SSR; componentes con estado `loading`.

### D4. Preparación de auth sin implementarla
`UserProvider` entrega `{ userId: "local" }`. Las claves de storage ya incluyen `userId`. Al añadir auth: sustituir el provider por uno real y proteger rutas con `proxy.ts` y/o un grupo de rutas `(protected)`; las sub-apps no cambian. No se crea `proxy.ts` ahora (YAGNI), solo se documenta.

### D5. Mobile-first con Tailwind 4
Estilos base sin prefijo = celular; `md:`/`lg:` solo amplían. Contenedor `mx-auto w-full max-w-2xl px-4` (centrado en iPad/Mac); `min-h-dvh`; `viewport-fit=cover` y padding con `env(safe-area-inset-*)`; controles con `min-h-11` (44 px); inputs con `text-base` (16 px) para evitar zoom en iOS; navegación inferior/atrás simple en lugar de menús laterales. Tokens de color vía variables CSS en `globals.css` (claro/oscuro con `prefers-color-scheme`). Se reemplaza la fuente Arial del scaffold por Geist ya cargada.

### D6. Diario: modelo de datos y UI (versión 2, tras revisión del agente)
Objetivo: registro de ~25 s con señales limpias para análisis. Se redujeron campos y se separaron "lo que recarga" de "lo que drena".
```ts
type DailyEntry = {
  date: string;                 // YYYY-MM-DD (también es el id)
  energy: 1|2|3|4|5;
  sleep: { hours: number; quality: 1|2|3|4|5 };
  work: { highs: string[]; lows: string[]; note?: string };   // note ≤ 80 caracteres
  projects: { name: string; progress: 0|1|2|3 }[];           // 0 = "Sin tocar" (neutro)
  rechargers: string[];
  leaks: string[];                                            // fugas / dispersión
  leisureScreenHours: number | null;                          // solo ocio, no pantalla laboral
};
```
- `id = date` garantiza una entrada por día (D3: colección `entries`).
- Bloques del formulario: (1) cuerpo y descanso, (2) trabajo, (3) proyectos clave, (4) balance y cierre.
- Eliminados por la revisión: `mood` (demasiadas escalas 1–5 se puntúan por inercia), `friction` (cubierta por valles y fugas), `note` libre (ruido difícil de estandarizar) y notas por proyecto (cinco campos de escritura elevan el abandono). El único texto libre es `work.note`.
- Controles: escala 1–5 (botones grandes), chips multiselección, selector numérico con pasos de 0,5 h (sueño parte en 7,5 h; pantalla de ocio en 2 h), texto corto con contador (máx. 80), selector de fecha nativo.
- Etiquetas predefinidas en constantes del módulo: recargadores más específicos (Escalada / Deporte, Montaña / Aire libre, Caminar, Amigos, Familia, Lectura / Juegos, Música, Siesta, Sin pantallas) y fugas (Shorts / iPad, Celular en la noche, Dispersión, Valle post-ajetreo, Salto de idea a idea). Proyectos iniciales: "Lote MVP" y "Proyecto de salud" (configurables en código).
- «Sin tocar» como etiqueta del nivel 0 y texto de apoyo («un foco principal por semana») para evitar culpa.
- Validación con funciones puras propias (sin dependencia nueva). Obligatorios: energía, horas y calidad de sueño.
- Exportación: `{ schemaVersion: 1, exportedAt, entries[] }` descargado como archivo `.json` vía `Blob`. No hay datos previos de usuarios, por lo que el cambio de campos no requiere migración; al leer, `leaks` y `leisureScreenHours` toleran ausencia.
- La fecha a editar se lee en cliente (`/diario?fecha=YYYY-MM-DD`, `useSearchParams` dentro de `Suspense`) porque `cacheComponents` está activo y `searchParams` en servidor bloquea el prerender.
- Alternativa evaluada para escalas: sliders (más imprecisos al pulgar); se eligieron botones segmentados.

### D7. Documentación y reglas para agentes
`docs/adding-a-subapp.md` con pasos y checklist; `AGENTS.md` enlaza a ese documento y resume las reglas (aislamiento, uso de `shared`, persistencia por hooks, mobile-first, consultar docs de Next 16). Regla ESLint para imponer aislamiento.

## Risks / Trade-offs

- [Los campos del diario pueden seguir cambiando con el uso real] → Se aíslan en `apps/diario/` y en constantes; ajustables con `/opsx:update` o en un cambio posterior.
- [Migrar a la app externa podría requerir esquemas/endpoints distintos] → Envoltorio versionado y interfaz async; la implementación HTTP se adapta en un solo archivo.
- [localStorage se pierde al limpiar el navegador o cambiar de dispositivo] → La exportación JSON sirve de respaldo manual hasta la siguiente iteración.
- [Un único usuario `local` y sin auth] → Datos solo en el dispositivo; sin información sensible expuesta por red.
- [`shared` puede convertirse en cajón de sastre] → Solo entra lo usado por ≥2 sub-apps o genérico por naturaleza; documentado en la guía.
- [Cambios de Next 16 respecto a lo conocido] → Tarea explícita de leer `node_modules/next/dist/docs/` antes de escribir código.

## Migration Plan

No hay datos previos que migrar. La migración futura a la app de JSONs: (1) implementar `RemoteJsonStorageService`, (2) cambiarlo en el `StorageProvider`, (3) opcionalmente script de importación de lo que haya en localStorage usando la exportación. Rollback: volver a `LocalStorageService` en el provider.

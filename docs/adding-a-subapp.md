# Cómo agregar una sub-app a Sísifo

Sísifo es un marketplace personal: cada sub-app vive bajo su propia ruta (`/diario`, `/finanzas`, …) y comparte tipos, componentes y servicios con las demás a través de `shared/`.

> Antes de escribir código de Next.js, lee las guías de `node_modules/next/dist/docs/` (Next 16 tiene cambios: p. ej. `middleware` ahora es `proxy.ts`, y el `error.tsx` recibe `retry`).

## Estructura

```
app/                    # SOLO enrutado (páginas delgadas, layout raíz)
  layout.tsx            # lang="es", providers (usuario, storage), AppShell
  page.tsx              # home: lista el registro de sub-apps
  <ruta>/page.tsx       # una carpeta por sub-app; importa de @/apps/<nombre>
apps/
  registry.ts           # registro central de manifests
  <nombre>/             # TODO lo propio de una sub-app
    manifest.ts  types.ts  constants.ts
    components/  hooks/  lib/
shared/                 # lo genérico y reutilizable
  components/ui/        # Button, Card, Field, ChipGroup, ScaleSelect, NumberStepper, ShortTextField, DateField
  components/layout/    # AppShell, PageHeader
  services/storage/     # persistencia (StorageService, useCollection…)
  user/                 # UserProvider / useCurrentUser
  lib/  hooks/  types/
```

## Reglas

1. **Aislamiento**: `apps/<x>` solo importa de `shared/` y de sí misma. Nunca de otra sub-app (lo impone ESLint con `no-restricted-imports`). Si dos sub-apps necesitan lo mismo, súbelo a `shared/`.
2. **Qué va en `shared/`**: lo genérico (UI sin lógica de dominio, servicios, utilidades) o lo que usen ≥ 2 sub-apps. Lo de dominio se queda en la sub-app.
3. **Rutas delgadas**: `app/<ruta>/page.tsx` solo compone componentes de `apps/<nombre>`.
4. **Persistencia**: nunca uses `localStorage` directo. Usa `useCollection(appId, colección, schemaVersion)` de `@/shared/services/storage`. Hoy guarda en localStorage; luego se cambiará el proveedor (ver abajo) sin tocar las sub-apps.
5. **Usuario**: obtén el usuario con `useCurrentUser()`; no asumas un usuario fijo. Hoy es `local`; cuando haya login se reemplaza el `UserProvider` y se protegen rutas con `proxy.ts` o un grupo `(protected)`.
6. **Mobile-first**: estilos base = celular; `md:`/`lg:` solo amplían. Áreas táctiles ≥ 44 px (`min-h-11`), inputs con `text-base` (evita zoom en iOS), sin scroll horizontal. El `AppShell` ya centra el contenido con `max-w-2xl`.
7. **Idioma**: interfaz en español.

## Pasos para crear una sub-app (checklist)

1. Crea `apps/<nombre>/manifest.ts` exportando un `SubAppManifest` (`id`, `name`, `description`, `href`, `icon`). El `id` es el `appId` de la persistencia.
2. Agrega el manifest a `apps/registry.ts` (aparece solo en el home).
3. Crea `app/<ruta>/page.tsx` (y subrutas) delgado, con `PageHeader` y `metadata`.
4. Define tipos y constantes en `apps/<nombre>/`.
5. Para datos: `useCollection<MiTipo>("<appId>", "<colección>", <schemaVersion>)`; el `id` de cada documento lo eliges tú (`save(id, data)`).
6. Reutiliza componentes de `@/shared/components/ui`. Si falta uno genérico, créalo en `shared/`.
7. Ejecuta `npm run lint` y `npm run build`; prueba en ancho 390 px y ≥ 768 px.

## Persistencia: migrar a la app de JSONs

Toda la UI depende de la interfaz `StorageService` (`shared/services/storage/types.ts`). Para migrar:

1. Implementa `RemoteJsonStorageService implements StorageService`.
2. Pásalo en `StorageProvider` (prop `service`) o cámbialo en su valor por defecto.
3. Cada documento viaja envuelto en `{ schemaVersion, updatedAt, data }`.

Claves lógicas: `sisifo:<userId>/<appId>/<colección>/<id>`.

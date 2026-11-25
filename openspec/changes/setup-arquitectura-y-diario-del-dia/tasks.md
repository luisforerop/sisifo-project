## 1. Preparación

- [x] 1.1 Leer las guías relevantes de `node_modules/next/dist/docs/` (estructura de proyecto, layouts/páginas, componentes cliente/servidor, metadata/viewport, CSS) y anotar diferencias con Next 16
- [x] 1.2 Crear la estructura de carpetas `apps/`, `shared/` (components, hooks, lib, types, services, user) y `docs/` con archivos índice mínimos

## 2. Shell, estilos y registro (capability `app-shell`)

- [x] 2.1 Definir tokens de color/tipografía en `app/globals.css` (claro/oscuro, fuente Geist) y quitar los estilos del scaffold
- [x] 2.2 Actualizar `app/layout.tsx`: `lang="es"`, metadata de Sísifo, `viewport` con `viewport-fit=cover`, contenedor `max-w-2xl` centrado, safe areas y `min-h-dvh`
- [x] 2.3 Crear `SubAppManifest` (tipo) y `apps/registry.ts`
- [x] 2.4 Crear `UserProvider` con usuario `local` y hook `useCurrentUser`
- [x] 2.5 Crear componentes de layout compartidos (`AppShell`, `PageHeader` con botón atrás)
- [x] 2.6 Reemplazar `app/page.tsx` por el home tipo marketplace que lista el registro
- [x] 2.7 Agregar `not-found.tsx` y `error.tsx` simples en español

## 3. Persistencia (capability `data-persistence`)

- [x] 3.1 Definir tipos `StorageKey`, `StorageScope`, `StoredDocument` y la interfaz `StorageService`
- [x] 3.2 Implementar `LocalStorageService` (prefijo `sisifo:<userId>/<appId>/<colección>/<id>`, envoltorio versionado, tolerancia a JSON corrupto y a ausencia de `window`)
- [x] 3.3 Crear `StorageProvider` y hooks `useStorage` y `useCollection` (estados loading/error, lectura tras montar)
- [x] 3.4 Montar los providers (usuario y storage) en el layout raíz
- [x] 3.5 Verificar manualmente: guardar, recargar, clave inexistente, JSON corrupto y aislamiento entre dos `appId`

## 4. Componentes UI compartidos

- [x] 4.1 Implementar `Button`, `Card`, `Chip`/`ChipGroup` (multi/single), `ScaleSelect` (1–5), `NumberStepper`, `ShortTextField` con contador y `DateField`, todos con áreas táctiles ≥ 44 px y `text-base` en inputs
- [ ] 4.2 Revisar los componentes en anchos de 390 px y ≥ 768 px (sin scroll horizontal ni estiramientos)

## 5. Sub-app Diario del día (capability `daily-journal`)

- [x] 5.1 Definir `DailyEntry`, constantes (etiquetas de picos/valles, recargadores, proyectos) y `manifest.ts`; registrarlo en `apps/registry.ts`
- [x] 5.2 Implementar validación pura (`validateEntry`) con obligatorios (energía, sueño), rangos y límite de 80 caracteres
- [x] 5.3 Implementar el hook `useDailyEntries` sobre `useCollection` (`id = fecha`, upsert, eliminar, listado descendente)
- [x] 5.4 Construir `DailyEntryForm` (bloques: cuerpo y descanso, trabajo, proyectos clave, balance y cierre) con carga de entrada existente y guardado
- [x] 5.5 Construir `EntryHistory` (lista resumida, abrir/editar, eliminar con confirmación)
- [x] 5.6 Implementar exportación JSON versionada (todo o por rango) con descarga de archivo
- [x] 5.7 Crear `app/diario/page.tsx` y `app/diario/historial/page.tsx` delgados que importen de `@/apps/diario` (fecha por `?fecha=` leída en cliente con `Suspense`)
- [ ] 5.8 Probar el flujo completo en navegador móvil/responsive: registrar, editar, recargar, historial, eliminar, exportar

## 6. Reglas y documentación

- [x] 6.1 Agregar regla ESLint (`no-restricted-imports`) que impida importar entre `apps/*` distintas
- [x] 6.2 Escribir `docs/adding-a-subapp.md` (estructura, aislamiento, registro, persistencia, mobile-first, auth futura, checklist)
- [x] 6.3 Actualizar `AGENTS.md` con enlace a la guía y reglas resumidas (conservando el bloque existente de Next.js)
- [x] 6.4 Actualizar `README.md` con descripción del proyecto y comandos

## 7. Verificación final

- [x] 7.1 Ejecutar `npm run lint` y `npm run build` sin errores
- [ ] 7.2 Recorrer los escenarios de los specs (`app-shell`, `data-persistence`, `daily-journal`) y confirmar que se cumplen

## 8. Ajustes tras revisión del agente (versión 2)

- [x] 8.1 Eliminar ánimo, principal fricción, nota libre y notas por proyecto del modelo, validación, formulario e historial
- [x] 8.2 Reordenar el formulario en cuatro bloques (cuerpo y descanso, trabajo, proyectos, balance y cierre)
- [x] 8.3 Sueño con valor inicial 7,5 h y pasos de 0,5 h; pantalla limitada a ocio (aclarado en la etiqueta)
- [x] 8.4 Ajustar etiquetas de recargadores y agregar el bloque de fugas / dispersión (`leaks`)
- [x] 8.5 Renombrar el nivel 0 de proyecto a «Sin tocar» y agregar texto de apoyo neutral
- [ ] 8.6 Volver a probar en navegador el formulario v2 (se une a 4.2, 5.8 y 7.2)

## Why

Sísifo será un marketplace personal de sub-apps que ayudan en distintos aspectos de la vida, consumido sobre todo desde el celular. Hoy el repo es el scaffold de Create Next App: sin estructura para crecer apps de forma progresiva, sin capa de persistencia y sin ninguna app real. Conviene fijar ahora la arquitectura (antes de que existan muchas apps) y validarla con una primera sub-app útil: un diario del día cuyos datos alimentarán después a un agente que detecte fricciones y oportunidades de mejora.

## What Changes

- Estructura de carpetas que aísla cada sub-app bajo su propia ruta (`/diario`, y futuras) y reserva un espacio compartido (`shared`) para tipos, componentes UI, hooks y servicios.
- Home (`/`) que funciona como "marketplace": lista las sub-apps registradas a partir de un registro central (manifest por sub-app).
- Layout y estilos mobile-first (Tailwind 4) que se adaptan correctamente a iPad y Mac (contenedor con ancho máximo, áreas táctiles ≥ 44px, safe areas).
- Capa de persistencia abstracta (`StorageService` + hook) con implementación `localStorage` y espacios de nombres por sub-app, diseñada para cambiar luego a la app externa que guarda JSONs sin tocar la UI.
- Preparación (sin implementarla) para autenticación futura: las claves de almacenamiento y el servicio reciben un contexto de usuario (hoy `local`), y se reserva `proxy.ts`/grupo de rutas para el login.
- Primera sub-app **Diario del día** (`/diario`): registro diario rápido de ~25 segundos (casi todo selección/números; un único texto ultra-corto sobre el trabajo), historial, edición y exportación a JSON para pasarlo a un agente.
- Documentación para agentes y humanos (`docs/` y actualización de `AGENTS.md`) con instrucciones claras para agregar nuevas sub-apps.
- Reemplazo de la página y metadata de Create Next App (título, `lang="es"`).

## Capabilities

### New Capabilities
- `app-shell`: Estructura de sub-apps por ruta, registro central, home tipo marketplace, layout mobile-first responsivo, espacio compartido y guía para agregar nuevas apps; preparado para autenticación futura.
- `data-persistence`: Servicio de persistencia agnóstico del backend (localStorage hoy, API de JSONs mañana), con espacios de nombres por sub-app y usuario.
- `daily-journal`: Sub-app de registro diario (campos, validación, una entrada por día, historial, edición y exportación JSON).

### Modified Capabilities
<!-- Ninguna: no existen specs previos. -->

## Impact

- Código: `app/` (layout, home, ruta `/diario`), nuevas carpetas `shared/` y `apps/diario/` (o equivalentes definidas en design.md), `app/globals.css`, `AGENTS.md`, nuevo `docs/`.
- Dependencias: ninguna nueva obligatoria (Next 16, React 19, Tailwind 4 ya presentes).
- Sin APIs externas en esta iteración; la integración con la app de JSONs queda para el siguiente cambio.
- Los campos del diario se ajustaron tras la revisión del agente (versión 2): se eliminaron ánimo, fricción, nota libre y notas por proyecto; se agregaron fugas/dispersión y la pantalla pasó a ser solo de ocio.

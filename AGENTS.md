<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Arquitectura de sub-apps

Sísifo es un marketplace personal de sub-apps (una por ruta). Antes de crear o modificar una sub-app, lee `docs/adding-a-subapp.md`. Reglas clave:

- `app/` solo enruta; la lógica de cada sub-app vive en `apps/<nombre>/` y lo genérico en `shared/`.
- Una sub-app nunca importa de otra (lo impone ESLint).
- Persistencia solo vía `useCollection` / `StorageService`, nunca `localStorage` directo.
- Mobile-first (celular primero; debe verse bien en iPad y Mac). Interfaz en español.

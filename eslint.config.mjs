import { readdirSync } from "node:fs";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Aislamiento: una sub-app (apps/<x>) no puede importar de otra (apps/<y>).
const subApps = readdirSync("apps", { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const isolationRules = subApps
  .filter((name) => subApps.length > 1 && name)
  .map((name) => ({
  files: [`apps/${name}/**/*.{ts,tsx}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: subApps
              .filter((other) => other !== name)
              .flatMap((other) => [`@/apps/${other}`, `@/apps/${other}/*`]),
            message:
              "Una sub-app no puede importar de otra. Mueve lo común a shared/.",
          },
        ],
      },
    ],
  },
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...isolationRules,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

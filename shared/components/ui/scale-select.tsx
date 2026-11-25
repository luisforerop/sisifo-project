"use client";

import { cn } from "@/shared/lib/cn";

type ScaleSelectProps = {
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Etiquetas de los extremos, ej. ["Agotado", "Con energía"]. */
  endLabels?: [string, string];
  label?: string;
};

export function ScaleSelect({
  value,
  onChange,
  min = 1,
  max = 5,
  endLabels,
  label,
}: ScaleSelectProps) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div>
      <div role="radiogroup" aria-label={label} className="flex gap-2">
        {steps.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={cn(
              "min-h-12 flex-1 rounded-xl border text-lg font-medium transition-colors",
              value === n
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-surface",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {endLabels && (
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>{endLabels[0]}</span>
          <span>{endLabels[1]}</span>
        </div>
      )}
    </div>
  );
}

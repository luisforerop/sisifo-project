"use client";

import { cn } from "@/shared/lib/cn";

type Option = string | { value: string; label: string };

function norm(o: Option) {
  return typeof o === "string" ? { value: o, label: o } : o;
}

type ChipGroupProps = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  /** `multi` permite varias; si no, solo una (tocar de nuevo la deselecciona). */
  multi?: boolean;
  label?: string;
};

export function ChipGroup({ options, value, onChange, multi = false, label }: ChipGroupProps) {
  function toggle(v: string) {
    if (value.includes(v)) return onChange(value.filter((x) => x !== v));
    onChange(multi ? [...value, v] : [v]);
  }
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map(norm).map((o) => {
        const selected = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(o.value)}
            className={cn(
              "min-h-11 rounded-full border px-4 text-base transition-colors",
              selected
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-surface",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

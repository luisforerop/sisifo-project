"use client";

type NumberStepperProps = {
  value: number | null;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  /** Valor al que salta la primera vez que se toca + o −. */
  start?: number;
  unit?: string;
  label?: string;
};

export function NumberStepper({
  value,
  onChange,
  step = 0.5,
  min = 0,
  max = 24,
  start = 0,
  unit,
  label,
}: NumberStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n * 100) / 100));
  const change = (delta: number) =>
    onChange(value === null ? clamp(start) : clamp(value + delta));
  const btn =
    "flex size-12 items-center justify-center rounded-xl border border-border bg-surface text-2xl active:opacity-70";
  return (
    <div className="flex items-center gap-3" role="group" aria-label={label}>
      <button type="button" className={btn} aria-label="Restar" onClick={() => change(-step)}>
        −
      </button>
      <output className="min-w-20 text-center text-xl font-medium">
        {value === null ? "—" : value}
        {value !== null && unit ? <span className="ml-1 text-sm text-muted">{unit}</span> : null}
      </output>
      <button type="button" className={btn} aria-label="Sumar" onClick={() => change(step)}>
        +
      </button>
    </div>
  );
}

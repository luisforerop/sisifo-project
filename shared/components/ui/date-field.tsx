"use client";

export function DateField({
  value,
  onChange,
  label,
  max,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  max?: string;
}) {
  return (
    <input
      type="date"
      aria-label={label}
      value={value}
      max={max}
      onChange={(e) => e.target.value && onChange(e.target.value)}
      className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-base"
    />
  );
}

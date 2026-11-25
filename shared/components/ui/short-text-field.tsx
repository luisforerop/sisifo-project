"use client";

type ShortTextFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  label?: string;
};

export function ShortTextField({
  value,
  onChange,
  placeholder,
  maxLength = 80,
  label,
}: ShortTextFieldProps) {
  return (
    <div>
      <input
        type="text"
        aria-label={label}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-base"
      />
      <p className="mt-1 text-right text-xs text-muted">
        {maxLength - value.length} caracteres restantes
      </p>
    </div>
  );
}

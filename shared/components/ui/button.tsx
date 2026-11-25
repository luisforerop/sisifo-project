import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground",
  secondary: "border border-border bg-surface",
  danger: "border border-danger text-danger",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={cn(
        "min-h-11 rounded-xl px-5 text-base font-medium transition-opacity active:opacity-70 disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

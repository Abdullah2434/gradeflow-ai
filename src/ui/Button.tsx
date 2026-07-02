"use client";

import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "accent";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: cn(theme.radius.md, "px-4 py-2 text-sm font-semibold", theme.color.primary, theme.focus.ring),
  accent: cn(theme.radius.md, "px-4 py-2 text-sm font-semibold", theme.color.accent, theme.focus.ring),
  secondary: cn(
    theme.radius.md,
    "px-4 py-2 text-sm font-semibold",
    "border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-subtle)]",
    theme.focus.ring
  ),
  danger: cn(theme.radius.md, "px-4 py-2 text-sm font-semibold", theme.color.danger, theme.focus.ring),
  ghost: cn(
    theme.radius.md,
    "px-3 py-2 text-sm font-medium",
    "text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]",
    theme.focus.ring
  ),
};

const sizeClass: Record<Size, string> = {
  sm: "h-9",
  md: "h-10",
};

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
) {
  const { className, variant = "primary", size = "md", type = "button", ...rest } = props;
  return (
    <button
      type={type}
      className={cn("inline-flex items-center justify-center gap-2", variantClass[variant], sizeClass[size], className)}
      {...rest}
    />
  );
}

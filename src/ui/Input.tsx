import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={cn(
        "h-10 w-full",
        theme.radius.md,
        "border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)]",
        theme.focus.ring,
        className
      )}
      {...rest}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return (
    <textarea
      className={cn(
        "min-h-28 w-full",
        theme.radius.md,
        "border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)]",
        theme.focus.ring,
        className
      )}
      {...rest}
    />
  );
}

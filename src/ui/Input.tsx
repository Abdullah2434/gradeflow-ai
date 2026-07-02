import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={cn(
        "h-10 w-full",
        theme.radius.md,
        "border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--ink)] shadow-[inset_0_1px_2px_rgba(26,33,30,0.04)] placeholder:text-[var(--ink-muted)] transition-all duration-150",
        theme.focus.input,
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
        "border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--ink)] shadow-[inset_0_1px_2px_rgba(26,33,30,0.04)] placeholder:text-[var(--ink-muted)] transition-all duration-150",
        theme.focus.input,
        className
      )}
      {...rest}
    />
  );
}

import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
  htmlFor,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]"
        >
          {label}
        </label>
      ) : null}
      {children}
    </div>
  );
}

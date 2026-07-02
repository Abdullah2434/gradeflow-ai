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
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold tracking-wide text-[var(--ink-soft)]"
        >
          {label}
        </label>
      ) : null}
      {children}
    </div>
  );
}

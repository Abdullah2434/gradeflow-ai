import { cn } from "@/lib/utils";
import type { SubmissionStatus } from "@/types/submission.types";

type Variant = "neutral" | "warning" | "success" | "danger" | "accent";

const variantClass: Record<Variant, string> = {
  neutral: "bg-[var(--surface-subtle)] text-[var(--ink-muted)] border border-[var(--border)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning-text)] border border-[var(--warning-border)]",
  success: "bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger-border)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20",
};

const statusVariant: Record<SubmissionStatus, Variant> = {
  pending_extraction: "neutral",
  pending_ai_grade: "neutral",
  pending_teacher_review: "warning",
  approved: "success",
  flagged_low_confidence: "danger",
};

export function Badge({
  variant = "neutral",
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold tracking-wide uppercase",
        variantClass[variant],
        className
      )}
      {...rest}
    />
  );
}

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const labels: Record<SubmissionStatus, string> = {
    pending_extraction: "Extracting",
    pending_ai_grade: "Grading",
    pending_teacher_review: "Needs review",
    approved: "Approved",
    flagged_low_confidence: "Low confidence",
  };
  return <Badge variant={statusVariant[status]}>{labels[status]}</Badge>;
}

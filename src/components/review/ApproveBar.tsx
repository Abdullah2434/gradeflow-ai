"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/ui/Button";

export function ApproveBar({
  onApprove,
  isLoading,
  totalScore,
}: {
  onApprove: () => void;
  isLoading: boolean;
  totalScore: number;
}) {
  return (
    <div className="sticky bottom-6 flex flex-col gap-4 rounded-2xl border border-[var(--accent)]/20 bg-[var(--surface)] p-5 shadow-lg md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">Final score</div>
        <div className="display-title text-3xl font-semibold text-[var(--accent)]">{totalScore}</div>
      </div>
      <Button variant="accent" className="h-12 px-8 text-base" onClick={onApprove} disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
        Approve & send to student
      </Button>
    </div>
  );
}

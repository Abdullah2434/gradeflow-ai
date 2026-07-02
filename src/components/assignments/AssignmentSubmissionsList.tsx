"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGetSubmissionsByAssignmentQuery } from "@/store/services/submissions/submissionsApi";
import { StatusBadge } from "@/ui/Badge";
import { SubmissionsListSkeleton } from "@/skeletons/SubmissionsListSkeleton";
import type { SubmissionStatus } from "@/types/submission.types";

function studentLabel(students: { name?: string | null; full_name?: string | null } | null | undefined) {
  return students?.full_name || students?.name || "Student";
}

export function AssignmentSubmissionsList({ assignmentId }: { assignmentId: string }) {
  const { data, isFetching, isError } = useGetSubmissionsByAssignmentQuery({ assignmentId });

  if (isFetching) return <SubmissionsListSkeleton />;
  if (isError) return <div className="text-sm text-red-700">Failed to load submissions.</div>;
  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)] p-8 text-center text-sm text-[var(--ink-muted)]">
        No submissions yet. Share the submit link with students.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((s) => {
        const reviewable: SubmissionStatus[] = ["pending_teacher_review", "flagged_low_confidence"];
        const canReview = reviewable.includes(s.status);
        return (
          <div
            key={s.id}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-[var(--ink)]">{studentLabel(s.students)}</div>
                <StatusBadge status={s.status} />
              </div>
              <div className="mt-1 text-xs text-[var(--ink-muted)]">
                Submitted {new Date(s.submitted_at).toLocaleString()}
              </div>
            </div>
            {canReview ? (
              <Link
                href={`/review/${s.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
              >
                Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : s.status === "approved" ? (
              <span className="text-sm text-[var(--ink-muted)]">Approved</span>
            ) : (
              <span className="text-sm text-[var(--ink-muted)]">Processing…</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

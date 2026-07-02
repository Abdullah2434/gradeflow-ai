"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import {
  useGenerateInsightsMutation,
  useGetClassInsightsQuery,
} from "@/store/services/insights/insightsApi";
import { WeakCriteriaChart } from "@/components/insights/WeakCriteriaChart";
import { InsightsSkeleton } from "@/skeletons/InsightsSkeleton";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";

export function InsightsScreen({ assignmentId }: { assignmentId: string }) {
  const { data, isFetching, isError, refetch } = useGetClassInsightsQuery({ assignmentId });
  const [generate, { isLoading: isGenerating }] = useGenerateInsightsMutation();

  async function onGenerate() {
    await generate({ assignmentId }).unwrap();
    refetch();
  }

  if (isFetching) return <InsightsSkeleton />;

  return (
    <div className="space-y-6">
      <Link
        href={`/assignments/${assignmentId}`}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to assignment
      </Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="display-title text-3xl font-semibold text-[var(--ink)]">Class insights</h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Weak criteria and common errors across approved submissions
          </p>
        </div>
        <Button variant="accent" onClick={onGenerate} disabled={isGenerating}>
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "Generating…" : "Generate insights"}
        </Button>
      </div>

      {isError ? (
        <div className="text-sm text-red-700">Failed to load insights for this assignment.</div>
      ) : null}

      {!data ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-[var(--ink-muted)]">
            No insights yet. Approve submissions first, then generate.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Weakest criteria</CardTitle>
            </CardHeader>
            <CardContent>
              {data.weak_criteria?.length ? (
                <WeakCriteriaChart data={data.weak_criteria} />
              ) : (
                <div className="text-sm text-[var(--ink-muted)]">No criteria data yet.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common errors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-[var(--ink)]">{data.common_errors}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

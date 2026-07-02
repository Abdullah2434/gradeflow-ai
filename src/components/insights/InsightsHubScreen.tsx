"use client";

import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useGetAssignmentsQuery } from "@/store/services/assignments/assignmentsApi";
import { AssignmentsSkeleton } from "@/skeletons/AssignmentsSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { theme } from "@/lib/theme";
import { Badge } from "@/ui/Badge";

const DEMO_CLASS_ID = "00000000-0000-0000-0000-000000000001";

export function InsightsHubScreen() {
  const { data, isFetching, isError } = useGetAssignmentsQuery({ classId: DEMO_CLASS_ID });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-title text-3xl font-semibold text-[var(--ink)]">Class insights</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Pick an assignment to view weak criteria and common errors across approved submissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <AssignmentsSkeleton />
          ) : isError ? (
            <div className={theme.component.alertDanger}>Failed to load assignments.</div>
          ) : (data?.length ?? 0) === 0 ? (
            <div className="text-sm text-[var(--ink-muted)]">No assignments yet.</div>
          ) : (
            <div className="space-y-2">
              {data!.map((assignment) => (
                <div key={assignment.id} className={theme.component.listRow}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-[var(--ink)]">{assignment.title}</div>
                      <Badge variant="neutral">{assignment.rubric_json.length} criteria</Badge>
                    </div>
                    {assignment.description ? (
                      <p className="mt-1 text-sm text-[var(--ink-muted)]">{assignment.description}</p>
                    ) : null}
                  </div>
                  <Link href={`/insights/${assignment.id}`} className={theme.component.rowActionAccent}>
                    <BarChart3 className="h-4 w-4" />
                    View insights
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

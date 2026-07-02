"use client";

import Link from "next/link";
import { ArrowLeft, BarChart3, ExternalLink } from "lucide-react";
import { useGetAssignmentByIdQuery } from "@/store/services/assignments/assignmentsApi";
import { AssignmentSubmissionsList } from "@/components/assignments/AssignmentSubmissionsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { AssignmentsSkeleton } from "@/skeletons/AssignmentsSkeleton";

export function AssignmentDetailScreen({ id }: { id: string }) {
  const { data, isFetching, isError } = useGetAssignmentByIdQuery({ id });

  return (
    <div className="space-y-6">
      <Link
        href="/assignments"
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to assignments
      </Link>

      {isFetching ? (
        <AssignmentsSkeleton />
      ) : isError || !data ? (
        <div className="text-sm text-red-700">Failed to load assignment.</div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>{data.title}</CardTitle>
                  {data.description ? (
                    <p className="mt-2 text-sm text-[var(--ink-muted)]">{data.description}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">{data.rubric_json.length} criteria</Badge>
                  {data.due_date ? <Badge variant="warning">Due {data.due_date}</Badge> : null}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href={`/submit/${data.id}`} target="_blank">
                <Button variant="secondary">
                  <ExternalLink className="h-4 w-4" />
                  Student submit link
                </Button>
              </Link>
              <Link href={`/insights/${data.id}`}>
                <Button variant="secondary">
                  <BarChart3 className="h-4 w-4" />
                  Class insights
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <AssignmentSubmissionsList assignmentId={data.id} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

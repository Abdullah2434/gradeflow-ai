"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Copy, ArrowRight } from "lucide-react";
import {
  useCreateAssignmentMutation,
  useGetAssignmentsQuery,
} from "@/store/services/assignments/assignmentsApi";
import type { RubricCriterion } from "@/types/assignment.types";
import { RubricBuilder } from "@/components/assignments/RubricBuilder";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { Field } from "@/ui/Field";
import { Select } from "@/ui/Select";
import { Badge } from "@/ui/Badge";
import { AssignmentsSkeleton } from "@/skeletons/AssignmentsSkeleton";
import { theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function normalizeRubric(rubric: RubricCriterion[]): RubricCriterion[] {
  return rubric.map((r) => ({
    criterion: String(r.criterion ?? ""),
    max_points: Number(r.max_points ?? 0),
  }));
}

function getRtkErrorMessage(err: unknown) {
  if (!err || typeof err !== "object") return null;
  const maybeData = (err as { data?: unknown }).data;
  if (!maybeData || typeof maybeData !== "object") return null;
  const maybeError = (maybeData as { error?: unknown }).error;
  return typeof maybeError === "string" ? maybeError : null;
}

export function AssignmentsScreen() {
  const [classId, setClassId] = useState("00000000-0000-0000-0000-000000000001");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [rubric, setRubric] = useState<RubricCriterion[]>([
    { criterion: "Thesis clarity", max_points: 10 },
  ]);
  const [copyFrom, setCopyFrom] = useState<string>("");
  const [createError, setCreateError] = useState<string | null>(null);

  const shouldFetch = classId.trim().length > 0;
  const { data, isFetching, isError, error } = useGetAssignmentsQuery(
    { classId: classId.trim() },
    { skip: !shouldFetch },
  );
  const [createAssignment, { isLoading: isCreating }] =
    useCreateAssignmentMutation();

  const copyOptions = useMemo(
    () =>
      (data ?? []).map((a) => ({
        id: a.id,
        title: a.title,
        rubric: a.rubric_json,
      })),
    [data],
  );

  async function onCreate() {
    setCreateError(null);
    try {
      const payload = {
        class_id: classId.trim(),
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate || undefined,
        rubric_json: rubric,
      };
      const created = await createAssignment(payload).unwrap();
      setTitle("");
      setDescription("");
      setDueDate("");
      setRubric(normalizeRubric(created.rubric_json));
    } catch (err) {
      setCreateError(getRtkErrorMessage(err) ?? "Failed to create assignment");
    }
  }

  function applyCopy() {
    const selected = copyOptions.find((o) => o.id === copyFrom);
    if (!selected) return;
    setRubric(normalizeRubric(selected.rubric));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className={theme.animation.fadeUp}>
          <div className={theme.component.pageEyebrow}>Dashboard</div>
          <h1 className="display-title mt-2 text-4xl font-semibold text-[var(--ink)]">Assignments</h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--ink-muted)]">
            Build rubrics once, reuse them, and track every submission through the grading pipeline.
          </p>
        </div>
        <Field label="Class ID" className="w-full max-w-sm">
          <Input
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            placeholder="Paste class UUID"
          />
        </Field>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Title" className="md:col-span-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Essay 1: Industrial Revolution"
              />
            </Field>
            <Field label="Due date">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Field>
            <Field label="Description" className="md:col-span-3">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional student instructions"
              />
            </Field>
          </div>

          <div className={cn(theme.component.insetPanel, "flex flex-col gap-4 md:flex-row md:items-end md:justify-between")}>
            <Field label="Create from existing assignment" className="flex-1">
              <Select
                  value={copyFrom}
                  onChange={setCopyFrom}
                  placeholder="Select an assignment…"
                  emptyMessage="No assignments yet"
                  options={copyOptions.map((o) => ({
                    label: o.title,
                    value: o.id,
                    description: `${o.rubric.length} rubric criteria`,
                  }))}
                  aria-label="Create from existing assignment"
              />
            </Field>
            <Button
              variant="secondary"
              onClick={applyCopy}
              disabled={!copyFrom}
            >
              <Copy className="h-4 w-4 mx-2" />
              Copy rubric
            </Button>
          </div>

          <RubricBuilder value={rubric} onChange={setRubric} />

          {createError ? <div className={theme.component.alertDanger}>{createError}</div> : null}

          <div className="flex justify-end">
            <Button variant="accent" onClick={onCreate}
              disabled={
                !shouldFetch ||
                !title.trim() ||
                rubric.length === 0 ||
                isCreating
              }
            >
              <Plus className="h-4 w-4" />
              {isCreating ? "Creating…" : "Create assignment"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {!shouldFetch ? (
            <div className="my-2 text-sm text-[var(--ink-muted)]">
              Enter a Class ID to load assignments.
            </div>
          ) : isFetching ? (
            <AssignmentsSkeleton />
          ) : isError ? (
            <div className={theme.component.alertDanger}>
              {getRtkErrorMessage(error) ?? "Failed to load assignments"}
            </div>
          ) : (data?.length ?? 0) === 0 ? (
            <div className="text-sm text-[var(--ink-muted)]">No assignments yet.</div>
          ) : (
            <div className="space-y-2">
              {data!.map((a) => (
                <div key={a.id} className={theme.component.listRow}>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-[var(--ink)]">
                        {a.title}
                      </div>
                      <Badge variant="neutral">
                        {a.rubric_json.length} criteria
                      </Badge>
                      {a.due_date ? (
                        <Badge variant="warning">Due {a.due_date}</Badge>
                      ) : null}
                    </div>
                    {a.description ? (
                      <div className="mt-1 text-sm text-[var(--ink-muted)]">
                        {a.description}
                      </div>
                    ) : null}
                  </div>
                  <Link href={`/assignments/${a.id}`} className={theme.component.rowAction}>
                    View
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

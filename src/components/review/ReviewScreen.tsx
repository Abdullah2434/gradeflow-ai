"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  useApproveSubmissionMutation,
  useGetSubmissionForReviewQuery,
} from "@/store/services/submissions/submissionsApi";
import type { GradeCriterionScore } from "@/types/grade.types";
import { AIFeedbackPreview } from "@/components/review/AIFeedbackPreview";
import { ApproveBar } from "@/components/review/ApproveBar";
import { CriterionScoreEditor } from "@/components/review/CriterionScoreEditor";
import { ReviewScreenSkeleton } from "@/skeletons/ReviewScreenSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Textarea } from "@/ui/Input";

export function ReviewScreen({ submissionId }: { submissionId: string }) {
  const { data, isFetching, isError } = useGetSubmissionForReviewQuery({ id: submissionId });
  const [approve, { isLoading: isApproving }] = useApproveSubmissionMutation();

  const [scores, setScores] = useState<GradeCriterionScore[]>([]);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (data?.ai_grade) {
      setScores(data.ai_grade.criterion_scores);
      setFeedback(data.ai_grade.suggested_comment ?? "");
    }
  }, [data]);

  const totalScore = useMemo(() => scores.reduce((sum, s) => sum + (Number(s.score) || 0), 0), [scores]);

  const editedFromAi = useMemo(() => {
    if (!data?.ai_grade) return false;
    const ai = data.ai_grade;
    if (feedback !== (ai.suggested_comment ?? "")) return true;
    return scores.some((s, i) => s.score !== ai.criterion_scores[i]?.score);
  }, [data, scores, feedback]);

  async function onApprove() {
    await approve({
      id: submissionId,
      payload: {
        final_criterion_scores: scores,
        final_total_score: totalScore,
        final_feedback: feedback,
        edited_from_ai: editedFromAi,
      },
    }).unwrap();
    setDone(true);
  }

  if (isFetching) return <ReviewScreenSkeleton />;
  if (isError || !data?.submission) {
    return <div className="text-sm text-red-700">Failed to load submission for review.</div>;
  }

  const { submission, ai_grade: aiGrade } = data;

  return (
    <div className="space-y-6 pb-24">
      <Link
        href={`/assignments/${submission.assignment_id}`}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to assignment
      </Link>

      <div>
        <h1 className="display-title text-3xl font-semibold text-[var(--ink)]">Review submission</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          {submission.assignments?.title ?? "Assignment"} — adjust scores and approve
        </p>
      </div>

      {done ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
          Approved and sent to student via WhatsApp (or test number fallback).
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Extracted submission</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-[var(--surface-subtle)] p-4 text-sm text-[var(--ink)]">
              {submission.extracted_text || "No extracted text"}
            </pre>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {aiGrade ? (
            <AIFeedbackPreview
              strengths={aiGrade.strengths}
              areasToImprove={aiGrade.areas_to_improve}
              suggestedComment={aiGrade.suggested_comment}
              confidence={aiGrade.confidence}
            />
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Edit scores</CardTitle>
            </CardHeader>
            <CardContent>
              <CriterionScoreEditor scores={scores} onChange={setScores} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Final feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            </CardContent>
          </Card>
        </div>
      </div>

      {!done ? <ApproveBar onApprove={onApprove} isLoading={isApproving} totalScore={totalScore} /> : null}
    </div>
  );
}

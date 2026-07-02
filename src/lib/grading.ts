import type { RubricCriterion } from "@/types/assignment.types";
import type { GradingResult } from "@/types/grade.types";

export async function callClaudeForGrading(
  submissionText: string,
  rubric: RubricCriterion[],
  feedbackTone: string
): Promise<GradingResult> {
  if (process.env.AI_STUB === "1") {
    const first = rubric[0];
    return {
      criterion_scores: rubric.map((c) => ({
        criterion: c.criterion,
        score: Math.min(c.max_points, Math.max(0, Math.round(c.max_points * 0.7))),
        max: c.max_points,
        justification: "Stub grading result (AI_STUB=1).",
      })),
      total_score: rubric.reduce((sum, c) => sum + Math.min(c.max_points, Math.max(0, Math.round(c.max_points * 0.7))), 0),
      strengths: `Stub strengths (${feedbackTone}).`,
      areas_to_improve: "Stub areas to improve.",
      suggested_comment: `Stub comment. Example criterion: ${first?.criterion ?? "N/A"}`,
      confidence: "high",
    };
  }

  const prompt = `You are grading a student submission against this rubric: ${JSON.stringify(rubric)}.
Feedback tone should be: ${feedbackTone}.
Submission text:
"""
${submissionText}
"""
Return ONLY valid JSON matching this shape, no markdown fences, no preamble:
{
  "criterion_scores": [{ "criterion": string, "score": number, "max": number, "justification": string }],
  "total_score": number,
  "strengths": string,
  "areas_to_improve": string,
  "suggested_comment": string,
  "confidence": "high" | "medium" | "low"
}
Set confidence to "low" if the submission is illegible, off-topic, or the rubric cannot be fairly applied.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Grading call failed: ${await res.text()}`);

  const data = (await res.json()) as { content?: Array<{ text?: string }> };
  const text = (data.content ?? []).map((c) => c.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim()) as GradingResult;
}


import { baseApi } from "@/store/services/baseApi";
import type { CreateSubmissionPayload, Submission } from "@/types/submission.types";
import type { GradeCriterionScore } from "@/types/grade.types";

export interface SubmissionWithStudent extends Submission {
  students?: {
    id: string;
    name?: string | null;
    full_name?: string | null;
    parent_whatsapp_number?: string | null;
    student_whatsapp_number?: string | null;
  } | null;
}

export interface ReviewSubmissionResponse {
  submission: SubmissionWithStudent & {
    assignments?: {
      id: string;
      title: string;
      rubric_json: Array<{ criterion: string; max_points: number }>;
      class_id: string | null;
    } | null;
  };
  ai_grade: {
    id: string;
    submission_id: string;
    criterion_scores: GradeCriterionScore[];
    total_score: number;
    strengths: string | null;
    areas_to_improve: string | null;
    suggested_comment: string | null;
    confidence: string | null;
  } | null;
}

export interface ApproveSubmissionPayload {
  final_criterion_scores: GradeCriterionScore[];
  final_total_score: number;
  final_feedback: string;
  edited_from_ai: boolean;
}

export const submissionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubmissionsByAssignment: build.query<SubmissionWithStudent[], { assignmentId: string }>({
      query: ({ assignmentId }) => ({
        url: "/submissions",
        params: { assignmentId },
      }),
      providesTags: (_res, _err, arg) => [
        { type: "Submissions", id: arg.assignmentId },
        { type: "Submissions", id: "LIST" },
      ],
    }),
    getSubmissionForReview: build.query<ReviewSubmissionResponse, { id: string }>({
      query: ({ id }) => ({ url: `/submissions/${id}` }),
      providesTags: (_res, _err, arg) => [{ type: "Submissions", id: arg.id }],
    }),
    submitAssignment: build.mutation<
      { submission_id: string; status: string },
      CreateSubmissionPayload
    >({
      query: (body) => ({ url: "/submissions", method: "POST", body }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Submissions", id: arg.assignment_id },
        { type: "Submissions", id: "LIST" },
      ],
    }),
    approveSubmission: build.mutation<
      { success: boolean; submission_id: string; assignment_id: string; status: string },
      { id: string; payload: ApproveSubmissionPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/submissions/${id}/approve`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Submissions", id: arg.id },
        { type: "Submissions", id: "LIST" },
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            baseApi.util.invalidateTags([
              { type: "Submissions", id: data.assignment_id },
            ])
          );
        } catch {
          // ignore
        }
      },
    }),
  }),
});

export const {
  useGetSubmissionsByAssignmentQuery,
  useGetSubmissionForReviewQuery,
  useSubmitAssignmentMutation,
  useApproveSubmissionMutation,
} = submissionsApi;

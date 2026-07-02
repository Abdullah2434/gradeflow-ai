import { baseApi } from "@/store/services/baseApi";

export interface WeakCriterion {
  criterion: string;
  average: number;
  max: number;
  pct: number;
}

export interface ClassInsight {
  id: string;
  class_id: string | null;
  assignment_id: string | null;
  weak_criteria: WeakCriterion[] | null;
  common_errors: string | null;
  generated_at: string;
}

export const insightsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getClassInsights: build.query<ClassInsight | null, { assignmentId: string }>({
      query: ({ assignmentId }) => ({ url: `/insights/${assignmentId}` }),
      providesTags: (_res, _err, arg) => [{ type: "Insights", id: arg.assignmentId }],
    }),
    generateInsights: build.mutation<ClassInsight, { assignmentId: string }>({
      query: ({ assignmentId }) => ({
        url: "/insights/generate",
        method: "POST",
        body: { assignmentId },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: "Insights", id: arg.assignmentId }],
    }),
  }),
});

export const { useGetClassInsightsQuery, useGenerateInsightsMutation } = insightsApi;

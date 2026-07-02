import { baseApi } from "@/store/services/baseApi";
import type { Assignment, CreateAssignmentPayload } from "@/types/assignment.types";

export const assignmentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAssignments: build.query<Assignment[], { classId: string }>({
      query: ({ classId }) => ({ url: "/assignments", params: { classId } }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((a) => ({ type: "Assignments" as const, id: a.id })),
              { type: "Assignments" as const, id: "LIST" },
            ]
          : [{ type: "Assignments" as const, id: "LIST" }],
    }),
    getAssignmentById: build.query<Assignment, { id: string }>({
      query: ({ id }) => ({ url: `/assignments/${id}` }),
      providesTags: (_res, _err, arg) => [{ type: "Assignments", id: arg.id }],
    }),
    createAssignment: build.mutation<Assignment, CreateAssignmentPayload>({
      query: (body) => ({ url: "/assignments", method: "POST", body }),
      invalidatesTags: [{ type: "Assignments", id: "LIST" }],
    }),
  }),
});

export const { useGetAssignmentsQuery, useGetAssignmentByIdQuery, useCreateAssignmentMutation } = assignmentsApi;


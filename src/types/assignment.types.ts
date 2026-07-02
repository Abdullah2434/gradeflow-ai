export interface RubricCriterion {
  criterion: string;
  max_points: number;
}

export interface Assignment {
  id: string;
  class_id: string | null;
  teacher_id: string | null;
  title: string;
  description: string | null;
  rubric_json: RubricCriterion[];
  due_date: string | null;
  created_at: string;
}

export interface CreateAssignmentPayload {
  class_id: string;
  title: string;
  description?: string;
  due_date?: string;
  rubric_json: RubricCriterion[];
}


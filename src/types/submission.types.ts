export type SubmissionStatus =
  | "pending_extraction"
  | "pending_ai_grade"
  | "pending_teacher_review"
  | "approved"
  | "flagged_low_confidence";

export type FileType = "pdf" | "doc" | "docx" | "image" | "text";

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  file_type: FileType;
  extracted_text: string | null;
  status: SubmissionStatus;
  submitted_at: string;
}

export interface CreateSubmissionPayload {
  assignment_id: string;
  student_id: string;
  file_url: string;
  file_type: FileType;
  pasted_text?: string;
}


import { SubmissionUploadForm } from "@/components/submit/SubmissionUploadForm";
import { GraduationCap } from "lucide-react";

export default async function Page({ params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;

  return (
    <div className="paper-texture grid-overlay min-h-dvh py-12">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="display-title text-3xl font-semibold text-[var(--ink)]">Student submission</h1>
            <p className="text-sm text-[var(--ink-muted)]">Upload your assignment for AI-assisted grading</p>
          </div>
        </div>
        <div className="max-w-2xl">
          <SubmissionUploadForm assignmentId={assignmentId} />
        </div>
      </div>
    </div>
  );
}

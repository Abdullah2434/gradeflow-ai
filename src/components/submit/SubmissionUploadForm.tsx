"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useSubmitAssignmentMutation } from "@/store/services/submissions/submissionsApi";
import type { FileType } from "@/types/submission.types";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Textarea } from "@/ui/Input";
import { Select } from "@/ui/Select";
import { FileUpload } from "@/ui/FileUpload";
import { Badge } from "@/ui/Badge";

const DEMO_STUDENTS = [
  {
    label: "Alex Morgan",
    value: "00000000-0000-0000-0000-000000000002",
    description: "Demo student · Class 1",
  },
  {
    label: "Jordan Lee",
    value: "00000000-0000-0000-0000-000000000003",
    description: "Demo student · Class 1",
  },
] as const;

function detectFileType(file: File): FileType {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".doc")) return "doc";
  if (file.type.startsWith("image/")) return "image";
  return "text";
}

function getSubmitError(err: unknown) {
  if (!err || typeof err !== "object") return "Submission failed";
  const maybeData = (err as { data?: unknown }).data;
  if (!maybeData || typeof maybeData !== "object") return "Submission failed";
  const message = (maybeData as { error?: unknown }).error;
  return typeof message === "string" ? message : "Submission failed";
}

export function SubmissionUploadForm({ assignmentId }: { assignmentId: string }) {
  const [studentId, setStudentId] = useState<string>(DEMO_STUDENTS[0].value);
  const [mode, setMode] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [result, setResult] = useState<{ submission_id: string; status: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [submit, { isLoading }] = useSubmitAssignmentMutation();

  async function uploadFile(selected: File): Promise<string> {
    const uploadRes = await fetch("/api/storage/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: selected.name, contentType: selected.type }),
    });
    if (!uploadRes.ok) throw new Error("Failed to get upload URL");
    const { signedUrl, publicUrl, token } = await uploadRes.json();

    const putRes = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": selected.type || "application/octet-stream",
        "x-upsert": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: selected,
    });
    if (!putRes.ok) throw new Error("File upload failed");
    return publicUrl as string;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      let fileUrl = "text://inline";
      let fileType: FileType = "text";

      if (mode === "file") {
        if (!file) {
          setError("Please select a file");
          return;
        }
        fileType = detectFileType(file);
        fileUrl = await uploadFile(file);
      } else if (!pastedText.trim()) {
        setError("Please paste your submission text");
        return;
      }

      const res = await submit({
        assignment_id: assignmentId,
        student_id: studentId.trim(),
        file_url: fileUrl,
        file_type: fileType,
        pasted_text: mode === "text" ? pastedText : undefined,
      }).unwrap();

      setResult(res);
    } catch (err) {
      setError(getSubmitError(err));
        console.error(err);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Submit your work</CardTitle>
          <Badge variant="accent">Assignment {assignmentId.slice(0, 8)}…</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
              Student
            </label>
            <div className="mt-1">
              <Select
                value={studentId}
                onChange={(value) => {
                  if (value) setStudentId(value);
                }}
                options={[...DEMO_STUDENTS]}
                placeholder="Select a student…"
                aria-label="Student"
              />
            </div>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              One submission per assignment. Uploading again replaces your previous submission unless it is already approved.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant={mode === "file" ? "accent" : "secondary"} onClick={() => setMode("file")}>
              Upload file
            </Button>
            <Button type="button" variant={mode === "text" ? "accent" : "secondary"} onClick={() => setMode("text")}>
              Paste text
            </Button>
          </div>

          {mode === "file" ? (
            <FileUpload accept=".pdf,.doc,.docx,image/*" onChange={setFile} disabled={isLoading} />
          ) : (
            <Textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your essay or answers here…"
            />
          )}

          {file ? <div className="text-sm text-[var(--ink-muted)]">Selected: {file.name}</div> : null}
          {error ? <div className="text-sm text-red-700">{error}</div> : null}
          {result ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              Submitted! Status: <strong>{result.status}</strong>
            </div>
          ) : null}

          <Button type="submit" variant="accent" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isLoading ? "Processing…" : "Submit assignment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

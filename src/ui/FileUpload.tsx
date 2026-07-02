"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";

export function FileUpload({
  accept,
  onChange,
  disabled,
  label = "Drop a file or click to browse",
}: {
  accept?: string;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center transition",
        theme.radius.lg,
        "hover:border-[var(--accent)] hover:bg-[var(--surface-subtle)]",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)] transition group-hover:scale-105">
        <Upload className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-semibold text-[var(--ink)]">{label}</div>
        <div className="mt-1 text-xs text-[var(--ink-muted)]">PDF, DOC, DOCX, or image</div>
      </div>
      <input
        type="file"
        className="hidden"
        accept={accept}
        disabled={disabled}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}

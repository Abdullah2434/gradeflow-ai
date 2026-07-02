import type { GradeCriterionScore } from "@/types/grade.types";
import { Input } from "@/ui/Input";

export function CriterionScoreEditor({
  scores,
  onChange,
}: {
  scores: GradeCriterionScore[];
  onChange: (next: GradeCriterionScore[]) => void;
}) {
  function update(idx: number, patch: Partial<GradeCriterionScore>) {
    onChange(scores.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  return (
    <div className="space-y-3">
      {scores.map((s, idx) => (
        <div key={s.criterion} className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="font-semibold text-[var(--ink)]">{s.criterion}</div>
            <div className="flex items-center gap-2">
              <Input
                className="w-20"
                inputMode="numeric"
                value={String(s.score)}
                onChange={(e) => update(idx, { score: Number(e.target.value || 0) })}
              />
              <span className="text-sm text-[var(--ink-muted)]">/ {s.max}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{s.justification}</p>
        </div>
      ))}
    </div>
  );
}

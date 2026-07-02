"use client";

import { GripVertical, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import type { RubricCriterion } from "@/types/assignment.types";

export function RubricBuilder({
  value,
  onChange,
}: {
  value: RubricCriterion[];
  onChange: (next: RubricCriterion[]) => void;
}) {
  function updateRow(idx: number, patch: Partial<RubricCriterion>) {
    onChange(value.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  }

  function addRow() {
    onChange([...value, { criterion: "", max_points: 10 }]);
  }

  function removeRow(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= value.length) return;
    const copy = [...value];
    const [row] = copy.splice(idx, 1);
    copy.splice(nextIdx, 0, row);
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-950">Rubric</div>
        <Button variant="secondary" size="sm" onClick={addRow}>
          <Plus className="h-4 w-4" />
          Add criterion
        </Button>
      </div>

      <div className="space-y-2">
        {value.map((row, idx) => (
          <div key={idx} className={cn("flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3")}>
            <GripVertical className="h-4 w-4 text-zinc-400" />

            <div className="flex-1">
              <Input
                value={row.criterion}
                onChange={(e) => updateRow(idx, { criterion: e.target.value })}
                placeholder="Criterion (e.g., Thesis clarity)"
              />
            </div>

            <div className="w-28">
              <Input
                inputMode="numeric"
                value={String(row.max_points)}
                onChange={(e) => updateRow(idx, { max_points: Number(e.target.value || 0) })}
                placeholder="Max"
              />
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => move(idx, -1)} disabled={idx === 0} aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => move(idx, 1)}
                disabled={idx === value.length - 1}
                aria-label="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => removeRow(idx)} aria-label="Remove">
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        ))}

        {value.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            Add at least one criterion to grade against.
          </div>
        ) : null}
      </div>
    </div>
  );
}


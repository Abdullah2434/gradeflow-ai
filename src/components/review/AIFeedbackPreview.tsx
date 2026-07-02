export function AIFeedbackPreview({
  strengths,
  areasToImprove,
  suggestedComment,
  confidence,
}: {
  strengths: string | null;
  areasToImprove: string | null;
  suggestedComment: string | null;
  confidence: string | null;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">AI draft</div>
        {confidence ? (
          <span className="rounded-full bg-[var(--gold-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--gold)]">
            {confidence} confidence
          </span>
        ) : null}
      </div>
      {strengths ? (
        <div>
          <div className="text-xs font-semibold uppercase text-[var(--accent)]">Strengths</div>
          <p className="mt-1 text-sm text-[var(--ink)]">{strengths}</p>
        </div>
      ) : null}
      {areasToImprove ? (
        <div>
          <div className="text-xs font-semibold uppercase text-[var(--gold)]">Areas to improve</div>
          <p className="mt-1 text-sm text-[var(--ink)]">{areasToImprove}</p>
        </div>
      ) : null}
      {suggestedComment ? (
        <div>
          <div className="text-xs font-semibold uppercase text-[var(--ink-muted)]">Suggested comment</div>
          <p className="mt-1 text-sm text-[var(--ink)]">{suggestedComment}</p>
        </div>
      ) : null}
    </div>
  );
}

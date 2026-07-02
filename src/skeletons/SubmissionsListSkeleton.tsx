export function SubmissionsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 w-full skeleton-shimmer rounded-2xl" />
      ))}
    </div>
  );
}

export function ReviewScreenSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-40 skeleton-shimmer rounded-xl" />
      <div className="h-12 w-72 skeleton-shimmer rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 skeleton-shimmer rounded-2xl" />
        <div className="space-y-4">
          <div className="h-48 skeleton-shimmer rounded-2xl" />
          <div className="h-64 skeleton-shimmer rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

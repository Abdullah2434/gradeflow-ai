import { ReviewScreen } from "@/components/review/ReviewScreen";

export default async function Page({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params;
  return <ReviewScreen submissionId={submissionId} />;
}

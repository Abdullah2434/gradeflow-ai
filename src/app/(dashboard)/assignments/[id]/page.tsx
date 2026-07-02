import { AssignmentDetailScreen } from "@/components/assignments/AssignmentDetailScreen";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AssignmentDetailScreen id={id} />;
}


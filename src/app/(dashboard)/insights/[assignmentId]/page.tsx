import { redirect } from "next/navigation";
import { InsightsScreen } from "@/components/insights/InsightsScreen";

const DEMO_ASSIGNMENT_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function Page({ params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params;

  if (assignmentId === "demo") {
    redirect(`/insights/${DEMO_ASSIGNMENT_ID}`);
  }

  if (!UUID_RE.test(assignmentId)) {
    redirect("/insights");
  }

  return <InsightsScreen assignmentId={assignmentId} />;
}

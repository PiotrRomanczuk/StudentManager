import { EditAssignmentForm } from "./EditAssignmentForm";

export default async function EditAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return <EditAssignmentForm assignmentId={resolvedParams.id} />;
} 
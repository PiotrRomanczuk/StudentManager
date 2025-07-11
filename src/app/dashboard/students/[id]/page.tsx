import { createClient } from "@/utils/supabase/clients/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ErrorComponent } from "../../../../components/common/ErrorComponent";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return (
      <ErrorComponent
        error={"Error loading student: " + (error.message || error)}
      />
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Student not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          <CardDescription>All information for this student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identity */}
            <div>
              <strong>ID:</strong> {user.id}
            </div>
            <div>
              <strong>User UUID:</strong> {user.user_id}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Username:</strong> {user.username}
            </div>
            <div>
              <strong>Full Name:</strong> {user.full_name}
            </div>
            {/* Personal Info */}
            <div>
              <strong>First Name:</strong> {user.firstName}
            </div>
            <div>
              <strong>Last Name:</strong> {user.lastName}
            </div>
            <div>
              <strong>Bio:</strong> {user.bio}
            </div>
            {/* Roles/Permissions */}
            <div>
              <strong>isStudent:</strong> {user.isStudent ? "Yes" : "No"}
            </div>
            <div>
              <strong>isTeacher:</strong> {user.isTeacher ? "Yes" : "No"}
            </div>
            <div>
              <strong>isAdmin:</strong> {user.isAdmin ? "Yes" : "No"}
            </div>
            <div>
              <strong>canEdit:</strong> {user.canEdit ? "Yes" : "No"}
            </div>
            <div>
              <strong>isTest:</strong> {user.isTest ? "Yes" : "No"}
            </div>
            {/* Timestamps */}
            <div>
              <strong>Created At:</strong>{" "}
              {user.created_at
                ? new Date(user.created_at).toLocaleString()
                : "-"}
            </div>
            <div>
              <strong>Updated At:</strong>{" "}
              {user.updated_at
                ? new Date(user.updated_at).toLocaleString()
                : "-"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

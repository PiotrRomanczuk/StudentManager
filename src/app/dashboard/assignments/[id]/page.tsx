import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, FileText } from "lucide-react";
import { fetchAssignmentData } from "../api/fetchAssignments";
import { cookies } from "next/headers";
import { ErrorComponent } from "@/components/dashboard/ErrorComponent";

type Params = { id: string };

export default async function AssignmentPage({ params }: { params: Promise<Params> }) {
  try {
    const { id } = await params;
    const cookieHeader = (await cookies()).toString();
    
    const assignment = await fetchAssignmentData(id, cookieHeader);

    if (!assignment) {
      return (
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Assignment Not Found</h1>
            <p className="text-gray-600 mb-6">The assignment you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/dashboard/assignments">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assignments
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard/assignments"
            className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to assignments
          </Link>

          <div className="grid gap-6">
            {/* Assignment Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold">{assignment.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant={isOverdue ? "destructive" : "secondary"}>
                        {isOverdue ? "Overdue" : "Active"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ID: {assignment.id}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/dashboard/assignments/${assignment.id}/edit`}>
                      Edit Assignment
                    </Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Assignment Details */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {assignment.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Due Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignment.due_date ? (
                    <div>
                      <p className="text-lg font-medium">
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(assignment.due_date).toLocaleTimeString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No due date set</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* People Involved */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Teacher
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignment.teacher_profile ? (
                    <div>
                      <p className="font-medium">
                        {assignment.teacher_profile.firstName} {assignment.teacher_profile.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.teacher_profile.email}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Teacher ID: {assignment.teacher_id}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignment.student_profile ? (
                    <div>
                      <p className="font-medium">
                        {assignment.student_profile.firstName} {assignment.student_profile.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.student_profile.email}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Student ID: {assignment.student_id}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Created/Updated Info */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">
                      {new Date(assignment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm">
                      {new Date(assignment.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error: unknown) {
    console.error("Error loading assignment:", error);
    return (
      <ErrorComponent
        error={error instanceof Error ? error.message : "An error occurred"}
      />
    );
  }
} 
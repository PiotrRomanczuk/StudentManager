"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/clients/client";
import { User } from "@/types/User";
import { toast } from "sonner";

interface Assignment {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  teacher_id: number;
  student_id: number;
  teacher_profile?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  student_profile?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface EditAssignmentFormProps {
  assignmentId: string;
}

export function EditAssignmentForm({ assignmentId }: EditAssignmentFormProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const router = useRouter();

  // Fetch assignment data and users on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch assignment
        const assignmentRes = await fetch(`/api/assignments/${assignmentId}`);
        if (assignmentRes.ok) {
          const assignmentData = await assignmentRes.json();
          setAssignment(assignmentData);
          setTitle(assignmentData.title);
          setDescription(assignmentData.description || "");
          setDueDate(assignmentData.due_date ? assignmentData.due_date.slice(0, 16) : "");
          setTeacherId(assignmentData.teacher_id.toString());
          setStudentId(assignmentData.student_id.toString());
        }

        // Fetch teachers and students
        const supabase = createClient();
        
        const { data: teachersData } = await supabase
          .from("profiles")
          .select("*")
          .eq("isTeacher", true);
        
        const { data: studentsData } = await supabase
          .from("profiles")
          .select("*")
          .eq("isStudent", true);

        if (teachersData) setTeachers(teachersData);
        if (studentsData) setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load assignment data");
      } finally {
        setFetching(false);
      }
    }
    
    fetchData();
  }, [assignmentId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/assignments/${assignmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          due_date: dueDate,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to update assignment");
      }
      
      toast.success("Assignment updated successfully!");
      router.push(`/dashboard/assignments/${assignmentId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Assignment Not Found</h1>
            <p className="text-gray-600 mb-6">The assignment you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/dashboard/assignments">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assignments
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/dashboard/assignments/${assignmentId}`}
          className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to assignment
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Edit Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter assignment description"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    type="datetime-local"
                    id="due_date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="teacher_id">Teacher</Label>
                  <Select value={teacherId} onValueChange={setTeacherId} disabled>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers?.map((teacher: User) => (
                        <SelectItem
                          key={teacher.user_id}
                          value={teacher.user_id}
                        >
                          {`${teacher.firstName} ${teacher.lastName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Teacher cannot be changed after assignment creation
                  </p>
                </div>

                <div>
                  <Label htmlFor="student_id">Student</Label>
                  <Select value={studentId} onValueChange={setStudentId} disabled>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student: User) => (
                        <SelectItem
                          key={student.user_id}
                          value={student.user_id}
                        >
                          {student.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Student cannot be changed after assignment creation
                  </p>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Updating..." : "Update Assignment"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/assignments/${assignmentId}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
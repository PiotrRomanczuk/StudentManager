"use client";

import { useState } from "react";
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

export default function AddAssignmentPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const router = useRouter();

  // Fetch teachers and students on component mount
  useState(() => {
    async function fetchUsers() {
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
    }
    
    fetchUsers();
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          due_date: dueDate,
          teacher_id: Number(teacherId),
          student_id: Number(studentId),
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to add assignment");
      }
      
      toast.success("Assignment created successfully!");
      router.push("/dashboard/assignments");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard/assignments"
          className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to assignments
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create New Assignment
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
                  <Select value={teacherId} onValueChange={setTeacherId} required>
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
                </div>

                <div>
                  <Label htmlFor="student_id">Student</Label>
                  <Select value={studentId} onValueChange={setStudentId} required>
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
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Assignment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";

// Minimal Task type
interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  teacher_id: number;
  student_id: number;
}

export default function AssignementsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/assignements/");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        console.log(data);
        setTasks(data.tasks || []);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <Link
        href="/dashboard/assignements/add"
        className="mb-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Task
      </Link>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Teacher ID</TableHead>
            <TableHead>Student ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description || "-"}</TableCell>
              <TableCell>
                {task.due_date ? new Date(task.due_date).toLocaleString() : "-"}
              </TableCell>
              <TableCell>{task.teacher_id}</TableCell>
              <TableCell>{task.student_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

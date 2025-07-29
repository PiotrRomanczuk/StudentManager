import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LessonsHeaderProps {
  isAdmin: boolean;
}

export function LessonsHeader({ isAdmin }: LessonsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
          <p className="mt-2 text-sm text-gray-600">Manage and view all lessons</p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/lessons/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Lesson
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
} 
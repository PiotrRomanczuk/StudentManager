"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { LessonSong } from "./FetchLessonsSong";

interface UsersWithSongListProps {
  lessons: LessonSong[];
}

const statusColorMap: Record<string, string> = {
  to_learn: "bg-yellow-100 text-yellow-800",
  started: "bg-blue-100 text-blue-800",
  remembered: "bg-green-100 text-green-800",
  with_author: "bg-purple-100 text-purple-800",
  mastered: "bg-gray-200 text-gray-800",
};

export default function UsersWithSongList({ lessons }: UsersWithSongListProps) {
  if (!lessons || lessons.length === 0) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="flex items-center text-purple-700">
            <User className="mr-2" size={20} />
            Students with this Song
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            No students have been assigned this song yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center text-purple-700">
          <User className="mr-2" size={20} />
          Students with this Song
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={`${lesson.lesson_id}-${lesson.student_id}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {lesson.student_email || "Unknown Student"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Assigned on {new Date(lesson.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`${statusColorMap[lesson.song_status] || "bg-gray-100 text-gray-800"}`}
              >
                {lesson.song_status.replace(/_/g, " ")}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
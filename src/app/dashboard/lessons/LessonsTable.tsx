"use client";

import { Clock, User } from "lucide-react";
import Link from "next/link";
import type { Lesson } from "@/types/Lesson";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationComponent } from "../songs/@components/PaginationComponent";

interface LessonsTableProps {
  lessons: Lesson[];
  //   getUserEmail: (id: string) => string
}

export function LessonsTable({ lessons }: LessonsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(lessons.length / itemsPerPage);

  const paginatedLessons = lessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // write a dunction that gets an email adress and leave only the first part before @
  function getEmail(email: string) {
    return email.split("@")[0];
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lesson
                  </TableHead>
                  <TableHead className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </TableHead>
                  <TableHead className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </TableHead>
                  <TableHead className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </TableHead>
                  <TableHead className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </TableHead>
                  <TableHead className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLessons.map((lesson: Lesson) => (
                  <TableRow
                    key={lesson.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-3 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm sm:text-base">
                            L{lesson.lesson_number || "?"}
                          </span>
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lesson.lesson_number
                              ? `Lesson ${lesson.lesson_number}`
                              : "Lesson"}
                          </div>
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            {lesson.date
                              ? formatDate(lesson.date.toString())
                              : formatDate(lesson.created_at)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell px-3 sm:px-6 py-4">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {lesson.date
                          ? formatDate(lesson.date.toString())
                          : formatDate(lesson.created_at)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell px-3 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {getEmail(lesson.profile?.email || "")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell px-3 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {getEmail("p.romanczuk@gmail.com")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell px-3 sm:px-6 py-4">
                      {lesson.time ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {lesson.time.toString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell px-3 sm:px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(lesson.updated_at)}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 sm:px-6 py-4 text-right">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                      >
                        <Link href={`/dashboard/lessons/${lesson.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

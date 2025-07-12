'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LessonStatusEnum } from "@/schemas";

interface LessonFiltersProps {
  currentSort: string;
  currentFilter: string | null;
}

export function LessonFilters({ currentSort, currentFilter }: LessonFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', value);
    }
    router.push(`?${params.toString()}`);
  };

  // Get lesson status options from the schema
  const lessonStatusOptions = LessonStatusEnum.options;

  return (
    <div className="flex items-center gap-4 w-full sm:w-auto">
      <Select defaultValue={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Date Created</SelectItem>
          <SelectItem value="date">Lesson Date</SelectItem>
          <SelectItem value="lesson_number">Lesson Number</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={currentFilter || "all"} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {lessonStatusOptions.map((status) => (
            <SelectItem key={status} value={status.toLowerCase()}>
              {status.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 
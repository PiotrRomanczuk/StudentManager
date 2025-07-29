interface LessonsPaginationInfoProps {
  currentCount: number;
  totalCount: number;
}

export function LessonsPaginationInfo({ 
  currentCount, 
  totalCount 
}: LessonsPaginationInfoProps) {
  if (totalCount === 0) return null;

  return (
    <div className="mt-6 text-center text-sm text-gray-600">
      Showing {currentCount} of {totalCount} lessons
    </div>
  );
} 
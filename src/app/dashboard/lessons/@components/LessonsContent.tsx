import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LessonsTable } from '../LessonsTable';
import { LessonsTableMobile } from '../LessonsTableMobile';
import NoLessons from '../NoLessons';
import type { Lesson } from '@/types/Lesson';

interface LessonsContentProps {
	lessons: Lesson[];
	isAdmin: boolean;
}
export function LessonsContent({ lessons, isAdmin }: LessonsContentProps) {
	// Compute filtered lessons by season
	let filteredLessons = lessons;
	if (typeof window !== 'undefined' && window.location) {
		const params = new URLSearchParams(window.location.search);
		const season = params.get('season');
		if (season && season !== 'all') {
			const [startYear, endYear] = season.split('/').map(Number);
			const start = new Date(startYear, 8, 1); // September 1
			const end = new Date(endYear, 7, 31, 23, 59, 59, 999); // August 31
			filteredLessons = lessons.filter((lesson) => {
				const date = new Date(lesson.date);
				return date >= start && date <= end;
			});
		}
	}
	return (
		<Suspense fallback={<Skeleton className='h-96 w-full' />}>
			{filteredLessons.length === 0 ? (
				<NoLessons isAdmin={isAdmin} />
			) : (
				<>
					<div className='hidden lg:block'>
						<LessonsTable lessons={filteredLessons} />
					</div>
					<div className='lg:hidden'>
						<LessonsTableMobile lessons={filteredLessons} />
					</div>
				</>
			)}
		</Suspense>
	);
}

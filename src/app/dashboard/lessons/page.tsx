import { cookies } from 'next/headers';
import { getAllLessons } from './lesson-api-helpers';
import { createClient } from '@/utils/supabase/clients/server';
import { LessonsHeader } from './@components/LessonsHeader';
import { LessonsFiltersCard } from './@components/LessonsFiltersCard';
import { LessonsContent } from './@components/LessonsContent';
import { LessonsPaginationInfo } from './@components/LessonsPaginationInfo';
import { transformLessonsData } from './@components/LessonsDataTransformer';
import { checkAdminStatus } from './@components/AdminChecker';

export default async function LessonsPage({
	searchParams,
}: {
	searchParams: Promise<{
		sort?: string;
		filter?: string;
		studentId?: string;
		season?: string;
	}>;
}) {
	const { sort = 'created_at', filter, studentId, season } = await searchParams;
	const cookieHeader = (await cookies()).toString();

	// Get user and lessons data
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Check admin status
	const isAdmin = await checkAdminStatus(user?.id);

	// Get lessons data
	const lessonsData = await getAllLessons({
		userId: user?.id,
		sort: sort as 'date' | 'lesson_number' | 'created_at',
		filter: filter as LessonStatus | undefined,
		studentId: studentId,
		cookieHeader,
	});

	const { lessons = [], pagination } = lessonsData;
	// Helper to compute available seasons from lessons
	function getSeasons(lessonsArr: { date?: string | Date }[]): string[] {
		if (!lessonsArr || lessonsArr.length === 0) return [];
		const years = lessonsArr
			.map((l) => {
				if (!l.date) return undefined;
				const d = new Date(l.date);
				return d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
			})
			.filter((y): y is number => typeof y === 'number' && !isNaN(y));
		const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
		return uniqueYears.map((y) => `${y}/${y + 1}`);
	}
	// Compute seasons after lessons are fetched
	const seasons = getSeasons(lessons);
	// Transform lessons data
	const transformedLessons = transformLessonsData(lessons);

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
			<LessonsHeader isAdmin={isAdmin} />

			<LessonsFiltersCard
				currentSort={sort}
				currentFilter={filter || null}
				isAdmin={isAdmin}
				seasons={seasons}
				currentSeason={season || ''}
			/>

<<<<<<< HEAD
			<LessonsContent lessons={transformedLessons} isAdmin={isAdmin} />
=======
			<LessonsContent
				lessons={transformedLessons}
				isAdmin={isAdmin}
			/>
>>>>>>> 85d92d8bda768ff9e1ebf90e6ab781f42971ca9e

			<LessonsPaginationInfo
				currentCount={transformedLessons.length}
				totalCount={pagination?.total || 0}
			/>
		</div>
	);
}

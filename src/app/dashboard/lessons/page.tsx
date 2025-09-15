import { cookies } from 'next/headers';
import { getAllLessons } from './lesson-api-helpers';
import { createClient } from '@/utils/supabase/clients/server';
import { LessonsHeader } from './@components/LessonsHeader';
import { LessonsFiltersCard } from './@components/LessonsFiltersCard';
import { LessonsContent } from './@components/LessonsContent';
import { transformLessonsData } from './@components/LessonsDataTransformer';
import { checkAdminStatus } from './@components/AdminChecker';
import { LessonStatus } from '@/schemas';

export default async function LessonsPage({
	searchParams,
}: {
	searchParams: Promise<{ sort?: string; filter?: string; studentId?: string }>;
}) {
	const { sort = 'created_at', filter, studentId } = await searchParams;
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

	const { lessons = [] } = lessonsData;

	// // Log lessons data on server side
	// console.log('Lessons data fetched:', {
	//   lessons,
	//   pagination,
	//   totalLessons: lessons.length,
	//   userId: user?.id,
	//   sort,
	//   filter,
	//   studentId
	// });

	// Transform lessons data
	const transformedLessons = transformLessonsData(lessons);

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-5xl mx-auto w-full'>
				<LessonsHeader isAdmin={isAdmin} />
				<LessonsFiltersCard
					currentSort={sort}
					currentFilter={filter || null}
					isAdmin={isAdmin}
				/>
				<LessonsContent lessons={transformedLessons} isAdmin={isAdmin} />
				{/* <LessonsPaginationInfo
					currentCount={transformedLessons.length}
					totalCount={pagination?.total || 0}
				/> */}
			</div>
		</div>
	);
}

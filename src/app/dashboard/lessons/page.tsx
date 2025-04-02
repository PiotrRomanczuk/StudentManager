import type { Lesson } from '@/types/Lesson';
import { createClient } from '@/utils/supabase/clients/server';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { LessonsTable } from './LessonsTable';
import type { User } from '@/types/User';
import { fetchUserAndAdmin } from '../@components/fetchUserAndAdmin';
import SearchBar from '@/components/Search-bar';
import NoLesson from './[slug]/@components/NoLesson';

type Params = {
	user_id: string;
};

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<Params>;
}) {
	const { user_id } = await searchParams;

	console.time(user_id);
	const supabase = await createClient();
	const { user, userIsAdmin } = await fetchUserAndAdmin(supabase);

	console.log('User is admin:', user, userIsAdmin);

	let lessons;
	let lessonsError;

	if (user_id) {
		const response = await supabase
			.from('lessons')
			.select('*')
			.order('created_at', { ascending: false })
			.eq('student_id', user_id)
			.or(`student_id.eq.${user_id},teacher_id.eq.${user_id}`);
		lessons = response.data;
		lessonsError = response.error;
	} else {
		const response = await supabase
			.from('lessons')
			.select('*')
			.order('created_at', { ascending: false });
		lessons = response.data;
		lessonsError = response.error;
	}

	// get profiles for each lesson
	const { data: profiles, error: profilesError } = await supabase
		.from('profiles')
		.select('*');
	// .in('user_id', lessons?.map((lesson: Lesson) => lesson.student_id) || []);

	// console.log('Profiles:', profiles);

	if (lessonsError || profilesError) {
		return <>There is a lesson or profile problem</>;
	}

	// map profiles to lessonst
	const lessonsWithProfiles = lessons?.map((lesson: Lesson) => {
		const profile = profiles?.find(
			(profile: User) => profile.user_id === lesson.student_id
		);
		return { ...lesson, profile };
	});

	// Pre-fetch all user data to avoid multiple calls
	const userIds = new Set<string>();
	lessons?.forEach((lesson: Lesson) => {
		userIds.add(lesson.student_id);
		userIds.add(lesson.teacher_id);
	});

	// console.log(userIsAdmin);
	return (
		<div className='container mx-auto py-6'>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>Lessons</h1>
				{userIsAdmin == true && (
					<>
					Hello
						<SearchBar profiles={profiles} />
						<Button asChild>
							<Link href='/dashboard/lessons/create'>
								<Plus className='mr-2 h-4 w-4' />
							Create Lesson
						</Link>
					</Button>
					</>
				)}
			</div>
			{!lessons || lessons.length === 0 ? (
				<NoLesson />
			) : (
				<>
					{userIsAdmin && <SearchBar profiles={profiles} />}
					<LessonsTable lessons={lessonsWithProfiles} />
				</>
			)}
		</div>
	);
}

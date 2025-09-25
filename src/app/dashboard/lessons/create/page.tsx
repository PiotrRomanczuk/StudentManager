import { createClient } from '@/utils/supabase/clients/server';
import { createLesson } from './actions';
import { User } from '@/types/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { LessonStatusEnum } from '@/schemas';

function getCurrentDateTime() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');

	return {
		date: `${year}-${month}-${day}`,
		start_time: `${hours}:${minutes}`,
	};
}

export default async function Page() {
	const supabase = await createClient();
	const { date, start_time } = getCurrentDateTime();

	const { data: students, error: studentsError } = await supabase
		.from('profiles')
		.select('*')
		.eq('isStudent', true);

	// Sort students by email
	const sortedStudents = students?.sort((a: User, b: User) =>
		(a.email || '').localeCompare(b.email || '')
	);

	const { data: teachers, error: teachersError } = await supabase
		.from('profiles')
		.select('*')
		.eq('isTeacher', true);

	if (studentsError || teachersError) {
		throw new Error(
			'Error fetching students or teachers:' + studentsError + teachersError
		);
	}

	// Get lesson status options from the schema
	const lessonStatusOptions = LessonStatusEnum.options;

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-2xl mx-auto'>
				<Link
					href='/dashboard/lessons'
					className='flex items-center text-sm text-muted-foreground mb-6 hover:text-primary'
				>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to lessons
				</Link>

				<Card>
					<CardHeader>
						<CardTitle className='text-2xl font-bold'>
							Create New Lesson
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form className='space-y-6' action={createLesson}>
							<div className='space-y-4'>
								<div>
									<Label htmlFor='teacher_id'>Teacher *</Label>
									<Select
										name='teacher_id'
										required
										defaultValue={teachers?.[0]?.user_id}
									>
										<SelectTrigger className='mt-1'>
											<SelectValue placeholder='Select a teacher' />
										</SelectTrigger>
										<SelectContent>
											{teachers?.map((teacher: User) => (
												<SelectItem
													key={teacher.user_id}
													value={teacher.user_id}
												>
													{`${teacher.firstName} ${teacher.lastName}`}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor='student_id'>Student *</Label>
									<Select name='student_id' required>
										<SelectTrigger className='mt-1'>
											<SelectValue placeholder='Select a student' />
										</SelectTrigger>
										<SelectContent>
											{sortedStudents?.map((student: User) => (
												<SelectItem
													key={student.user_id}
													value={student.user_id}
												>
													{student.email}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label htmlFor='date'>Date *</Label>
										<Input
											type='date'
											id='date'
											name='date'
											defaultValue={date}
											required
											className='mt-1'
										/>
									</div>

									<div>
										<Label htmlFor='start_time'>Time *</Label>
										<Input
											type='time'
											id='start_time'
											name='start_time'
											defaultValue={start_time}
											required
											className='mt-1'
										/>
									</div>
								</div>

								<div>
									<Label htmlFor='status'>Status</Label>
									<Select name='status' defaultValue='SCHEDULED'>
										<SelectTrigger className='mt-1'>
											<SelectValue placeholder='Select status' />
										</SelectTrigger>
										<SelectContent>
											{lessonStatusOptions.map((status) => (
												<SelectItem key={status} value={status}>
													{status.replace(/_/g, ' ')}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor='title'>Title</Label>
									<Input
										type='text'
										id='title'
										name='title'
										placeholder='Enter lesson title (optional)'
										className='mt-1'
									/>
								</div>

								<div>
									<Label htmlFor='notes'>Notes</Label>
									<Textarea
										id='notes'
										name='notes'
										placeholder='Enter any additional notes for this lesson'
										className='mt-1'
									/>
								</div>
							</div>

							<div className='pt-4'>
								<Button type='submit' className='w-full'>
									Create Lesson
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

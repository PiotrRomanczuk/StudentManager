'use client';

import { Clock, User, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import type { Lesson } from '@/types/Lesson';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LessonStatusEnum } from '@/schemas';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { PaginationComponent } from '@/app/dashboard/@components/pagination/PaginationComponent';

interface LessonsTableProps {
	lessons: Lesson[];
	//   getUserEmail: (id: string) => string
}

export function LessonsTable({ lessons }: LessonsTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const router = useRouter();
	const searchParams = useSearchParams();
	const itemsPerPage = 18;
	const totalPages = Math.ceil(lessons.length / itemsPerPage);

	const paginatedLessons = lessons.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Debug: log lesson times
	if (typeof window !== 'undefined') {
		paginatedLessons.forEach((lesson) => {
			console.log('Lesson ID:', lesson.id, 'Time:', lesson.time);
		});
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	// write a dunction that gets an email adress and leave only the first part before @
	function getEmail(email: string) {
		return email.split('@')[0];
	}

	// Get lesson status options from the schema
	const lessonStatusOptions = LessonStatusEnum.options;

	function getStatusColor(status: string) {
		switch (status?.toLowerCase()) {
			case 'scheduled':
				return 'bg-blue-100 text-blue-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function handleSort(column: string) {
		const currentSort = searchParams.get('sort') || 'created_at';
		const newSort = currentSort === column ? `${column}_desc` : column;
		const params = new URLSearchParams(searchParams.toString());
		params.set('sort', newSort);
		router.push(`?${params.toString()}`);
	}

	return (
		<div className='space-y-4 w-full'>
			<div className='bg-white rounded-lg shadow-md p-2 sm:p-4 md:p-6 w-full'>
				<div className='overflow-x-auto w-full'>
					<div className='inline-block min-w-full align-middle'>
						<Table className='w-full min-w-[700px]'>
							<TableHeader>
								<TableRow className='bg-gray-50 hover:bg-gray-50'>
									<TableHead className='px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										<button
											onClick={() => handleSort('lesson_number')}
											className='flex items-center gap-1 hover:text-gray-700'
										>
											Lesson
											<ArrowUpDown className='h-4 w-4' />
										</button>
									</TableHead>
									<TableHead className='hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										<button
											onClick={() => handleSort('date')}
											className='flex items-center gap-1 hover:text-gray-700'
										>
											Date
											<ArrowUpDown className='h-4 w-4' />
										</button>
									</TableHead>
									<TableHead className='hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Student
									</TableHead>
									<TableHead className='hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Teacher
									</TableHead>
									<TableHead className='hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Time
									</TableHead>
									<TableHead className='hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Status
									</TableHead>
									<TableHead className='px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedLessons.map((lesson: Lesson) => {
									// Validate lesson status against schema
									const isValidStatus = lesson.status
										? lessonStatusOptions.includes(
												lesson.status as
													| 'SCHEDULED'
													| 'IN_PROGRESS'
													| 'COMPLETED'
													| 'CANCELLED'
													| 'RESCHEDULED'
										  )
										: false;

									const displayStatus = lesson.status
										? isValidStatus
											? lesson.status.replace(/_/g, ' ')
											: 'Unknown'
										: 'Unknown';

									return (
										<TableRow
											key={lesson.id}
											className='hover:bg-gray-50 transition-colors'
										>
											<TableCell className='px-3 sm:px-6 py-4'>
												<div className='flex items-center'>
													<div className='h-8 sm:h-10 w-8 sm:w-10 rounded-full bg-lesson-blue-bg flex items-center justify-center'>
														<span className='text-lesson-blue-text font-medium text-sm sm:text-base'>
															L{lesson.lesson_number || '?'}
														</span>
													</div>
													<div className='ml-3 sm:ml-4'>
														<div className='text-sm font-medium text-gray-900'>
															{lesson.lesson_number
																? `Lesson ${lesson.lesson_number}`
																: 'Lesson'}
														</div>
														<div className='sm:hidden text-xs text-gray-500 mt-1'>
															{lesson.date
																? formatDate(lesson.date.toString())
																: formatDate(lesson.created_at)}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4'>
												<Badge
													variant='outline'
													className='bg-lesson-blue-bg text-lesson-blue-text border-lesson-blue-border'
												>
													{lesson.date
														? formatDate(lesson.date.toString())
														: formatDate(lesson.created_at)}
												</Badge>
											</TableCell>
											<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4'>
												<div className='flex items-center gap-2'>
													<div className='h-8 w-8 rounded-full bg-lesson-purple-bg flex items-center justify-center'>
														<User className='h-4 w-4 text-lesson-purple-text' />
													</div>
													<span className='text-sm font-medium text-gray-900'>
														{getEmail(lesson.profile?.email || '')}
													</span>
												</div>
											</TableCell>
											<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4'>
												<div className='flex items-center gap-2'>
													<div className='h-8 w-8 rounded-full bg-lesson-green-bg flex items-center justify-center'>
														<User className='h-4 w-4 text-lesson-green-text' />
													</div>
													<span className='text-sm font-medium text-gray-900'>
														{getEmail(lesson.teacher_profile?.email || '')}
													</span>
												</div>
											</TableCell>
											<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4'>
												{typeof lesson.time === 'string' &&
												lesson.time.trim() !== '' ? (
													<div className='flex items-center gap-2'>
														<div className='h-8 w-8 rounded-full bg-lesson-orange-bg flex items-center justify-center'>
															<Clock className='h-4 w-4 text-lesson-orange-text' />
														</div>
														<span className='text-sm font-medium text-gray-900'>
															{lesson.time}
														</span>
													</div>
												) : (
													<span className='text-muted-foreground'>N/A</span>
												)}
											</TableCell>
											<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4'>
												<Badge
													variant='outline'
													className={`${getStatusColor(
														lesson.status || 'scheduled'
													)} border-transparent`}
												>
													{displayStatus}
												</Badge>
											</TableCell>
											<TableCell className='px-3 sm:px-6 py-4 text-right'>
												<Button
													asChild
													size='sm'
													variant='outline'
													className='bg-lesson-blue-bg hover:bg-lesson-blue-bg/80 text-lesson-blue-text border-lesson-blue-border'
												>
													<Link href={`/dashboard/lessons/${lesson.id}`}>
														View Details
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
			{totalPages > 1 && (
				<div className='flex justify-center'>
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

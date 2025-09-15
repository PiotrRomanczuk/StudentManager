'use client';

import { Clock, User, ArrowUpDown, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Lesson } from '@/types/Lesson';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LessonStatusEnum } from '@/schemas';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DataTable,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/data-table';
import { PaginationComponent } from '@/app/dashboard/@components/pagination/PaginationComponent';

interface LessonsTableProps {
	lessons: Lesson[];
}

export function LessonsTable({ lessons }: LessonsTableProps) {
	// Helper to get season string (e.g., 2024/2025)
	function getSeason(dateString: string) {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth(); // 0-indexed: 0=Jan, 8=Sep
		if (month >= 8) {
			// September or later: season is year/year+1
			return `${year}/${year + 1}`;
		} else {
			// Before September: season is (year-1)/year
			return `${year - 1}/${year}`;
		}
	}
	const [currentPage, setCurrentPage] = useState(1);
	const router = useRouter();
	const searchParams = useSearchParams();
	const itemsPerPage = 18;
	const totalPages = Math.ceil(lessons.length / itemsPerPage);

	// Get selected season from query params
	const selectedSeason = searchParams.get('season');

	// Filter lessons by season if selected
	const filteredLessons =
		selectedSeason && selectedSeason !== 'all'
			? lessons.filter((lesson) => {
					const dateStr = lesson.date
						? lesson.date.toString()
						: lesson.created_at;
					return getSeason(dateStr) === selectedSeason;
			  })
			: lessons;

	// Sort lessons by date (oldest to newest), then reverse for newest to oldest
	const sortedLessons = [...filteredLessons]
		.sort((a, b) => {
			const dateA = new Date(a.date || a.created_at).getTime();
			const dateB = new Date(b.date || b.created_at).getTime();
			return dateA - dateB;
		})
		.reverse();

	// Add frontend index so newest gets the biggest number
	const lessonsWithIndex = sortedLessons.map((lesson, idx) => ({
		...lesson,
		frontendIndex: sortedLessons.length - idx,
	}));

	// Paginate the sorted lessons
	const paginatedLessons = lessonsWithIndex.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	function getEmail(email: string) {
		return email.split('@')[0];
	}

	const lessonStatusOptions = LessonStatusEnum.options;

	function getStatusColor(status: string) {
		switch (status?.toLowerCase()) {
			case 'scheduled':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'completed':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'cancelled':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'in_progress':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
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
			<DataTable>
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
							Season
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
					{paginatedLessons.map((lesson) => {
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
								<TableCell className='px-3 sm:px-6 py-4 truncate break-words'>
									<div className='flex items-center'>
										<div className='h-8 sm:h-10 w-8 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center'>
											<BookOpen className='h-4 w-4 text-blue-600' />
										</div>
										<div className='ml-3 sm:ml-4'>
											<div className='text-sm font-medium text-gray-900'>
												{`Lesson ${lesson.frontendIndex}`}
											</div>
											<div className='sm:hidden text-xs text-gray-500 mt-1'>
												{lesson.date
													? formatDate(lesson.date.toString())
													: formatDate(lesson.created_at)}
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4 truncate break-words'>
									<div className='flex items-center gap-2'>
										<div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center'>
											<Calendar className='h-4 w-4 text-green-600' />
										</div>
										<Badge
											variant='outline'
											className='bg-green-100 text-green-800 border-green-200'
										>
											{lesson.date
												? formatDate(lesson.date.toString())
												: formatDate(lesson.created_at)}
										</Badge>
									</div>
								</TableCell>
								<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4 truncate break-words'>
									<Badge
										variant='outline'
										className='bg-gray-100 text-gray-800 border-gray-200'
									>
										{lesson.date
											? getSeason(lesson.date.toString())
											: getSeason(lesson.created_at)}
									</Badge>
								</TableCell>
								<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4 truncate break-words'>
									<div className='flex items-center gap-2'>
										<div className='h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center'>
											<User className='h-4 w-4 text-purple-600' />
										</div>
										<span className='text-sm font-medium text-gray-900'>
											{getEmail(lesson.profile?.email || '')}
										</span>
									</div>
								</TableCell>
								<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4 truncate break-words'>
									<div className='flex items-center gap-2'>
										<div className='h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center'>
											<User className='h-4 w-4 text-orange-600' />
										</div>
										<span className='text-sm font-medium text-gray-900'>
											{getEmail(lesson.teacher_profile?.email || '')}
										</span>
									</div>
								</TableCell>
								<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4 truncate break-words'>
									{lesson.time ? (
										<div className='flex items-center gap-2'>
											<div className='h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center'>
												<Clock className='h-4 w-4 text-yellow-600' />
											</div>
											<span className='text-sm font-medium text-gray-900'>
												{lesson.time}
											</span>
										</div>
									) : (
										<span className='text-muted-foreground'>—</span>
									)}
								</TableCell>
								<TableCell className='hidden sm:table-cell px-3 sm:px-6 py-4 truncate break-words'>
									<Badge
										variant='outline'
										className={`${getStatusColor(
											lesson.status || 'scheduled'
										)} border-transparent`}
									>
										{displayStatus}
									</Badge>
								</TableCell>
								<TableCell className='px-3 sm:px-6 py-4 text-right truncate break-words'>
									<Button
										asChild
										size='sm'
										variant='outline'
										className='bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300'
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
			</DataTable>
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

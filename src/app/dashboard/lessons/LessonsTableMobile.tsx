'use client';

import { Clock, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { Lesson } from '@/types/Lesson';
import type { User as UserType } from '@/types/User';
import { useState } from 'react';
import { LessonStatusEnum } from '@/schemas';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataCard } from '@/components/ui/data-card';
import { PaginationComponent } from '@/app/dashboard/@components/pagination/PaginationComponent';
import { Skeleton } from '@/components/ui/skeleton';

interface LessonWithProfiles extends Lesson {
	profile?: UserType;
	teacher_profile?: UserType;
}

interface LessonsTableMobileProps {
	lessons: LessonWithProfiles[];
	isLoading?: boolean;
}

export function LessonsTableMobile({
	lessons,
	isLoading = false,
}: LessonsTableMobileProps) {
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
	const itemsPerPage = 6;
	const totalPages = Math.ceil(lessons.length / itemsPerPage);

	// Sort lessons by date (oldest to newest)
	const sortedLessons = [...lessons].sort((a, b) => {
		const dateA = new Date(a.date || a.created_at).getTime();
		const dateB = new Date(b.date || b.created_at).getTime();
		return dateB - dateA; // Change to descending order
	});

	// Add frontend index to each lesson (1-based)
	const lessonsWithIndex = sortedLessons.map((lesson, idx) => ({
		...lesson,
		frontendIndex: idx + 1, // This remains the same
	}));

	// Paginate the sorted lessons
	const paginatedLessons = lessonsWithIndex.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function formatDate(dateString: string) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	function getEmail(email: string) {
		if (!email) return 'N/A';
		return email.split('@')[0];
	}

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

	const lessonStatusOptions = LessonStatusEnum.options;

	if (isLoading) {
		return (
			<div className='space-y-4'>
				{[...Array(3)].map((_, i) => (
					<DataCard key={i}>
						<div className='flex items-center justify-between mb-3'>
							<div className='flex items-center gap-3'>
								<Skeleton className='h-10 w-10 rounded-full' />
								<div>
									<Skeleton className='h-4 w-24 mb-2' />
									<Skeleton className='h-4 w-32' />
								</div>
							</div>
							<Skeleton className='h-8 w-24' />
						</div>
						<div className='grid grid-cols-2 gap-3'>
							{[...Array(4)].map((_, j) => (
								<div key={j} className='flex items-center gap-2'>
									<Skeleton className='h-8 w-8 rounded-full' />
									<Skeleton className='h-4 w-24' />
								</div>
							))}
						</div>
					</DataCard>
				))}
			</div>
		);
	}

	if (!lessons.length) {
		return (
			<div className='text-center py-8'>
				<p className='text-gray-500'>No lessons found</p>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='grid gap-4'>
				{paginatedLessons.map((lesson) => {
					const isValidStatus =
						lesson.status && lesson.status
							? lessonStatusOptions.includes(
									lesson.status as
										| 'SCHEDULED'
										| 'IN_PROGRESS'
										| 'COMPLETED'
										| 'CANCELLED'
										| 'RESCHEDULED'
							  )
							: false;

					const displayStatus =
						isValidStatus && lesson.status
							? lesson.status.replace(/_/g, ' ')
							: 'Unknown';

					return (
						<DataCard key={lesson.id}>
							<div className='flex items-center justify-between mb-3'>
								<div className='flex items-center gap-3'>
									<div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
										<BookOpen className='h-5 w-5 text-blue-600' />
									</div>
									<div>
										<div className='font-medium text-gray-900'>
											{`Lesson ${lesson.frontendIndex}`}
										</div>
										<Badge
											variant='outline'
											className='mt-1 bg-green-100 text-green-800 border-green-200'
										>
											{lesson.date
												? formatDate(lesson.date.toString())
												: formatDate(lesson.created_at)}
										</Badge>
										<Badge
											variant='outline'
											className='mt-1 bg-gray-100 text-gray-800 border-gray-200'
										>
											{lesson.date
												? getSeason(lesson.date.toString())
												: getSeason(lesson.created_at)}
										</Badge>
										<Badge
											variant='outline'
											className='mt-1 bg-gray-100 text-gray-800 border-gray-200'
										>
											{lesson.date
												? getSeason(lesson.date.toString())
												: getSeason(lesson.created_at)}
										</Badge>
									</div>
								</div>
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
							</div>

							<div className='grid grid-cols-2 gap-3 text-sm'>
								<div className='flex items-center gap-2'>
									<div className='h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center'>
										<User className='h-4 w-4 text-purple-600' />
									</div>
									<span className='text-gray-900'>
										{getEmail(lesson.profile?.email || '')}
									</span>
								</div>

								<div className='flex items-center gap-2'>
									<div className='h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center'>
										<User className='h-4 w-4 text-orange-600' />
									</div>
									<span className='text-gray-900'>
										{getEmail(lesson.teacher_profile?.email || '')}
									</span>
								</div>

								{lesson.time && (
									<div className='flex items-center gap-2'>
										<div className='h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center'>
											<Clock className='h-4 w-4 text-yellow-600' />
										</div>
										<span className='text-gray-900'>{lesson.time}</span>
									</div>
								)}

								<div className='flex items-center gap-2'>
									<Badge
										variant='outline'
										className={`${getStatusColor(
											lesson.status || 'scheduled'
										)} border-transparent`}
									>
										{displayStatus}
									</Badge>
								</div>
							</div>
						</DataCard>
					);
				})}
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

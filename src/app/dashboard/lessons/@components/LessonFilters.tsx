'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { LessonStatusEnum } from '@/schemas';

interface Student {
	user_id: string;
	firstName: string;
	lastName: string;
	email: string;
	isStudent: boolean;
}

interface User {
	user_id: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	isStudent?: boolean;
	isAdmin?: boolean;
	isTeacher?: boolean;
}

interface LessonFiltersProps {
	currentSort: string;
	currentFilter: string | null;
	isAdmin?: boolean;
	seasons?: string[];
	currentSeason?: string;
}

export function LessonFilters({
	currentSort,
	currentFilter,
	isAdmin = false,
	seasons = [],
}: LessonFiltersProps) {
	const handleSeasonChange = (value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value === 'all') {
			params.delete('season');
		} else {
			params.set('season', value);
		}
		router.push(`?${params.toString()}`);
	};
	const router = useRouter();
	const searchParams = useSearchParams();
	const [students, setStudents] = useState<Student[]>([]);
	const [loadingStudents, setLoadingStudents] = useState(false);

	// Fetch students for admin users
	useEffect(() => {
		if (isAdmin) {
			setLoadingStudents(true);
			fetch('/api/auth/admin/all-users')
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error('Failed to fetch students');
				})
				.then((data) => {
					console.log('Fetched users data:', data.users);
					// Filter only students (users who are students)
					const studentUsers =
						data.users
							?.filter((user: unknown) => {
								const userObj = user as User;
								return (
									userObj.isStudent || (!userObj.isAdmin && !userObj.isTeacher)
								);
							})
							.map((user: unknown) => {
								const userObj = user as User;
								return {
									user_id: userObj.user_id,
									firstName: userObj.firstName || '',
									lastName: userObj.lastName || '',
									email: userObj.email || '',
									isStudent: userObj.isStudent || false,
								};
							})
							.filter((student: Student) => {
								// Only include students with valid UUID user_ids
								const uuidRegex =
									/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
								const isValid = uuidRegex.test(student.user_id);
								if (!isValid) {
									console.warn(
										'Skipping student with invalid user_id:',
										student
									);
								}
								return isValid;
							}) || [];
					console.log('Filtered students:', studentUsers);
					setStudents(studentUsers);
				})
				.catch((error) => {
					console.error('Error fetching students:', error);
				})
				.finally(() => {
					setLoadingStudents(false);
				});
		}
	}, [isAdmin]);

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

	const handleStudentChange = (value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value === 'all') {
			params.delete('studentId');
		} else {
			// Validate that the value is a valid UUID before setting it
			const uuidRegex =
				/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
			if (uuidRegex.test(value)) {
				params.set('studentId', value);
			} else {
				console.error('Invalid student ID format:', value);
				return; // Don't update the URL if the ID is invalid
			}
		}
		router.push(`?${params.toString()}`);
	};

	// Get lesson status options from the schema
	const lessonStatusOptions = LessonStatusEnum.options;

	// Get current student filter value
	const currentStudentId = searchParams.get('studentId');

	const currentSeasonValue = searchParams.get('season') || '';
	return (
		<div className='flex items-center gap-4 w-full sm:w-auto flex-wrap'>
			{/* Season filter */}
			{seasons.length > 0 && (
				<Select
					defaultValue={currentSeasonValue || 'all'}
					onValueChange={handleSeasonChange}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Filter by season' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Seasons</SelectItem>
						{seasons.map((season) => (
							<SelectItem key={season} value={season}>
								{season}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
			<Select defaultValue={currentSort} onValueChange={handleSortChange}>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Sort by' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='created_at'>Date Created</SelectItem>
					<SelectItem value='date'>Lesson Date</SelectItem>
					<SelectItem value='lesson_number'>Lesson Number</SelectItem>
				</SelectContent>
			</Select>

			<Select
				defaultValue={currentFilter || 'all'}
				onValueChange={handleFilterChange}
			>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Filter by status' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>All Status</SelectItem>
					{lessonStatusOptions.map((status) => (
						<SelectItem key={status} value={status.toLowerCase()}>
							{status.replace(/_/g, ' ')}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Student filter - only for admin users */}
			{isAdmin && (
				<Select
					defaultValue={currentStudentId || 'all'}
					onValueChange={handleStudentChange}
					disabled={loadingStudents}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue
							placeholder={
								loadingStudents ? 'Loading students...' : 'Filter by student'
							}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Students</SelectItem>
						{students.map((student) => (
							<SelectItem key={student.user_id} value={student.user_id}>
								{student.firstName} {student.lastName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
}

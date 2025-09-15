'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EnhancedFilters } from '@/components/ui/enhanced-filters';
import {
	BookOpen,
	User as UserIcon,
	Calendar,
	Clock,
	Layers,
} from 'lucide-react';
import { LessonStatusEnum } from '@/schemas';
import { User as UserInterface } from '@/types/User';
import { fetchProfiles } from '@/app/dashboard/students/components/data-service';

interface Student {
	user_id: string;
	firstName: string;
	lastName: string;
	email: string;
	isStudent: boolean;
}

interface LessonFiltersProps {
	currentSort: string;
	currentFilter: string | null;
	isAdmin?: boolean;
}

export function LessonFilters({
	currentSort,
	currentFilter,
	isAdmin = false,
}: LessonFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [students, setStudents] = useState<Student[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [loadingStudents, setLoadingStudents] = useState(false);

	// Fetch students for admin users
	useEffect(() => {
		if (isAdmin) {
			setLoadingStudents(true);
			// Fetch profiles using the data service
			fetchProfiles('created_at', 'desc')
				.then(({ data, error }) => {
					if (error) {
						console.error('Error fetching students:', error);
						return;
					}
					const users = data || [];
					const studentUsers =
						users
							?.filter((user: UserInterface) => {
								const userObj = user as UserInterface;
								return (
									userObj.isStudent || (!userObj.isAdmin && !userObj.isTeacher)
								);
							})
							.map((user: UserInterface) => {
								const userObj = user as UserInterface;
								return {
									user_id: userObj.user_id,
									firstName: userObj.firstName || '',
									lastName: userObj.lastName || '',
									email: userObj.email || '',
									isStudent: userObj.isStudent || false,
								};
							})
							.filter((student: Student) => {
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
					setStudents(studentUsers);
				})
				.finally(() => {
					setLoadingStudents(false);
				});
		}
	}, [isAdmin]);

	const handleFilterChange = (filterKey: string, value: string) => {
		const params = new URLSearchParams(searchParams);

		switch (filterKey) {
			case 'sort':
				params.set('sort', value);
				break;
			case 'status':
				if (value === 'all') {
					params.delete('filter');
				} else {
					params.set('filter', value);
				}
				break;
			case 'student':
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
				break;
			case 'season':
				if (value === 'all') {
					params.delete('season');
				} else {
					params.set('season', value);
				}
				break;
		}

		router.push(`?${params.toString()}`);
	};

	const clearAllFilters = () => {
		const params = new URLSearchParams(searchParams);
		params.delete('sort');
		params.delete('filter');
		params.delete('studentId');
		params.delete('season');
		router.push(`?${params.toString()}`);
	};

	// Get lesson status options from the schema
	const lessonStatusOptions = LessonStatusEnum.options;

	// Get current student filter value
	const currentStudentId = searchParams.get('studentId');

	// Generate season options (e.g., 2022/2023, 2023/2024, 2024/2025)
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const latestSeasonStart = currentMonth >= 8 ? currentYear : currentYear - 1;
	const seasonOptions = [];
	for (let i = 0; i < 5; i++) {
		const start = latestSeasonStart - i;
		const end = start + 1;
		seasonOptions.push({
			value: `${start}/${end}`,
			label: `${start}/${end}`,
			icon: <Layers className='h-4 w-4' />,
			color: 'bg-gray-100 text-gray-700 border-gray-200',
		});
	}

	// Prepare filter options for enhanced filters component
	const filterOptions = {
		sort: [
			{
				value: 'created_at',
				label: 'Date Created',
				icon: <Calendar className='h-4 w-4' />,
				color: 'bg-green-100 text-green-700 border-green-200',
			},
			{
				value: 'date',
				label: 'Lesson Date',
				icon: <Calendar className='h-4 w-4' />,
				color: 'bg-green-100 text-green-700 border-green-200',
			},
			{
				value: 'lesson_number',
				label: 'Lesson Number',
				icon: <BookOpen className='h-4 w-4' />,
				color: 'bg-blue-100 text-blue-700 border-blue-200',
			},
		],
		status: [
			{
				value: 'all',
				label: 'All Status',
				icon: <Clock className='h-4 w-4' />,
				color: 'bg-gray-100 text-gray-700 border-gray-200',
			},
			...lessonStatusOptions.map((status) => ({
				value: status.toLowerCase(),
				label: status.replace(/_/g, ' '),
				icon: <Clock className='h-4 w-4' />,
				color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
			})),
		],
		season: [
			{
				value: 'all',
				label: 'All Seasons',
				icon: <Layers className='h-4 w-4' />,
				color: 'bg-gray-100 text-gray-700 border-gray-200',
			},
			...seasonOptions,
		],
		...(isAdmin && {
			student: [
				{
					value: 'all',
					label: 'All Students',
					icon: <UserIcon className='h-4 w-4' />,
					color: 'bg-blue-100 text-blue-700 border-blue-200',
				},
				...students.map((student) => ({
					value: student.user_id,
					label: `${student.firstName} ${student.lastName}`,
					icon: <UserIcon className='h-4 w-4' />,
					color: 'bg-blue-100 text-blue-700 border-blue-200',
				})),
			],
		}),
	};

	const currentSeason = searchParams.get('season');
	const currentFilters = {
		sort: currentSort,
		status: currentFilter || 'all',
		season: currentSeason || 'all',
		...(isAdmin && { student: currentStudentId || 'all' }),
	};

	return (
		<div className='mb-6'>
			<EnhancedFilters
				filters={currentFilters}
				filterOptions={filterOptions}
				onFilterChange={handleFilterChange}
				onClearAll={clearAllFilters}
			/>
		</div>
	);
}

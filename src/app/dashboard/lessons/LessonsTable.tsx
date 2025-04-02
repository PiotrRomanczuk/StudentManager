'use client';

import { Clock, User } from 'lucide-react';
import Link from 'next/link';
import type { Lesson } from '@/types/Lesson';

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

interface LessonsTableProps {
	lessons: Lesson[];
	//   getUserEmail: (id: string) => string
}

export function LessonsTable({ lessons }: LessonsTableProps) {
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

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Lesson</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Student</TableHead>
						<TableHead>Teacher</TableHead>
						<TableHead>Time</TableHead>
						<TableHead>Last Updated</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{lessons.map((lesson: Lesson) => (
						<TableRow key={lesson.id}>
							<TableCell className='font-medium'>
								{lesson.lesson_number
									? `Lesson ${lesson.lesson_number}`
									: 'Lesson'}
							</TableCell>
							<TableCell>
								<Badge variant='outline'>
									{lesson.date
										? formatDate(lesson.date.toString())
										: formatDate(lesson.created_at)}
								</Badge>
							</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
									<User className='h-4 w-4 text-muted-foreground' />
									<span>{getEmail(lesson.profile?.email || '')}</span>
								</div>
							</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
									<User className='h-4 w-4 text-muted-foreground' />
									<span>{getEmail('p.romanczuk@gmail.com')}</span>
								</div>
							</TableCell>
							<TableCell>
								{lesson.time ? (
									<div className='flex items-center gap-2'>
										<Clock className='h-4 w-4 text-muted-foreground' />
										<span>{lesson.time.toString()}</span>
									</div>
								) : (
									<span className='text-muted-foreground'>—</span>
								)}
							</TableCell>
							<TableCell className='text-muted-foreground text-sm'>
								{formatDate(lesson.updated_at)}
							</TableCell>
							<TableCell className='text-right'>
								<Button asChild size='sm' variant='secondary'>
									<Link href={`/dashboard/lessons/${lesson.id}`}>
										View Details
									</Link>
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

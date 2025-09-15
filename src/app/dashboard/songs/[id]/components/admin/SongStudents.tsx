'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
	Users,
	BookOpen,
	Calendar,
	Mail,
	ChevronDown,
	ChevronRight,
} from 'lucide-react';
import { getStudentsBySong } from '../../../@helpers';
import { toast } from 'sonner';

interface SongStudentsProps {
	songId: string;
	isAdmin: boolean;
}

interface Student {
	student_id: string;
	song_status: string;
	student: {
		user_id: string;
		email: string;
		firstName: string;
		lastName: string;
	};
	lessons: Array<{
		lesson_id: string;
		title: string;
		date: string;
		status: string;
	}>;
}

export function SongStudents({ songId, isAdmin }: SongStudentsProps) {
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
		new Set()
	);

	useEffect(() => {
		if (!isAdmin) return;

		const fetchStudents = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await getStudentsBySong(songId);
				setStudents(response.students || []);
			} catch (err) {
				console.error('Error fetching students:', err);
				setError('Failed to load students');
				toast.error('Failed to load students for this song');
			} finally {
				setLoading(false);
			}
		};

		fetchStudents();
	}, [songId, isAdmin]);

	if (!isAdmin) return null;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'mastered':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'remembered':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'started':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'to_learn':
				return 'bg-gray-100 text-gray-800 border-gray-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const toggleStudentExpansion = (studentId: string) => {
		const newExpanded = new Set(expandedStudents);
		if (newExpanded.has(studentId)) {
			newExpanded.delete(studentId);
		} else {
			newExpanded.add(studentId);
		}
		setExpandedStudents(newExpanded);
	};

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Users className='h-5 w-5' />
						Students with this Song
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-center py-4'>Loading students...</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Users className='h-5 w-5' />
						Students with this Song
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-center py-4 text-red-600'>{error}</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Users className='h-5 w-5' />
					Students with this Song ({students.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				{students.length === 0 ? (
					<div className='text-center py-4 text-muted-foreground'>
						No students have this song assigned yet.
					</div>
				) : (
					<div className='rounded-md border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-12'></TableHead>
									<TableHead>Student Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Song Status</TableHead>
									<TableHead>Lessons</TableHead>
									<TableHead className='text-right'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.map((student) => {
									const isExpanded = expandedStudents.has(student.student_id);
									return (
										<React.Fragment key={student.student_id}>
											<TableRow>
												<TableCell>
													<Button
														variant='ghost'
														size='sm'
														onClick={() =>
															toggleStudentExpansion(student.student_id)
														}
														className='h-6 w-6 p-0'
													>
														{isExpanded ? (
															<ChevronDown className='h-4 w-4' />
														) : (
															<ChevronRight className='h-4 w-4' />
														)}
													</Button>
												</TableCell>
												<TableCell className='font-medium'>
													{student.student.firstName} {student.student.lastName}
												</TableCell>
												<TableCell>
													<div className='flex items-center gap-2'>
														<Mail className='h-3 w-3 text-muted-foreground' />
														{student.student.email}
													</div>
												</TableCell>
												<TableCell>
													<Badge
														className={getStatusColor(student.song_status)}
													>
														{student.song_status.replace('_', ' ')}
													</Badge>
												</TableCell>
												<TableCell>
													<div className='flex items-center gap-2'>
														<BookOpen className='h-3 w-3 text-muted-foreground' />
														{student.lessons.length} lesson
														{student.lessons.length !== 1 ? 's' : ''}
													</div>
												</TableCell>
												<TableCell className='text-right'>
													<Button variant='outline' size='sm'>
														View Details
													</Button>
												</TableCell>
											</TableRow>
											{isExpanded && student.lessons.length > 0 && (
												<TableRow>
													<TableCell colSpan={6} className='p-0'>
														<div className='bg-muted/50 p-4'>
															<div className='space-y-2'>
																{student.lessons.map((lesson) => (
																	<div
																		key={lesson.lesson_id}
																		className='flex items-center justify-between text-sm bg-background p-2 rounded border'
																	>
																		<div className='flex items-center gap-2'>
																			<Calendar className='h-3 w-3 text-muted-foreground' />
																			<span className='font-medium'>
																				{lesson.title || 'Untitled Lesson'}
																			</span>
																		</div>
																		<div className='flex items-center gap-2'>
																			<span className='text-muted-foreground'>
																				{formatDate(lesson.date)}
																			</span>
																			<Badge
																				variant='outline'
																				className='text-xs'
																			>
																				{lesson.status}
																			</Badge>
																		</div>
																	</div>
																))}
															</div>
														</div>
													</TableCell>
												</TableRow>
											)}
										</React.Fragment>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

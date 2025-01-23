'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Song } from '@/types/Song';
import { redirect } from 'next/navigation';
import { useState, useMemo } from 'react';

interface SongsTableProps {
	songs: Song[];
	currentPage: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

export function SongTable({
	songs,
	currentPage,
	itemsPerPage,
}: SongsTableProps) {
	const [filters] = useState({
		title: '',
		author: '',
		level: '',
		key: '',
	});

	// Add sorting state
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Song | null;
		direction: 'asc' | 'desc';
	}>({
		key: null,
		direction: 'asc',
	});

	// Handle sort click
	const handleSort = (key: keyof Song) => {
		setSortConfig((current) => ({
			key,
			direction:
				current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	// Filter and sort songs using useMemo
	const filteredAndSortedSongs = useMemo(() => {
		const result = songs.filter((song) => {
			return (
				(song.Title?.toLowerCase() || '').includes(
					filters.title.toLowerCase()
				) &&
				(song.Author?.toLowerCase() || '').includes(
					filters.author.toLowerCase()
				) &&
				(song.Level?.toString() || '').includes(filters.level) &&
				(song.Key?.toLowerCase() || '').includes(filters.key.toLowerCase())
			);
		});

		if (sortConfig.key) {
			result.sort((a, b) => {
				const aValue = a[sortConfig.key!]?.toString().toLowerCase() || '';
				const bValue = b[sortConfig.key!]?.toString().toLowerCase() || '';

				if (aValue < bValue) {
					return sortConfig.direction === 'asc' ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
		}

		return result;
	}, [songs, filters, sortConfig]);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentSongs = filteredAndSortedSongs.slice(startIndex, endIndex);

	// Helper function to render sort indicator
	const getSortIndicator = (key: keyof Song) => {
		if (sortConfig.key === key) {
			return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
		}
		return '';
	};

	const TableHeaders = ['Title', 'Author', 'Level', 'Key', 'Updated At'];

	return (
		<div className='space-y-4'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							{TableHeaders.map((head, index) => (
								<TableHead
									key={index}
									className='cursor-pointer hover:bg-gray-50'
									onClick={() => handleSort(head as keyof Song)}
								>
									{head}
									{getSortIndicator(head as keyof Song)}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentSongs.map((song) => (
							<TableRow key={song.Id}>
								<TableCell>{song.Title}</TableCell>
								<TableCell>{song.Author}</TableCell>
								<TableCell>{song.Level}</TableCell>
								<TableCell>{song.Key}</TableCell>
								<TableCell>
									{new Date(song.CreatedAt).toLocaleString('en-US', {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</TableCell>
								<TableCell>
									<Button
										variant='outline'
										onClick={() => redirect(`/dashboard/songs/${song.Title}`)}
									>
										More
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

'use client';

import { useRouter } from 'next/navigation';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SongsTableProps } from './types/tableTypes';
import { useSongTable } from './hooks/useSongTable';
import { TABLE_HEADERS } from './constants/tableConstants';
import { Song } from '@/types/Song';

export function SongTable({ songs, currentPage, itemsPerPage }: SongsTableProps) {
	const router = useRouter();
	const { currentSongs, handleSort, getSortIndicator } = useSongTable(
		songs,
		currentPage,
		itemsPerPage
	);

	return (
		<div className='space-y-4'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							{TABLE_HEADERS.map((head) => (
								<TableHead
									key={`header-${head}`}
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
						{currentSongs.map((song, index) => (
							<TableRow key={`${song.Id}-${index}`}>
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
										onClick={() => router.push(`/dashboard/songs/${song.Id}`)}
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

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
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentSongs = songs.slice(startIndex, endIndex);

	return (
		<div className='space-y-4'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Author</TableHead>
							<TableHead>Level</TableHead>
							<TableHead>Key</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentSongs.map((song) => (
							<TableRow key={song.Id}>
								<TableCell>{song.Title}</TableCell>
								<TableCell>{song.Author}</TableCell>
								<TableCell>{song.Level}</TableCell>
								<TableCell>{song.SongKey}</TableCell>
								<TableCell>
									<Button
										variant='outline'
										onClick={
											() => redirect(`/dashboard/songs/${song.Title}`)
											// console.log({ song })
										}
									>
										Edit
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

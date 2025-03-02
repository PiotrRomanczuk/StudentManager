'use client';

import { redirect } from 'next/navigation';
import { Music, BarChart, Key } from 'lucide-react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '@/components/dashboard/ui/card';
import { Button } from '@/components/dashboard/ui/button';
import { Song } from '@/types/Song';

interface SongDetailsProps {
	song: Song;
}

export default function SongDetails({ song }: SongDetailsProps) {
	// const router = useRouter();

	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to delete this song?')) {
			try {
				const response = await fetch(
					`/api/songs/title=${encodeURIComponent(song.title)}`,
					{
						method: 'DELETE',
					}
				);

				if (response.ok) {
					redirect('/dashboard/songs');
				} else {
					console.error('Failed to delete song');
				}
			} catch (error) {
				console.error('Error deleting song:', error);
			}
		}
	};

	function handleUpdate() {
		redirect(`/dashboard/songs/${encodeURIComponent(song.title)}/edit`);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6'>{song.title}</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{/* Basic Info Card */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<Music className='mr-2' size={20} />
							Basic Info
						</CardTitle>
					</CardHeader>
					<CardContent>
						{/* <p>
							<strong>ID:</strong> {song.Id}
						</p> */}
						<p>
							<strong>Title:</strong> {song.title}
						</p>
						{/* <p>
							<strong>Short Title:</strong> {song.ShortTitle || 'N/A'}
						</p> */}
						<p>
							<strong>Created At:</strong>{' '}
							{new Date(song.createdAt).toLocaleDateString()}
						</p>
						<p>
							<strong>Updated At:</strong>{' '}
							{new Date(song.updatedAt).toLocaleDateString()}
						</p>
					</CardContent>
				</Card>

				{/* Musical Details Card */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<Key className='mr-2' size={20} />
							Musical Basic Details
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Author:</strong> {song.author || 'N/A'}
						</p>
						<p>
							<strong>Key:</strong> {song.key || 'N/A'}
						</p>
						<p>
							<strong>Level:</strong> {song.level || 'N/A'}
						</p>
						{song.chords && (
							<p>
								<strong>Chords:</strong> {song.chords}
							</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<Key className='mr-2' size={20} />
							Chords
						</CardTitle>
					</CardHeader>
					<CardContent>
						{song.chords && (
							<p>
								<strong>Chords:</strong> {song.chords}
							</p>
						)}
					</CardContent>
				</Card>

				{/* Resources Card */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<BarChart className='mr-2' size={20} />
							Resources
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Ultimate Guitar:</strong>{' '}
							<a
								href={song.ultimateGuitarLink}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-500 hover:underline'
							>
								View Tab
							</a>
						</p>

						<p>
							<strong>Audio Files:</strong> {song.audioFiles}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className='mt-8 space-x-4'>
				<Button variant='outline' onClick={handleUpdate}>
					Edit Song
				</Button>
				<Button variant='destructive' onClick={handleDelete}>
					Delete Song
				</Button>
			</div>
		</div>
	);
}

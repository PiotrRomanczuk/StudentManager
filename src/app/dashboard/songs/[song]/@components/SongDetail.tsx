'use client';

import { redirect } from 'next/navigation';
import { Music, User, BarChart, Key } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
					`/api/songs/${encodeURIComponent(song.Title)}`,
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
		redirect(`/dashboard/songs/${encodeURIComponent(song.Title)}/edit`);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6'>{song.Title}</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<Music className='mr-2' size={20} />
							Song Details
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Author:</strong> {song.Author}
						</p>
						<p>
							<strong>Level:</strong> {song.Level}
						</p>
						<p>
							<strong>Key:</strong> {song.SongKey}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<User className='mr-2' size={20} />
							Lyrics
						</CardTitle>
					</CardHeader>
					{/* <CardContent>
            <pre className="whitespace-pre-wrap">{song.lyrics}</pre>
          </CardContent> */}
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<BarChart className='mr-2' size={20} />
							Chords
						</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className='whitespace-pre-wrap'>{song.Chords}</pre>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<Key className='mr-2' size={20} />
							Notes
						</CardTitle>
					</CardHeader>
					{/* <CardContent>
            <p>{song.notes}</p>
          </CardContent> */}
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

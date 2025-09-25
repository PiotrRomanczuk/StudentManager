import { createClient } from '@/utils/supabase/clients/server';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AddSongForm from './AddSongForm';
import AssignedSongsList from './AssignedSongsList';
import AllSongsCollapsible from './AllSongs';

type Params = { slug: string };

export default async function Page({ params }: { params: Promise<Params> }) {
	const { slug } = await params;

	const supabase = await createClient();

	const { data: songsRaw, error } = await supabase.from('songs').select('*');
	const songs = songsRaw || [];
	const { data: lessonSongs, error: lessonSongsError } = await supabase
		.from('lesson_songs')
		.select('song_id, song_status')
		.eq('lesson_id', slug);

	const assignedSongIds =
		lessonSongs?.map((ls: { song_id: string }) => ls.song_id) || [];

	// Sanitize songs for client component
	const safeSongs = JSON.parse(JSON.stringify(songs));

	return (
		<div className='container py-8 space-y-6'>
			<h1 className='text-3xl font-bold'>Manage Songs for Lesson {slug}</h1>

			<AllSongsCollapsible songs={safeSongs} />

			{(error || lessonSongsError) && (
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{error?.message ||
							lessonSongsError?.message ||
							'Failed to load data'}
					</AlertDescription>
				</Alert>
			)}

			<div className='space-y-8'>
				<AddSongForm
					songs={safeSongs}
					assignedSongIds={assignedSongIds}
					slug={slug}
				/>
				<AssignedSongsList
					songs={safeSongs}
					assignedSongIds={assignedSongIds}
					lessonSongs={lessonSongs}
					slug={slug}
				/>
			</div>
		</div>
	);
}

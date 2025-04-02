// import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { ShortSongTable } from './@components/cards/ShortSongTable';
import { createClient } from '@/utils/supabase/clients/server';
import { ErrorComponent } from './songs/@components/ErrorComponent';
import NoSongsFound from './songs/@components/NoSongsFound';
// import { Lesson } from "@/types/Lesson";
import { fetchSongs } from './@components/fetchSongs';
import { fetchUserAndAdmin } from './@components/fetchUserAndAdmin';

export default async function Page() {
	const supabase = await createClient();

	try {
		const { user, userIsAdmin } = await fetchUserAndAdmin(supabase);
		const songs = await fetchSongs(supabase, user.user.id, userIsAdmin.isAdmin);

		if (!songs?.length) {
			return <NoSongsFound />;
		}

		return (
			<div className='min-h-screen bg-gray-50'>
				<Container className='max-w-4xl py-8'>
					<div className='bg-white rounded-lg shadow p-6'>
						<h2 className='text-2xl font-semibold mb-4'>Recent Songs</h2>
						<ShortSongTable songs={songs} />
					</div>
				</Container>
			</div>
		);
	} catch (error) {
		return <ErrorComponent error={(error as Error).message} />;
	}
}

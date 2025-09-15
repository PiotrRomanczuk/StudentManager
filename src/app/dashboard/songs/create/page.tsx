import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SongForm } from '../[id]/components/SongForm';
import { createSong } from '../@helpers';
import { getUserAndAdminStatus } from '@/utils/auth-helpers';
import { SongInput } from '@/schemas/SongSchema';
import { formValuesToSongData } from '../utils/songFormHelpers';

export default async function CreateSongPage() {
	const { isAdmin } = await getUserAndAdminStatus();
	if (!isAdmin) {
		redirect('/dashboard/songs');
	}

	async function handleCreateSong(values: SongInput) {
		'use server';

		// Get authentication cookies for server-side API calls
		const cookieStore = await cookies();
		const cookieHeader = cookieStore
			.getAll()
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join('; ');

		const songData = formValuesToSongData(values);
		await createSong(songData, cookieHeader);
		redirect('/dashboard/songs');
	}

	return (
		<div className='max-w-xl mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-4'>Add New Song</h1>
			<SongForm mode='create' onSubmit={handleCreateSong} />
		</div>
	);
}

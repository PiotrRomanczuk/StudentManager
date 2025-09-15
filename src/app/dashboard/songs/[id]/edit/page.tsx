import { notFound, redirect } from 'next/navigation';
import { getSongById, updateSong } from '../../@helpers';
import { getUserAndAdminStatus } from '@/utils/auth-helpers';
import { SongForm } from '../components/SongForm';
import { cookies } from 'next/headers';
import { SongInput } from '@/schemas/SongSchema';
import {
	songToFormValues,
	formValuesToSongData,
} from '../../utils/songFormHelpers';

interface PageProps {
	params: Promise<{ id: string }>;
}
export default async function Page({ params }: PageProps) {
	const { isAdmin } = await getUserAndAdminStatus();
	if (!isAdmin) redirect('/dashboard/songs');

	const { id } = await params;
	const cookieHeader = (await cookies())
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join('; ');

	const song = await getSongById(id, cookieHeader);
	if (!song) notFound();

	const initialValues = songToFormValues(song);

	async function handleEditSong(values: SongInput) {
		'use server';
		const songData = formValuesToSongData(values);
		const cookieHeader = (await cookies())
			.getAll()
			.map((c) => `${c.name}=${c.value}`)
			.join('; ');
		try {
			await updateSong(id, songData, cookieHeader);
			redirect(`/dashboard/songs/${id}`);
		} catch (error: unknown) {
			if (
				error instanceof Error &&
				'status' in error &&
				(error as { status: number }).status === 404
			) {
				notFound();
			}
			throw error;
		}
	}

	return (
		<div className='max-w-xl mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-4'>Edit Song</h1>
			<SongForm
				mode='edit'
				initialValues={initialValues}
				onSubmit={handleEditSong}
			/>
		</div>
	);
}

'use client';

import useSongForm from '@/hooks/useSongForm';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SongEditForm } from './@components/SongEditForm';
import { Song } from '@/types/Song';
import { updateSong } from './updateSong';
import { normalizeSongData } from '@/utils/normalizeSongData';

const SongEditClientForm = ({ song }: { song: Song }) => {
	const router = useRouter();

	const {
		// handleSubmit,
		loading: formLoading,
		error: formError,
	} = useSongForm({
		mode: 'edit',
		songId: song.id,
		initialData: song,
		onSuccess: () => router.push(`/songs/${song?.id}`),
	});

	return (
		<div>
			<h1 className='text-3xl font-bold pl-6 pt-4 mb-6'>{song.title}</h1>
			<SongEditForm
				song={song}
				mode='edit'
				songId={song.id}
				loading={formLoading}
				error={formError}
				onSubmit={async (normalizedData) => {
					try {
						const formattedData = normalizeSongData(normalizedData, song);
						console.log('Submitting data:', formattedData);
						await updateSong(formattedData as Song); // Type assertion to fix type error
						router.push(`/dashboard/songs/${song.id}`);
					} catch (error) {
						console.error('Error updating song:', error);
						// Handle error state here
					}
				}}
				onCancel={() => router.push(`/dashboard/songs/${song.id}`)}
			/>
		</div>
	);
};

export default SongEditClientForm;

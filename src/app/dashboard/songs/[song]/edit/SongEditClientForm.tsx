'use client';

import useSongForm from '@/hooks/useSongForm';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SongEditForm } from './@components/SongEditForm';
import { Song } from '@/types/Song';
import { updateSong } from './updateSong';

const SongEditClientForm = ({ song }: { song: Song }) => {
	const router = useRouter();

	const {
		// handleSubmit,
		loading: formLoading,
		error: formError,
	} = useSongForm({
		mode: 'edit',
		songId: song.Id,
		initialData: song,
		onSuccess: () => router.push(`/songs/${song?.Id}`),
	});

	return (
		<div>
			<h1 className='text-3xl font-bold pl-6 pt-4 mb-6'>{song.Title}</h1>
			<SongEditForm
				song={song}
				mode='edit'
				songId={song.Id}
				loading={formLoading}
				error={formError}
				onSubmit={async (normalizedData) => {
					try {
						const formattedData = {
							Id: song.Id,
							Title: normalizedData.Title || song.Title,
							Author: normalizedData.Author || song.Author || '',
							Level: normalizedData.Level || song.Level || '',
							SongKey: normalizedData.SongKey || song.SongKey || 'Unknown',
							Chords: normalizedData.Chords || song.Chords || '',
							AudioFiles: normalizedData.AudioFiles || '',
							UltimateGuitarLink: normalizedData.UltimateGuitarLink || '',
							ShortTitle: normalizedData.ShortTitle || '',
							CreatedAt: song.CreatedAt,
							UpdatedAt: new Date().toISOString(),
						};

						console.log('Submitting data:', formattedData);
						await updateSong(formattedData);
						router.push(`/dashboard/songs/${song.Id}`);
					} catch (error) {
						console.error('Error updating song:', error);
						// You might want to set some error state here to show to the user
					}
				}}
				onCancel={() => router.push(`/dashboard/songs/${song.Id}`)}
			/>
		</div>
	);
};

export default SongEditClientForm;

'use client';

import useSongForm from '@/hooks/useSongForm';
import { redirect } from 'next/navigation';
import React from 'react';
import { SongEditForm } from './@components/SongEditForm';
import { Song } from '@/types/Song';

const SongEditClientForm = ({ song }: { song: Song }) => {
	const {
		handleSubmit,
		loading: formLoading,
		error: formError,
	} = useSongForm({
		mode: 'edit',
		songId: song.Id,
		initialData: song,
		onSuccess: () => redirect(`/songs/${song?.Id}`),
	});
	return (
		<div>
			<h1 className='text-3xl font-bold mb-6'>{song.Title}</h1>
			<SongEditForm
				song={song}
				mode='edit'
				songId={song.Id}
				loading={formLoading}
				error={formError}
				onSubmit={handleSubmit}
				onCancel={() => redirect(`/dashboard/songs/${song.Title}`)}
			/>
		</div>
	);
};

export default SongEditClientForm;

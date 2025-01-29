// 'use client';

// import useSongForm from '@/hooks/useSongForm';
// import { redirect } from 'next/navigation';
// import React from 'react';
// import { SongEditForm } from './@components/SongEditForm';
// import { Song } from '@/types/Song';

// type Params = Promise<{ song: Song }>;

// const SongCreateClientForm = ({ params }: { params: Params }) => {
// 	const {
// 		handleSubmit,
// 		loading: formLoading,
// 		error: formError,
// 	} = useSongForm({
// 		mode: 'create',
// 		initialData: params,
// 		onSuccess: () => redirect(`/songs/`),
// 	});
// 	return (
// 		<div>
// 			<h1 className='text-3xl font-bold pl-6 pt-4 mb-6'>New Song</h1>
// 			<SongEditForm
// 				song={song}
// 				mode='create'
// 				// songId={song.Id}
// 				loading={formLoading}
// 				error={formError}
// 				onSubmit={handleSubmit}
// 				onCancel={() => redirect(`/dashboard/songs`)}
// 			/>
// 		</div>
// 	);
// };

// export default SongCreateClientForm;

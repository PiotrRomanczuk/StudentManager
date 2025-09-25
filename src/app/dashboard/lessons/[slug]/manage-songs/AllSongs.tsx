'use client';
import { useState } from 'react';

type Song = {
	id: string;
	title: string;
	author?: string;
};

export default function AllSongsCollapsible({ songs }: { songs: Song[] }) {
	const [open, setOpen] = useState(false);
	console.log('AllSongsCollapsible songs:', songs);
	return (
		<div className='mb-4'>
			<button
				type='button'
				className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-medium'
				onClick={() => setOpen((prev) => !prev)}
			>
				{open ? 'Hide All Songs' : 'Show All Songs'}
			</button>
			{open && (
				<div className='mt-2'>
					<h2 className='text-xl font-semibold mb-2'>All Songs</h2>
					<ul className='list-disc pl-6'>
						{songs.map((song: Song) => (
							<li key={song.id}>
								<a
									href={`/dashboard/songs/${song.id}`}
									className='font-medium text-blue-600 hover:underline'
									target='_blank'
									rel='noopener noreferrer'
								>
									{song.title}
								</a>
								{song.author && (
									<span className='text-gray-500'> by {song.author}</span>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

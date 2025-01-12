'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Song } from '@/types/Song';
import RenderInput from './RenderInput';

interface SongFormProps {
	song?: Partial<Song>;
	mode: 'create' | 'edit';
	songId?: number;
}

export function SongEditForm({ song, mode, songId }: SongFormProps) {
	const [formData, setFormData] = useState<Partial<Song>>({
		Title: song?.Title || '',
		Author: song?.Author || '',
		Level: song?.Level || '',
		SongKey: song?.SongKey || '',
		Chords: song?.Chords || '',
		AudioFiles: song?.AudioFiles || '',
		CreatedAt: song?.CreatedAt || '',
		UltimateGuitarLink: song?.UltimateGuitarLink || '',
		ShortTitle: song?.ShortTitle || '',
	});

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const url = mode === 'create' ? '/api/songs' : `/api/songs/${songId}`;
			const method = mode === 'create' ? 'POST' : 'PUT';

			await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
		} catch (err) {
			setError('Failed to save song');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div className='grid grid-cols-2 gap-4'>
				{[
					{ id: 'Title', label: 'Title', required: true },
					{ id: 'Author', label: 'Author' },
					{ id: 'Level', label: 'Level' },
					{ id: 'SongKey', label: 'Song Key' },
					{ id: 'Chords', label: 'Chords' },
					{ id: 'AudioFiles', label: 'Audio Files' },
					{ id: 'CreatedAt', label: 'Created At', required: true },
					{ id: 'UltimateGuitarLink', label: 'Ultimate Guitar Link' },
					{ id: 'ShortTitle', label: 'Short Title' },
				].map((input) => (
					<RenderInput
						key={input.id}
						id={input.id as keyof Song}
						label={input.label}
						required={input.required}
						value={formData[input.id as keyof Song] || ''}
						handleInputChange={handleInputChange}
					/>
				))}
			</div>

			{error && <p className='text-red-500 text-sm'>{error}</p>}

			<div className='flex justify-end'>
				<Button type='submit' disabled={loading}>
					{loading
						? 'Saving...'
						: mode === 'create'
						? 'Create Song'
						: 'Update Song'}
				</Button>
			</div>
		</form>
	);
}

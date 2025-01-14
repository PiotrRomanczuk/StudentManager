'use client';

import { useState, useEffect } from 'react';
import { Song } from '@/types/Song';
import useLoadSongs from './useLoadSongs';

interface UseSongFormProps {
	mode: 'create' | 'edit';
	songId?: string;
	initialData?: Song;
	onSuccess: () => void;
}

const useSongForm = ({
	mode,
	songId,
	initialData,
	onSuccess,
}: UseSongFormProps) => {
	const [formData, setFormData] = useState<Partial<Song>>(initialData || {});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		loading: loadingSong,
		songs,
		error: loadError,
	} = useLoadSongs(songId);

	useEffect(() => {
		if (mode === 'edit' && songId && !initialData) {
			if (songs.length > 0) {
				setFormData(songs[0]);
			} else if (loadError) {
				setError(loadError);
			}
		}
	}, [mode, songId, initialData, songs, loadError]);

	const handleSubmit = async (data: Partial<Song>) => {
		setLoading(true);
		setError(null);

		try {
			const url = mode === 'create' ? '/api/songs' : `/api/songs?id=${songId}`;
			const method = mode === 'create' ? 'POST' : 'PUT';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			console.log(response);
			if (!response.ok) {
				console.log(response);
				throw new Error('Failed to save song');
			}

			onSuccess();
		} catch (err) {
			setError('Failed to save song');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		formData,
		setFormData,
		loading: loading || loadingSong,
		error,
		handleSubmit,
	};
};

export default useSongForm;

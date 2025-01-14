import { useState, useEffect } from 'react';
import { Song } from '@/types/Song';

const useLoadSongs = (id?: string, title?: string) => {
	const [loading, setLoading] = useState(false);
	const [songs, setSongs] = useState<Song[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSongs = async () => {
			try {
				setLoading(true);
				console.log('Fetching songs...');
				let url = '/api/songs';
				if (id) {
					url += `?id=${id}`;
				} else if (title) {
					url += `?title=${title}`;
				}
				const response = await fetch(url);
				const data = await response.json();
				console.log('Fetched songs:', data);

				if (data.data.length === 0) {
					setError('No songs found');
					setSongs([]);
					return;
				}

				if (data && Array.isArray(data.data)) {
					setSongs(
						data.data.map((song: Song) => ({
							...song,
						}))
					);
					setError(null);
				} else {
					console.error('Unexpected data format:', data);
					setError('No songs found');
				}
			} catch (error) {
				console.error('Error loading songs:', error);
				setError('Failed to load songs');
			} finally {
				setLoading(false);
			}
		};

		fetchSongs();
	}, [id, title]);

	return { loading, songs, error };
};

export default useLoadSongs;

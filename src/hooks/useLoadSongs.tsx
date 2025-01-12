import { useState, useEffect } from 'react';
import { Song } from '@/types/Song';

const useLoadSongs = () => {
	const [loading, setLoading] = useState(false);
	const [songs, setSongs] = useState<Song[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSongs = async () => {
			try {
				setLoading(true);
				console.log('Fetching songs...');
				const response = await fetch('/api/songs');
				const data = await response.json();
				// debugger;
				console.log('Fetched songs:', data);
				// write a check if array is empty
				if (data.data.length === 0) {
					setError('No songs found');
					setSongs([]);
					return;
				}

				if (data && Array.isArray(data.data)) {
					setSongs(
						data.data.map((song: Song) => ({
							...song,
							// author: song.author || '',
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
	}, []);

	return { loading, songs, error };
};

export default useLoadSongs;

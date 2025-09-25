'use client';

'use client';
import React, { useState, useEffect } from 'react';
import {
	getSongsForUser,
	SongsForUserResponse,
} from '../utils/getSongsForUser';

export default function DebugPage() {
	const [songsData, setSongsData] = useState<SongsForUserResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getSongsForUser({ page: 1, limit: 5 })
			.then((data) => {
				setSongsData(data);
				setError(null);
			})
			.catch((e) => {
				setError(e instanceof Error ? e.message : String(e));
				setSongsData(null);
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<div>
			<h1>Debug: Songs (first 5)</h1>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div style={{ color: 'red' }}>Error: {error}</div>
			) : songsData && songsData.songs && songsData.songs.length > 0 ? (
				<ul>
					{songsData.songs.map((song, idx) => (
						<li key={song.id || idx}>
							<strong>{song.title}</strong> by {song.author} (Level:{' '}
							{song.level}, Key: {song.key})
						</li>
					))}
				</ul>
			) : (
				<div>No songs found.</div>
			)}
		</div>
	);
}

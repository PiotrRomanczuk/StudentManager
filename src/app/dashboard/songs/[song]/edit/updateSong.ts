import { Song } from '@/types/Song';

export async function updateSong(song: Song) {
	const response = await fetch(`/api/songs/${song.id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(song),
	});

	const data = await response.json();

	if (!response.ok) {
		if (data.details) {
			// Zod validation errors include details
			throw new Error(`Validation error: ${JSON.stringify(data.details)}`);
		}
		throw new Error(data.error || 'Failed to update song');
	}

	return data;
}

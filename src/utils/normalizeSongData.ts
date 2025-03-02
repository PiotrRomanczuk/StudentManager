import { Song } from '@/types/Song';

export const normalizeSongData = (
	song: Partial<Song>,
	existingSong: Song
): Partial<Song> => {
	return {
		id: existingSong.id,
		title: song.title || existingSong.title,
		author: song.author || existingSong.author || '',
		level: song.level || existingSong.level || '',
		key: song.key || existingSong.key || 'Unknown',
		chords: song.chords || existingSong.chords || '',
		audioFiles: song.audioFiles || '',
		ultimateGuitarLink: song.ultimateGuitarLink || '',
		shortTitle: song.shortTitle || '',
		createdAt: existingSong.createdAt,
		updatedAt: new Date().toISOString(),
	};
};

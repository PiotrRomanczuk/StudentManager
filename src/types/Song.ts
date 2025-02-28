export interface Song {
	id: string;
	title: string;
	author: string;
	level: 'beginner' | 'intermediate' | 'advanced';
	key: string;
	chords?: string;
	audioFiles?: string;
	ultimateGuitarLink?: string;
	shortTitle?: string;
	createdAt: string;
	updatedAt: string;
}

export type CreateSongDTO = Omit<Song, 'Id' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateSongDTO = Partial<CreateSongDTO>;

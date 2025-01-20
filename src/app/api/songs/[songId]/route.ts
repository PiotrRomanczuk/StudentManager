import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '../openDb';
import { songInputSchema } from '../songInputSchema';
import { z } from 'zod';
import { APIError } from '@/utils/api-helpers';

export async function PUT(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const songId = searchParams.get('id');

		console.log(songId);
		const body = await req.json();
		const validatedData = songInputSchema.parse(body);

		const db = await openDb();
		const {
			Title,
			Author,
			Level,
			SongKey,
			Chords,
			AudioFiles,
			UltimateGuitarLink,
			ShortTitle,
		} = validatedData;

		const result = await db.run(
			`UPDATE songs 
			 SET title = ?, author = ?, level = ?, songKey = ?, 
				 chords = ?, audioFiles = ?, ultimateGuitarLink = ?, shortTitle = ?
			 WHERE id = ?`,
			[
				Title,
				Author,
				Level,
				SongKey,
				Chords,
				AudioFiles,
				UltimateGuitarLink,
				ShortTitle,
				songId,
			]
		);

		if (result.changes === 0) {
			return NextResponse.json({ error: 'Song not found' }, { status: 404 });
		}

		return NextResponse.json({ success: true, data: validatedData });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Validation error', details: error.errors },
				{ status: 400 }
			);
		}

		if (error instanceof APIError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status }
			);
		}

		console.error('Error updating song:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/songs
 * Deletes a song from the database.
 *
 * Query Parameters:
 * - id: string (required): The ID of the song to delete.
 *
 * Response:
 * - success: boolean
 */

export async function DELETE(req: NextRequest) {
	try {
		const db = await openDb();
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');
		await db.run('DELETE FROM songs WHERE id = ?', [id]);
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		return NextResponse.json({ success: false, error: error });
	}
}

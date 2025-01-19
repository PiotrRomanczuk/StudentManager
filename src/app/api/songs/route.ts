import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import type { NextRequest } from 'next/server';
import { createGuid } from '@/utils/createGuid';
import { getDb } from '@/lib/db';
import { z } from 'zod';
import { APIError } from '@/utils/api-helpers';
import { songInputSchema } from './songInputSchema';

const DB_Path = '../../../../../../app_new.db';
const pathDB = path.resolve(__dirname, DB_Path);

async function openDb() {
	return open({
		filename: pathDB,
		driver: sqlite3.Database,
	});
}

// async function closeDb() {
// 	return sqlite3.Database.close();
// }

/**
 * GET /api/songs
 * Fetches all songs or a specific song by title.
 *
 * Query Parameters:
 * - title (optional): The title of the song to fetch.
 * - id (optional): The ID of the song to fetch.
 *
 * Response:
 * - success: boolean
 * - data: array of songs or a single song object
 */
export async function GET(req: NextRequest) {
	try {
		const db = await openDb();
		const { searchParams } = new URL(req.url);
		const title = searchParams.get('title');
		const id = searchParams.get('id');

		if (title) {
			const song = await db.get('SELECT * FROM songs WHERE title = ?', [title]);
			console.log(title, song);
			return NextResponse.json({ success: true, data: song });
		} else if (id) {
			const song = await db.get('SELECT * FROM songs WHERE id = ?', [id]);
			console.log(id, song);
			return NextResponse.json({ success: true, data: song });
		} else {
			const songs = await db.all('SELECT * FROM songs');
			return NextResponse.json({ success: true, data: songs });
		}
	} catch (error: unknown) {
		return NextResponse.json({ success: false, error: error });
	}
}

/**
 * POST /api/songs
 * Adds a new song to the database.
 *
 * Request Body (application/json):
 * - title: string (required)
 * - author: string (optional)
 * - level: string (optional)
 * - songKey: string (optional)
 * - chords: string (optional)
 * - audioFiles: string (optional)
 * - createdAt: string (optional)
 * - ultimateGuitarLink: string (optional)
 * - shortTitle: string (optional)
 *
 * Response:
 * - success: boolean
 * - data: object containing the ID of the newly created song
//  */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const validatedData = songInputSchema.parse(body);

		const db = await getDb();
		const contentType = req.headers.get('content-type') || '';
		console.log(contentType);
		if (contentType.includes('application/json')) {
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

			const Id = createGuid();
			const CreatedAt = new Date().toISOString();
			console.log({
				Id,
				Title,
				Author,
				Level,
				SongKey,
				Chords,
				AudioFiles,
				UltimateGuitarLink,
				ShortTitle,
				CreatedAt,
			});

			const result = await db.run(
				`INSERT INTO songs (id, title, author, level, songKey, chords, audioFiles, createdAt, ultimateGuitarLink, shortTitle)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					Id,
					Title,
					Author,
					Level,
					SongKey,
					Chords,
					AudioFiles,
					UltimateGuitarLink,
					ShortTitle,
				]
			);
			console.log(result);
			return NextResponse.json({ success: true, data: { id: result.lastID } });
		} else if (contentType.includes('multipart/form-data')) {
			// const formData = await req.formData();
			// const file = formData.get('file');
			// Handle file import logic here
			return NextResponse.json({ success: true });
		}
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

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const db = await openDb();
		const body = await req.json();

		console.log('PUT request body:', body);

		if (!body.id) {
			return NextResponse.json(
				{
					success: false,
					error: 'Missing required id field',
				},
				{ status: 400 }
			);
		}

		const query = `
            UPDATE songs SET 
                title = ?, 
                author = ?, 
                level = ?, 
                key = ?,
                chords = ?, 
                audiofiles = ?,
                updatedat = ?,
                shorttitle = ?
            WHERE id = ?
        `;

		const updatedAt = new Date().toISOString();

		const values = [
			body.title,
			body.author,
			body.level,
			body.songKey,
			body.chords,
			body.audioFiles,
			updatedAt,
			body.shortTitle,
			body.id,
		];

		const result = await db.run(query, values);

		if (result.changes === 0) {
			return NextResponse.json(
				{
					success: false,
					error: 'No song found with the provided id',
				},
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				success: true,
				data: { message: 'Song updated successfully' },
			},
			{ status: 200 }
		);
	} catch (error: unknown) {
		console.error('Error updating song:', error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
				details: error,
			},
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

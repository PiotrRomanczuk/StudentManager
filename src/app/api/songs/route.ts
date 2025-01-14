import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import type { NextRequest } from 'next/server';

const DB_Path = '../../../../../../app_new.db';
const pathDB = path.resolve(__dirname, DB_Path);

async function openDb() {
	return open({
		filename: pathDB,
		driver: sqlite3.Database,
	});
}

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
 * - artist: string (required)
 *
 * Response:
 * - success: boolean
 * - data: object containing the ID of the newly created song
 */
export async function POST(req: NextRequest) {
	try {
		const db = await openDb();
		const contentType = req.headers.get('content-type') || '';
		if (contentType.includes('application/json')) {
			const body = await req.json();
			const result = await db.run(
				'INSERT INTO songs (title, artist) VALUES (?, ?)',
				[body.title, body.artist]
			);
			return NextResponse.json({ success: true, data: { id: result.lastID } });
		} else if (contentType.includes('multipart/form-data')) {
			// const formData = await req.formData();
			// const file = formData.get('file');
			// Handle file import logic here
			return NextResponse.json({ success: true });
		}
	} catch (error: unknown) {
		return NextResponse.json({ success: false, error: error });
	}
}

/**
 * PUT /api/songs
 * Updates an existing song in the database.
 *
 * Request Body (application/json):
 * - id: string (required)
 * - title: string (required)
 * - author: string (optional)
 * - level: string (optional)
 * - songKey: string (optional)
 * - chords: string (optional)
 * - audioFiles: string (optional)
 * - createdAt: string (required)
 * - ultimateGuitarLink: string (optional)
 * - shortTitle: string (optional)
 *
 * Response:
 * - success: boolean
 */
export async function PUT(req: NextRequest) {
	try {
		const db = await openDb();
		const body = await req.json();
		const {
			id,
			title,
			author,
			level,
			songKey,
			chords,
			audioFiles,
			createdAt,
			ultimateGuitarLink,
			shortTitle,
		} = body;

		console.log({ body });
		console.log('Route PUT');
		console.log({ id, title });
		await db.run(
			`UPDATE songs SET 
				title = ?, 
				author = ?, 
				level = ?, 
				songKey = ?, 
				chords = ?, 
				audioFiles = ?, 
				createdAt = ?, 
				ultimateGuitarLink = ?, 
				shortTitle = ? 
			WHERE id = ?`,
			[
				title,
				author,
				level,
				songKey,
				chords,
				audioFiles,
				createdAt,
				ultimateGuitarLink,
				shortTitle,
				id,
			]
		);
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		return NextResponse.json({ success: false, error: error });
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

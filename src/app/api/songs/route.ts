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

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const title = searchParams.get('title');

	console.log(`title: ${title}`);
	debugger;
	if (title) {
		return getSongByTitle(title);
	} else {
		return getAllSongs();
	}
}

export async function getAllSongs() {
	try {
		const db = await openDb();
		const songs = await db.all('SELECT * FROM songs');
		return NextResponse.json({ success: true, data: songs });
	} catch (error: unknown) {
		return NextResponse.json({ success: false, error: error });
	}
}

export async function getSongByTitle(title: string) {
	try {
		const db = await openDb();
		const song = await db.get('SELECT * FROM songs WHERE title = ?', [title]);
		console.log(song);
		debugger;
		return NextResponse.json({ success: true, data: song });
	} catch (error: unknown) {
		return NextResponse.json({ success: false, error: error });
	}
}

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

export async function PUT(req: NextRequest) {
	try {
		const db = await openDb();
		const body = await req.json();
		const { id, title, artist } = body;
		await db.run('UPDATE songs SET title = ?, artist = ? WHERE id = ?', [
			title,
			artist,
			id,
		]);
		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		return NextResponse.json({ success: false, error: error });
	}
}

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

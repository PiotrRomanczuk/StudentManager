import {  NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/clients/server';

/**
 * GET /api/songs
 * Fetches all songs or a specific song by title.
 *
 * Response:
 * - success: boolean
 * - data: array of songs or a single song object
 */

export async function GET() {
	const supabase = await createClient();

	const { data, error } = await supabase.from('songs').select('*');

	if (error) {
		console.log(error);
		return NextResponse.json({ success: false, error: error.message });
	}
	return NextResponse.json({ success: true, data: data });
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
 *
 * export async function POST(req: NextRequest) {
 *
 * }
 */

export async function POST() {
	const supabase = await createClient();

	const { data, error } = await supabase.from('songs').insert({
		title: 'Test Song',
		author: 'Test Author',
		level: 'Test Level',
		songKey: 'Test Key',
		chords: 'Test Chords',
		audioFiles: 'Test Audio Files',
		createdAt: 'Test Created At',
		ultimateGuitarLink: 'Test Ultimate Guitar Link',
		shortTitle: 'Test Short Title',
	});

	if (error) {
		console.log(error);
		return NextResponse.json({ success: false, error: error.message });
	}

	return NextResponse.json({ success: true, data: data });
}

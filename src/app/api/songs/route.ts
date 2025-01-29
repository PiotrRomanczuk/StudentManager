import { NextResponse } from 'next/server';

// import type { NextRequest } from 'next/server';
// import { createGuid } from '@/utils/createGuid';

// import { z } from 'zod';
// import { APIError } from '@/utils/api-helpers';
// import { songInputSchema } from '../../../types/songInputSchema';
import { createClient } from '@supabase/supabase-js';
import { Create_Supabase_Env } from '@/utils/supabase/Create_Supabase_Env';

const { supabaseUrl, supabaseAnonKey } = Create_Supabase_Env();

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * GET /api/songs
 * Fetches all songs or a specific song by title.
 *
 * Response:
 * - success: boolean
 * - data: array of songs or a single song object
 */

export async function GET() {
	try {
		const { data: songs, error } = await supabase.from('songs').select('*');

		if (error) {
			console.log(error);
			return NextResponse.json({ success: false, error: error.message });
		}

		if (!songs || songs.length === 0) {
			return NextResponse.json({ success: false, error: 'No songs found' });
		}

		return NextResponse.json({ success: true, data: songs });
	} catch (error: unknown) {
		console.log(error);
		return NextResponse.json({
			success: false,
			error: 'Internal server error',
		});
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
 *
 * export async function POST(req: NextRequest) {
 *
 * }
 */

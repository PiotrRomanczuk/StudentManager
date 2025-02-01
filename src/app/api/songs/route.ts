import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');
	const title = searchParams.get('title');

	if (id) {
		const { data, error } = await supabase
			.from('songs')
			.select('*')
			.eq('id', id);

		if (error) {
			console.log(error);
			return NextResponse.json({ success: false, error: error.message });
		}
		return NextResponse.json({ success: true, data: data });
	}

	if (title) {
		const { data, error } = await supabase
			.from('songs')
			.select('*')
			.ilike('title', `%${title}%`);

		if (error) {
			console.log(error);
			return NextResponse.json({ success: false, error: error.message });
		}
		return NextResponse.json({ success: true, data: data });
	}

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

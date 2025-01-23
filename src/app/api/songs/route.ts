import { NextResponse } from 'next/server';

// import type { NextRequest } from 'next/server';
// import { createGuid } from '@/utils/createGuid';

// import { z } from 'zod';
// import { APIError } from '@/utils/api-helpers';
// import { songInputSchema } from '../../../types/songInputSchema';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log({ supabaseUrl, supabaseAnonKey });

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
		console.log(supabase);
		const { data, error } = await supabase.from('songs').select('*');
		console.log({ data, error });

		if (error) {
			console.log(error);
			return NextResponse.json({ success: false, error: error.message });
		}

		// if (!songs || songs.length === 0) {
		// 	return NextResponse.json({ success: false, error: 'No songs found' });
		// }

		return NextResponse.json({ success: true, data: data });
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
//  */
// export async function POST(req: NextRequest) {
// 	try {
// 		const body = await req.json();
// 		const validatedData = songInputSchema.parse(body);

// 		// const db = await getDb();
// 		const contentType = req.headers.get('content-type') || '';
// 		console.log(contentType);
// 		if (contentType.includes('application/json')) {
// 			const {
// 				Title,
// 				Author,
// 				Level,
// 				SongKey,
// 				Chords,
// 				AudioFiles,
// 				UltimateGuitarLink,
// 				ShortTitle,
// 			} = validatedData;

// 			const Id = createGuid();
// 			const CreatedAt = new Date().toISOString();
// 			console.log({
// 				Id,
// 				Title,
// 				Author,
// 				Level,
// 				SongKey,
// 				Chords,
// 				AudioFiles,
// 				UltimateGuitarLink,
// 				ShortTitle,
// 				CreatedAt,
// 			});

// 			const result = await db.run(
// 				`INSERT INTO songs (id, title, author, level, songKey, chords, audioFiles, createdAt, ultimateGuitarLink, shortTitle)
// 				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
// 				[
// 					Id,
// 					Title,
// 					Author,
// 					Level,
// 					SongKey,
// 					Chords,
// 					AudioFiles,
// 					UltimateGuitarLink,
// 					ShortTitle,
// 				]
// 			);
// 			console.log(result);
// 			return NextResponse.json({ success: true, data: { id: result.lastID } });
// 		} else if (contentType.includes('multipart/form-data')) {
// 			// const formData = await req.formData();
// 			// const file = formData.get('file');
// 			// Handle file import logic here
// 			return NextResponse.json({ success: true });
// 		}
// 	} catch (error) {
// 		if (error instanceof z.ZodError) {
// 			return NextResponse.json(
// 				{ error: 'Validation error', details: error.errors },
// 				{ status: 400 }
// 			);
// 		}

// 		if (error instanceof APIError) {
// 			return NextResponse.json(
// 				{ error: error.message },
// 				{ status: error.status }
// 			);
// 		}

// 		return NextResponse.json(
// 			{ error: 'Internal server error' },
// 			{ status: 500 }
// 		);
// 	}
// }

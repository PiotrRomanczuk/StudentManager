import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/clients/server';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	// Debug request headers and cookies
	console.log(
		'[user-songs][DEBUG] Request headers:',
		Object.fromEntries(req.headers.entries())
	);
	try {
		const cookieHeader = req.headers.get('cookie');
		if (cookieHeader) {
			const cookies = Object.fromEntries(
				cookieHeader.split(';').map((c) => {
					const [k, ...v] = c.trim().split('=');
					return [k, v.join('=')];
				})
			);
			console.log('[user-songs][DEBUG] Cookies:', cookies);
		} else {
			console.log('[user-songs][DEBUG] No cookies present in request.');
		}
	} catch (e) {
		console.log('[user-songs][DEBUG] Error parsing cookies:', e);
	}
	const userId = searchParams.get('userId');
	// Pagination and filter params
	const page = parseInt(searchParams.get('page') || '1', 10);
	const limit = parseInt(searchParams.get('limit') || '50', 10);
	const search = searchParams.get('search') || undefined;
	const level = searchParams.get('level') || undefined;
	const key = searchParams.get('key') || undefined;
	const author = searchParams.get('author') || undefined;
	const sortBy = searchParams.get('sortBy') || undefined;
	const sortOrder = searchParams.get('sortOrder') || 'asc';

	console.log('[user-songs][DEBUG] Query params:', {
		userId,
		page,
		limit,
		search,
		level,
		key,
		author,
		sortBy,
		sortOrder,
	});

	const supabase = await createClient();

	// Helper to build filter for songs
	function applySongFilters(query: ReturnType<typeof supabase.from>) {
		if (search) {
			query = query.ilike('title', `%${search}%`);
			console.log('[user-songs][DEBUG] Applying search filter:', search);
		}
		if (level) {
			query = query.eq('level', level);
			console.log('[user-songs][DEBUG] Applying level filter:', level);
		}
		if (key) {
			query = query.eq('key', key);
			console.log('[user-songs][DEBUG] Applying key filter:', key);
		}
		if (author) {
			query = query.eq('author', author);
			console.log('[user-songs][DEBUG] Applying author filter:', author);
		}
		return query;
	}

<<<<<<< HEAD
	if (userId) {
		console.log('[user-songs][DEBUG] Fetching lessons for userId:', userId);
		// 1. Find lessons where user is student or teacher
		const { data: lessons, error: lessonsError } = await supabase
			.from('lessons')
			.select('id')
			.or(`student_id.eq.${userId},teacher_id.eq.${userId}`);
		console.log('[user-songs][DEBUG] lessons result:', lessons, lessonsError);
		if (lessonsError) {
			return NextResponse.json(
				{ error: 'Error fetching lessons' },
				{ status: 500 }
			);
		}
		if (!lessons || lessons.length === 0) {
			console.log('[user-songs][DEBUG] No lessons found for user.');
			return NextResponse.json({
				songs: [],
				pagination: {
					page,
					limit,
					total: 0,
					totalPages: 0,
				},
			});
		}
		const lessonIds = lessons.map((lesson: { id: string }) => lesson.id);
		console.log('[user-songs][DEBUG] lessonIds:', lessonIds);
=======
  // Helper to build filter for songs
  function applySongFilters<T extends ReturnType<typeof supabase.from>>(query: T): T {
    if (search) {
      query = query.ilike("title", `%${search}%`);
      console.log("[user-songs][DEBUG] Applying search filter:", search);
    }
    if (level) {
      query = query.eq("level", level);
      console.log("[user-songs][DEBUG] Applying level filter:", level);
    }
    if (key) {
      query = query.eq("key", key);
      console.log("[user-songs][DEBUG] Applying key filter:", key);
    }
    if (author) {
      query = query.eq("author", author);
      console.log("[user-songs][DEBUG] Applying author filter:", author);
    }
    return query;
  }
>>>>>>> 85d92d8bda768ff9e1ebf90e6ab781f42971ca9e

		// 2. Get lesson_songs for those lessons
		const { data: lessonSongs, error: lessonSongsError } = await supabase
			.from('lesson_songs')
			.select('song_id, song_status')
			.in('lesson_id', lessonIds);
		console.log(
			'[user-songs][DEBUG] lessonSongs result:',
			lessonSongs,
			lessonSongsError
		);
		if (lessonSongsError) {
			return NextResponse.json(
				{ error: 'Error fetching lesson songs' },
				{ status: 500 }
			);
		}
		if (!lessonSongs || lessonSongs.length === 0) {
			console.log('[user-songs][DEBUG] No lessonSongs found for lessons.');
			return NextResponse.json({
				songs: [],
				pagination: {
					page,
					limit,
					total: 0,
					totalPages: 0,
				},
			});
		}
		const songIdToStatus = lessonSongs.reduce(
			(
				acc: Record<string, string>,
				ls: { song_id: string; song_status: string }
			) => {
				acc[ls.song_id] = ls.song_status;
				return acc;
			},
			{}
		);
		const songIds = lessonSongs.map((ls: { song_id: string }) => ls.song_id);
		console.log('[user-songs][DEBUG] songIds:', songIds);

		// 3. Get songs for those songIds, with filters, pagination, and sorting
		let query = supabase
			.from('songs')
			.select('*', { count: 'exact' })
			.in('id', songIds);
		query = applySongFilters(query);
		if (sortBy) {
			console.log('[user-songs][DEBUG] Applying sort:', sortBy, sortOrder);
			query = query.order(sortBy, { ascending: sortOrder === 'asc' });
		}
		query = query.range((page - 1) * limit, page * limit - 1);
		console.log('[user-songs][DEBUG] Final query for user songs ready');

		const { data: songs, error: songsError, count } = await query;
		console.log('[user-songs][DEBUG] songs result:', songs, songsError, count);
		if (songsError) {
			return NextResponse.json(
				{ error: 'Error fetching user songs' },
				{ status: 500 }
			);
		}
		const songsWithStatus = songs.map((song: Record<string, unknown>) => ({
			...song,
			status: songIdToStatus[(song as { id: string }).id] || null,
		}));
		console.log('[user-songs][DEBUG] songsWithStatus:', songsWithStatus);
		const totalPages = Math.ceil((count || 0) / limit);
		return NextResponse.json({
			songs: songsWithStatus,
			pagination: {
				page,
				limit,
				total: count || 0,
				totalPages,
			},
		});
	} else {
		console.log('[user-songs][DEBUG] Fetching all songs (no userId)');
		// All songs, with filters, pagination, and sorting
		let query = supabase.from('songs').select('*', { count: 'exact' });
		query = applySongFilters(query);
		if (sortBy) {
			console.log('[user-songs][DEBUG] Applying sort:', sortBy, sortOrder);
			query = query.order(sortBy, { ascending: sortOrder === 'asc' });
		}
		query = query.range((page - 1) * limit, page * limit - 1);
		console.log('[user-songs][DEBUG] Final query for all songs ready');

		const { data: allSongs, error, count } = await query;
		console.log('[user-songs][DEBUG] allSongs result:', allSongs, error, count);
		if (error) {
			return NextResponse.json(
				{ error: 'Error fetching songs' },
				{ status: 500 }
			);
		}
		const totalPages = Math.ceil((count || 0) / limit);
		return NextResponse.json({
			songs: allSongs,
			pagination: {
				page,
				limit,
				total: count || 0,
				totalPages,
			},
		});
	}
}

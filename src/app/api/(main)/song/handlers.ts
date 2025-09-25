// Pure functions for song API business logic - testable without Next.js dependencies

import { Song } from "@/types/Song";

export interface SongQueryParams {
  level?: string;
  key?: string;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface SongResponse {
  songs: Song[];
  count?: number;
}

export interface SongError {
  error: string;
  status: number;
}

export type SongResult = SongResponse | SongError;

export async function getSongsHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  user: { id: string } | null,
  profile: { isAdmin?: boolean } | null,
  query: SongQueryParams
): Promise<SongResult> {
  if (!user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // If no profile exists, treat as non-admin user

  const {
    level,
    key,
    author,
    search,
    page = 1,
    limit = 50,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = query;

  // Validate sortBy field
  const validSortFields = ['created_at', 'updated_at', 'title', 'author', 'level', 'key'];
  const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';

  let dbQuery = supabase.from('songs').select('*', { count: 'exact' });
  // Removed userId filter: all users see all songs, or apply other filters only
  if (level) dbQuery = dbQuery.eq('level', level);
  if (key) dbQuery = dbQuery.eq('key', key);
  if (author) dbQuery = dbQuery.eq('author', author);
  if (search) dbQuery = dbQuery.ilike('title', `%${search}%`);

  console.log('Sorting by:', validatedSortBy, 'Order:', sortOrder, 'Page:', page, 'Limit:', limit);
  console.log('Range:', (page - 1) * limit, 'to', page * limit - 1);
  
  // Apply the actual sorting parameters
  const ascending = sortOrder === 'asc';
  dbQuery = dbQuery.order(validatedSortBy, { ascending });
  dbQuery = dbQuery.range((page - 1) * limit, page * limit - 1);

  const { data: songs, error, count } = await dbQuery;
  
  if (songs && songs.length > 0) {
    console.log('First song:', songs[0].title, 'created_at:', songs[0].created_at);
    console.log('Last song:', songs[songs.length - 1].title, 'created_at:', songs[songs.length - 1].created_at);
    console.log('Total songs returned:', songs.length);
    console.log('Expected range:', (page - 1) * limit + 1, 'to', page * limit);
  }

  if (error) {
    return { error: error.message, status: 500 };
  }

  return { songs, count, status: 200 };
} 
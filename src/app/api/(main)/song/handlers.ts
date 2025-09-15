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
  count: number;
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

  const isAdmin = profile?.isAdmin || false;

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

  // Normalize sort order
  const normalizedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';
  const ascending = normalizedSortOrder === 'asc';

  let dbQuery = supabase.from('songs').select('*', { count: 'exact' });

  // TODO: confirm the column name for user reference in songs table is 'userId' or 'user_id'
  if (!isAdmin) {
    dbQuery = dbQuery.eq('userId', user.id);
  }
  if (level) dbQuery = dbQuery.eq('level', level);
  if (key) dbQuery = dbQuery.eq('key', key);
  if (author) dbQuery = dbQuery.eq('author', author);
  if (search) dbQuery = dbQuery.ilike('title', `%${search}%`);

  dbQuery = dbQuery.order(validatedSortBy, { ascending });

  // Range calculation moved to route via clamped values; fallback here if provided
  const from = (page - 1) * limit;
  const to = page * limit - 1;
  dbQuery = dbQuery.range(from, to);

  const { data: songs, error, count } = await dbQuery;

  if (error) {
    return { error: error.message, status: 500 };
  }

  return { songs: songs ?? [], count: count ?? 0 };
}
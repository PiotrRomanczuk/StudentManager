// Pure functions for song API business logic - testable without Next.js dependencies

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
  songs: any[];
  count?: number;
}

export interface SongError {
  error: string;
  status: number;
}

export type SongResult = SongResponse | SongError;

export async function getSongsHandler(
  supabase: any,
  user: any,
  profile: any,
  query: SongQueryParams
): Promise<SongResult> {
  if (!user) {
    return { error: 'Unauthorized', status: 401 };
  }

  if (!profile) {
    return { error: 'Forbidden', status: 403 };
  }

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

  let dbQuery = supabase.from('songs').select('*', { count: 'exact' });

  if (!profile.isAdmin) {
    dbQuery = dbQuery.eq('userId', user.id);
  }
  if (level) dbQuery = dbQuery.eq('level', level);
  if (key) dbQuery = dbQuery.eq('key', key);
  if (author) dbQuery = dbQuery.eq('author', author);
  if (search) dbQuery = dbQuery.ilike('title', `%${search}%`);

  dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });
  dbQuery = dbQuery.range((page - 1) * limit, page * limit - 1);

  const { data: songs, error, count } = await dbQuery;

  if (error) {
    return { error: error.message, status: 500 };
  }

  return { songs, count, status: 200 };
} 
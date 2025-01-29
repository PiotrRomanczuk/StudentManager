import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Create_Supabase_Env } from './Create_Supabase_Env';

export async function createClient(): Promise<
	ReturnType<typeof createServerClient>
> {
	const cookieStore = await cookies();
	const { supabaseUrl, supabaseAnonKey } = Create_Supabase_Env();
	return createServerClient(supabaseUrl!, supabaseAnonKey!, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options)
					);
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
	});
}

import { createBrowserClient } from '@supabase/ssr';
import { Create_Supabase_Env } from '../Create_Supabase_Env';

export const createClient = () => {
	const { supabaseUrl, supabaseAnonKey } = Create_Supabase_Env();
	return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
};

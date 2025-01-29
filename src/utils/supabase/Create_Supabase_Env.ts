export const Create_Supabase_Env = () => {
	let supabaseUrl: string | undefined;
	let supabaseAnonKey: string | undefined;

	if (process.env.NODE_ENV === 'development') {
		supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	} else {
		supabaseUrl = process.env.SUPABASE_URL;
		supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
	}
	return { supabaseUrl, supabaseAnonKey };
};

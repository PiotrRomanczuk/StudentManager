import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET ?? '',
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
		}),
	],
	adapter: SupabaseAdapter({
		url: process.env.SUPABASE_URL ?? '',
		secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
	}),
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

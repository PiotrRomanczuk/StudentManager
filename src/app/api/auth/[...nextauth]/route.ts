import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// import CredentialsProvider from "next-auth/providers/credentials"

// import { NextRequest, NextResponse } from "next/server"

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
		}),
	],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// export default async function auth(req:NextRequest, res: NextResponse) {
//   const providers = [
//     CredentialsProvider(...),
//     GoogleProvider(...),
//   ]

//   const isDefaultSigninPage = req.method === "GET" && req.query.nextauth.includes("signin")

//   // Will hide the `GoogleProvider` when you visit `/api/auth/signin`
//   if (isDefaultSigninPage) providers.pop()

//   return await NextAuth(req, res, {
//     providers,
//     ...
//   })
// }

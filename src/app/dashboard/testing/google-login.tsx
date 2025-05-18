import oAuth2Client from '@/utils/google/google-auth';
// import { google } from 'googleapis';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function GoogleLogin() {
	const SCOPE = ['https://www.googleapis.com/auth/drive.readonly'];
	const cookieStore = await cookies();
	const code = cookieStore.get('code')?.value;

	let tokens;
	if (code) {
		try {
			tokens = await oAuth2Client.getToken(code);
			// Store the tokens in cookies or your preferred storage method
			// Note: In a production environment, you should use secure HTTP-only cookies
			// and implement proper token refresh logic
			console.log('Successfully obtained tokens:', tokens);
		} catch (error) {
			console.error('Error exchanging code for tokens:', error);
		}
	}

	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPE,
	});

	const googleAccessToken = cookieStore.get('google_access_token')?.value;
	return (
		<>
			<div>
				Testing
				<Link href={authUrl}>Login with Google</Link>
			</div>
			<div>
				<p>Google Access Token: {googleAccessToken}</p>
			</div>
		</>
	);
}

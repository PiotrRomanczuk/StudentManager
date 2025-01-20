'use client';

import GoogleButton from 'react-google-button';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function Home() {
	const { data: session, status } = useSession();
	if (status === 'authenticated' && session?.user?.email) {
		return <p>Signed in as {session.user.email}</p>;
	}

	return (
		<div className='flex flex-col items-center mt-16 h-screen'>
			<h2 className='text-4xl color-blue'>Hello world!</h2>
			{/* redirect to <a href='/dashboard'>Songs</a> */}
			return <a href='/api/auth/signin'>Sign in</a>
			<GoogleButton
				className='mx-auto mt-16'
				onClick={() => signIn('google')}
			/>
		</div>
	);
}

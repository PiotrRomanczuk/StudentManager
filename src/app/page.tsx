'use client';

import GoogleButton from 'react-google-button';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
	const { data: session, status } = useSession();
	if (status === 'authenticated' && session?.user?.email) {
		return <p>Signed in as {session.user.email}</p>;
	}

	return (
		<div className='flex flex-col items-center mt-16 h-screen'>
			<h2 className='text-4xl color-blue'>Hello world!</h2>
			<Link href='/api/auth/signin'>Sign in</Link>
			<GoogleButton
				className='mx-auto mt-16'
				onClick={() => signIn('google')}
			/>
		</div>
	);
}

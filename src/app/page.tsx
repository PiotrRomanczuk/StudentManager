'use client';

import GoogleButton from 'react-google-button';
import { signIn } from 'next-auth/react';

export default function Home() {
	return (
		<div className='flex flex-col items-center mt-16 h-screen'>
			<h2 className='text-4xl color-blue'>Hello world!</h2>

			{/* redirect to <a href='/dashboard'>Songs</a> */}

			<GoogleButton
				className='mx-auto mt-16'
				onClick={() => signIn('google')}
			/>
		</div>
	);
}

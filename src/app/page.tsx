import { auth } from '@clerk/nextjs/server';
export default async function Home() {
	const { userId } = await auth();
	return (
		<div>
			<h2 className='text-4xl color-blue'>Hello world!</h2>
			{userId}
			redirect to <a href='/songs'>Songs</a>
		</div>
	);
}

import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
	try {
		const client = await clerkClient();

		const user = await client.users.createUser({
			emailAddress: ['test@example.com'],
			password: 'password',
		});
		return NextResponse.json({ message: 'User created', user });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: 'Error creating user' });
	}
}

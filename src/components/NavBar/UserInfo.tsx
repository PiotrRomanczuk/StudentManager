'use client';

import { useSession } from 'next-auth/react';

const UserInfo = () => {
	const { data: session, status } = useSession();
	if (status === 'authenticated' && session?.user?.email) {
		return <p>Signed in as {session.user.email}</p>;
	}
};

export default UserInfo;

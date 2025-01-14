'use client';

import { useUser } from '@clerk/clerk-react';

const UserInfo = () => {
	const { user } = useUser();
	if (user) {
		return <div>{user.fullName}</div>; // Render a specific property of the user object
	}
};

export default UserInfo;

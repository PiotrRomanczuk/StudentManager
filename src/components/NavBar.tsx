import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

const NavBar: React.FC = async () => {
	const { userId } = await auth();
	return (
		<nav className='py-2 px-3 mx-0 bg-black text-white '>
			<ClerkProvider>
				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
				<div className='flex justify-between items-center'>
					<h6 className='text-lg'>Songs API</h6>
					<div>
						<span className='mr-2'>Welcome, {userId}</span>
					</div>
				</div>
			</ClerkProvider>
		</nav>
	);
};

<header></header>;
export default NavBar;

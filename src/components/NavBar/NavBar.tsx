import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from '@clerk/nextjs';
import UserInfo from './UserInfo';

const NavBar: React.FC = async () => {
	return (
		<ClerkProvider>
			<nav className='py-2 px-3 mx-0 bg-black text-white '>
				<SignedOut>
					<SignInButton />
				</SignedOut>

				<div className='flex justify-between items-center'>
					<h6 className='text-lg'>Songs Manager</h6>
					<div className='flex items-center gap-4'>
						<UserInfo />
						<SignedIn>
							<UserButton />
						</SignedIn>
					</div>
				</div>
			</nav>
		</ClerkProvider>
	);
};
export default NavBar;

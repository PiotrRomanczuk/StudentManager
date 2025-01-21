import UserInfo from './UserInfo';

const NavBar: React.FC = async () => {
	return (
		<nav className='py-2 px-3 mx-0 bg-black text-white '>
			<div className='flex justify-between items-center'>
				<h6 className='text-lg'>Songs Manager</h6>
				<div className='flex items-center gap-4'>
					<UserInfo />
				</div>
			</div>
		</nav>
	);
};
export default NavBar;

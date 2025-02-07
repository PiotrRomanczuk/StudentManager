import { login, signInWithGoogle, signup } from './actions';

export default function LoginPage() {
	return (
		<div className='flex justify-center items-center h-screen'>
			<form className='flex flex-col space-y-4 p-4 bg-white rounded shadow-md'>
				<label htmlFor='email' className='text-gray-700'>
					Email:
				</label>
				<input
					id='email'
					name='email'
					type='email'
					// required
					className='p-2 border border-gray-300 rounded'
				/>
				<label htmlFor='password' className='text-gray-700'>
					Password:
				</label>
				<input
					id='password'
					name='password'
					// type='password'
					// required
					className='p-2 border border-gray-300 rounded'
				/>
				<button
					formAction={login}
					className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
				>
					Log in
				</button>
				<button
					formAction={signup}
					className='bg-green-500 text-white p-2 rounded hover:bg-green-600'
				>
					Sign up
				</button>
				<button
					formAction={signInWithGoogle}
					className='bg-red-500 text-white p-2 rounded hover:bg-red-600'
				>
					Sign in with Google
				</button>
			</form>
		</div>

	);
}

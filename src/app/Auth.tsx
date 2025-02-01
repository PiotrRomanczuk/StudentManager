import { useState } from 'react';
import { createClient } from '@/utils/supabase/clients/client';

export default function Auth() {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		const supabase = await createClient();
		const { error } = await supabase.auth.signInWithOtp({ email });

		if (error) {
			alert(error);
		} else {
			alert('Check your email for the login link!');
		}
		setLoading(false);
	};

	const handleGoogleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		const supabase = await createClient();
		const { error } = await supabase.auth.signInWithOtp();

		if (error) {
			alert(error);
		} else {
			alert('Check your email for the login link!');
		}
		setLoading(false);
	};

	return (
		<div className='row flex flex-center'>
			<div className='col-6 form-widget'>
				<h1 className='header'>Supabase + React</h1>
				<p className='description'>
					Sign in via magic link with your email below
				</p>
				<form className='form-widget' onSubmit={handleLogin}>
					<div>
						<input
							className='inputField'
							type='email'
							placeholder='Your email'
							value={email}
							required={true}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<button className={'button block'} disabled={loading}>
							{loading ? <span>Loading</span> : <span>Send magic link</span>}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

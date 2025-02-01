'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/clients/server';

export async function login(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const dataForm = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	};

	const { data, error } = await supabase.auth.signInWithPassword(dataForm);

	console.log(data);
	if (error) {
		console.log(error);
		redirect('/error');
	}

	revalidatePath('/', 'layout');
	redirect('/dashboard');
}

export async function signup(formData: FormData) {
	const supabase = await createClient();

	// console.log(supabase);

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	};

	const { user, error: signupError } = await supabase.auth.signUp({
		email: data.email,
		password: data.password,
	});

	console.log(user);

	if (signupError) {
		console.error('Error creating user:', signupError);
	} else {
		// Step 2: Retrieve the user ID

		const userId = user.id;

		// Step 3: Insert profile information

		const { data, error: profileError } = await supabase.from('user_').insert([
			{ user_id: userId, user_type: 'student' },
			// or 'teacher'
		]);
		if (profileError) {
			console.error('Error creating user profile:', profileError);
		} else {
			console.log('User profile created successfully:', data);
		}
	}
}

export async function logout() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect('/login');
}

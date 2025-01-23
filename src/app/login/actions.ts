'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

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
	redirect('/');
}

export async function signup(formData: FormData) {
	const supabase = await createClient();

	console.log(supabase);

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	};

	console.log(data);

	const { error } = await supabase.auth.signUp(data);

	console.log(error);
	if (error) {
		redirect('/error');
	}

	console.log('revalidating');
	revalidatePath('/', 'layout');
	console.log('redirecting');
	redirect('/');
}

export async function logout() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect('/login');
}

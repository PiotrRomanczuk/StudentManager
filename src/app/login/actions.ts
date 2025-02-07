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

	console.log(dataForm);

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

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { data: { user }, error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });

    console.log(user);

    if (signupError) {
        console.error('Error creating user:', signupError);
    } else if (user) {
        // Step 2: Retrieve the user ID
        const userId = user.id;

        // Step 3: Insert profile information
        const { data, error: profileError } = await supabase.from('user_').insert([
            { user_id: userId, user_type: 'student' },
        ]);

        if (profileError) {
            console.error('Error creating user profile:', profileError);
        } else {
            console.log('User profile created successfully:', data);
        }
    }
}

export async function signInWithGoogle() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: 'http://localhost:3000/api/auth/callback',
		},
	});

	console.log(data);

	  if (data.url) {
		redirect(data.url) // use the redirect API for your server framework
	  }
}

export async function logout() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect('/login');
}


"use server";

import { createClient } from "@/utils/supabase/clients/server";
// import { redirect } from "next/navigation";

import { validateSignUpForm } from "@/lib/auth-validation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Validate form data
  const data = validateSignUpForm(formData);

  const {
    data: { user },
    error: signupError,
  } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signupError) {
    throw new Error(signupError.message || "Error creating user");
  }

  if (user) {
    // Step 2: Retrieve the user ID
    const userId = user.id;

    // Step 3: Insert profile information
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          user_id: userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          isStudent: true,
          isTeacher: false,
          isAdmin: false,
        },
      ]);

    if (profileError) {
      throw new Error(profileError.message || "Error creating user profile");
    } else {
      return { success: true };
    }
  }

  throw new Error("Unknown error occurred");
}

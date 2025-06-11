"use server";

import { createClient } from "@/utils/supabase/clients/server";
// import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
  };

  const {
    data: { user },
    error: signupError,
  } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signupError) {
    throw new Error("Error creating user:" + signupError);
  }

  if (user) {
    // Step 2: Retrieve the user ID
    const userId = user.id;

    // Step 3: Insert profile information
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ 
        user_id: userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        isStudent: true,
        isTeacher: false,
        isAdmin: false
      }]);

    if (profileError) {
      throw new Error("Error creating user profile:" + profileError);
    } else {
      return { success: true };
    }
  }

  throw new Error("Unknown error occurred");
}

"use server";

import { createClient } from "@/utils/supabase/clients/server";
// import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const {
    data: { user },
    error: signupError,
  } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signupError) {
    console.error("Error creating user:", signupError);
    return { error: signupError.message };
  }

  if (user) {
    // Step 2: Retrieve the user ID
    const userId = user.id;

    // Step 3: Insert profile information
    const { data, error: profileError } = await supabase
      .from("user_")
      .insert([{ user_id: userId, user_type: "student" }]);

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      return { error: profileError.message };
    } else {
      console.log("User profile created successfully:", data);
      // Optionally redirect or return success
      return { success: true };
    }
  }

  return { error: "Unknown error occurred" };
}

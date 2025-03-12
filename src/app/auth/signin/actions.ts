"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/clients/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const dataForm = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(dataForm);
  if (error) {
    throw new Error("Error signing in:" + error);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signInWithGoogle() {
  console.log("signInWithGoogle function started");
  const supabase = await createClient();
  console.log("Supabase client created");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/api/auth/callback",
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    throw new Error("Error signing in with Google:" + error);
  }

  console.log("Google sign-in data:", data);

  if (data.url) {
    console.log("Redirecting to:", data.url);
    redirect(data.url);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

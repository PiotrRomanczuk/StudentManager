"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/clients/server";

import { validateSignInForm } from "@/lib/auth-validation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Validate form data
  const dataForm = validateSignInForm(formData);

  const { error } = await supabase.auth.signInWithPassword(dataForm);
  if (error) {
    console.error("Sign in error:", error);
    throw new Error(error.message || "Error signing in");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_BASE_URL;

  console.log("signInWithGoogle function started");
  const supabase = await createClient();
  console.log("Supabase client created");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google sign in error:", error);
    throw new Error(error.message || "Error signing in with Google");
  }

  console.log("Google sign-in data:", data);

  if (data.url) {
    console.log("Redirecting to dashboard");
    redirect("/dashboard");
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

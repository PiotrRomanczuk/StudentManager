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
      redirectTo: `${BASE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    throw new Error("Error signing in with Google:" + error);
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

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase.from("profiles").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ profiles });
} 
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);


  const supabase = await createClient();

  const { data, error } = await supabase
    .from("songs")
    .insert(body)
    .select()
    .single();

  if (error) {
    throw Error(error.message);
  }

  console.log(`Song created successfully:`);
  console.log(data);
  return NextResponse.json({ data }, { status: 200 });
}

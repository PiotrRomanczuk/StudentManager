// import { NextRequest } from 'next/server';

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

const supabase = createClient();

export async function GET() {
  const { data, error } = await (await supabase).from("songs").select("*");

  if (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error.message });
  }

  return NextResponse.json({ success: true, data: data });
}

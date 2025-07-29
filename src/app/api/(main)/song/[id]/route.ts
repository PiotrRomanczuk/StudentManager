import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log(`Fetching song with ID: ${id}`);

    const supabase = await createClient();
    
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log(`User not authenticated - returning 401`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: song, error } = await supabase
      .from("songs")
      .select("*")
      .eq("id", id)
      .single();

    console.log(`Supabase response - data:`, song, `error:`, error);

    if (error || !song) {
      console.log(`Song not found - returning 404`);
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    console.log(`Song found - returning data`);
    return NextResponse.json(song);
  } catch (error) {
    console.error(`Error in song API:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

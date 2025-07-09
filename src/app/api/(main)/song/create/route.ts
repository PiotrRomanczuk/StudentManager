import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";
import { songInputSchema } from "@/schemas/songInputSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();


    // Validate input
    const parseResult = songInputSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation error:", parseResult.error);
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.errors },
        { status: 400 },
      );
    }
    const validated = parseResult.data;

    // Map input fields to DB fields
    const dbSong = {
      title: validated.title,
      author: validated.author,
      level: validated.level,
      key: validated.key,
      chords: validated.chords,
      audio_files: validated.audio_files,
      ultimate_guitar_link: validated.ultimate_guitar_link,
      short_title: validated.short_title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = await createClient();
    const { data: existingSong } = await supabase
      .from("songs")
      .select("id")
      .eq("title", validated.title)
      .maybeSingle();

    if (existingSong) {
      return NextResponse.json(
        { error: "A song with this title already exists." },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("songs")
      .insert([dbSong])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      if (error.code === "23505") {
        // Unique constraint violation (duplicate title)
        return NextResponse.json(
          { error: "A song with this title already exists." },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 },
      );
    }


    return NextResponse.json({ data }, { status: 201 });
  } catch (err: unknown) {
    console.error("Unexpected error:", err);
    let errorMsg = "Failed to create song";
    
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'object' && err !== null && 'error' in err) {
      const errorData = err as { error?: string; details?: unknown };
      errorMsg = errorData.error || "Failed to create song";
      
      if (errorData.details) {
        if (Array.isArray(errorData.details)) {
          // Zod validation errors
          errorMsg += ": " + errorData.details.map((d: { message?: string }) => d.message || "Unknown error").join("; ");
        } else if (typeof errorData.details === "string") {
          errorMsg += ": " + errorData.details;
        }
      }
    }
    
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

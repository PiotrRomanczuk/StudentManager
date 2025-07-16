import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";
import { SongInputSchema, SongImportSchema, SongImportValidationSchema } from "@/schemas/SongSchema";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission
    const { data: profile } = await supabase
      .from("profiles")
      .select("isAdmin, isTeacher")
      .eq("user_id", user.id)
      .single();

    if (!profile || (!profile.isAdmin && !profile.isTeacher)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if this is a validation-only request
    const isValidationOnly = body.validate_only === true;

    // Use appropriate schema based on validation mode
    const schema = isValidationOnly ? SongImportValidationSchema : SongImportSchema;
    const parseResult = schema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid import data", details: parseResult.error },
        { status: 400 }
      );
    }

    const { songs, overwrite = false, validate_only = false } = parseResult.data;

    if (validate_only) {
      // Only validate songs without importing
      const validationResults = songs.map((song, index) => {
        const result = SongInputSchema.safeParse(song);
        return {
          index,
          valid: result.success,
          errors: result.success ? null : result.error.errors,
        };
      });

      const validCount = validationResults.filter(r => r.valid).length;
      const invalidCount = validationResults.filter(r => !r.valid).length;

      return NextResponse.json({
        validation_results: validationResults,
        summary: {
          total: songs.length,
          valid: validCount,
          invalid: invalidCount,
        },
      });
    }

    // Import songs
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const song of songs) {
      try {
        // Check if song already exists (by title)
        const { data: existingSong } = await supabase
          .from("songs")
          .select("id")
          .eq("title", song.title)
          .single();

        if (existingSong && !overwrite) {
          results.push({
            title: song.title,
            status: "skipped",
            reason: "Song already exists and overwrite is false",
          });
          continue;
        }

        if (existingSong && overwrite) {
          // Update existing song
          const { data, error } = await supabase
            .from("songs")
            .update({
              ...song,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingSong.id)
            .select()
            .single();

          if (error) {
            results.push({
              title: song.title,
              status: "error",
              error: error.message,
            });
            errorCount++;
          } else {
            results.push({
              title: song.title,
              status: "updated",
              data,
            });
            successCount++;
          }
        } else {
          // Insert new song
          const { data, error } = await supabase
            .from("songs")
            .insert(song)
            .select()
            .single();

          if (error) {
            results.push({
              title: song.title,
              status: "error",
              error: error.message,
            });
            errorCount++;
          } else {
            results.push({
              title: song.title,
              status: "created",
              data,
            });
            successCount++;
          }
        }
      } catch {
        results.push({
          title: song.title,
          status: "error",
          error: "Unexpected error during import",
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      results,
      summary: {
        total: songs.length,
        success: successCount,
        error: errorCount,
      },
    });
  } catch (error) {
    console.error("Error in bulk song import API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songIds = searchParams.get("ids");

    if (!songIds) {
      return NextResponse.json(
        { error: "Song IDs are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ids = songIds.split(",");
    const { error } = await supabase
      .from("songs")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Error deleting songs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      deleted_count: ids.length,
    });
  } catch (error) {
    console.error("Error in bulk song delete API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
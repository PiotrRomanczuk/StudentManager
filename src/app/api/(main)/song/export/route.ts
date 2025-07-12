import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";
import { SongExportSchema } from "@/schemas/SongSchema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse export parameters
    const format = searchParams.get("format") || "json";
    const level = searchParams.get("level");
    const key = searchParams.get("key");
    const author = searchParams.get("author");
    const includeLessons = searchParams.get("includeLessons") === "true";
    const includeAudioUrls = searchParams.get("includeAudioUrls") === "true";

    // Validate export parameters
    const exportParams = {
      format: format as "json" | "csv" | "pdf",
      filters: {
        level: level || undefined,
        key: key || undefined,
        author: author || undefined,
      },
      include_lessons: includeLessons,
      include_audio_urls: includeAudioUrls,
    };

    const parseResult = SongExportSchema.safeParse(exportParams);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid export parameters", details: parseResult.error },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase.from("songs").select("*");

    // Apply filters
    if (level) query = query.eq("level", level);
    if (key) query = query.eq("key", key);
    if (author) query = query.ilike("author", `%${author}%`);

    // Execute query
    const { data: songs, error } = await query.order("title", { ascending: true });

    if (error) {
      console.error("Error fetching songs for export:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Process songs based on format
    let exportData: any;
    let contentType: string;
    let filename: string;

    switch (format) {
      case "json":
        exportData = JSON.stringify(songs, null, 2);
        contentType = "application/json";
        filename = "songs.json";
        break;

      case "csv":
        const csvHeaders = ["title", "author", "level", "key", "chords", "ultimate_guitar_link", "created_at"];
        const csvData = songs?.map((song: any) => 
          csvHeaders.map(header => {
            const value = song[header as keyof typeof song];
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
          }).join(',')
        ) || [];
        
        exportData = [csvHeaders.join(','), ...csvData].join('\n');
        contentType = "text/csv";
        filename = "songs.csv";
        break;

      case "pdf":
        // For PDF, we'll return a JSON response with the data
        // The frontend can handle PDF generation
        exportData = JSON.stringify({
          songs,
          metadata: {
            total: songs?.length || 0,
            exported_at: new Date().toISOString(),
            filters: exportParams.filters,
          },
        });
        contentType = "application/json";
        filename = "songs.pdf";
        break;

      default:
        return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
    }

    // Return the export data
    return new NextResponse(exportData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in song export API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { LessonStatusEnum } from "@/schemas";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const format = searchParams.get("format") || "json";
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const includeSongs = searchParams.get("includeSongs") === "true";
    const includeProfiles = searchParams.get("includeProfiles") === "true";

    // Build query
    let query = supabase
      .from("lessons")
      .select(`
        *,
        ${includeProfiles ? 'profile:profiles!lessons_student_id_fkey(email, firstName, lastName),' : ''}
        ${includeProfiles ? 'teacher_profile:profiles!lessons_teacher_id_fkey(email, firstName, lastName),' : ''}
        ${includeSongs ? 'lesson_songs(song_id, song_status, songs(title, author, level, key))' : ''}
      `);

    if (userId) {
      query = query.or(`student_id.eq.${userId},teacher_id.eq.${userId}`);
    }

    if (status) {
      try {
        LessonStatusEnum.parse(status.toUpperCase());
        query = query.eq("status", status.toUpperCase());
      } catch {
        return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
      }
    }

    if (dateFrom) {
      query = query.gte("date", dateFrom);
    }

    if (dateTo) {
      query = query.lte("date", dateTo);
    }

    query = query.order("created_at", { ascending: false });

    const { data: lessons, error } = await query;

    if (error) {
      console.error("Error fetching lessons for export:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Process data based on format
    let exportData;
    let contentType;
    let filename;

    switch (format.toLowerCase()) {
      case "json":
        exportData = JSON.stringify({
          exportDate: new Date().toISOString(),
          totalLessons: lessons?.length || 0,
          filters: {
            userId,
            status,
            dateFrom,
            dateTo,
            includeSongs,
            includeProfiles
          },
          lessons: lessons || []
        }, null, 2);
        contentType = "application/json";
        filename = `lessons_export_${new Date().toISOString().split('T')[0]}.json`;
        break;

      case "csv":
        if (!lessons || lessons.length === 0) {
          exportData = "No lessons found";
        } else {
          const headers = [
            "ID",
            "Title",
            "Student ID",
            "Teacher ID",
            "Date",
            "Time",
            "Status",
            "Notes",
            "Created At",
            "Updated At"
          ];

          if (includeProfiles) {
            headers.push("Student Email", "Student Name", "Teacher Email", "Teacher Name");
          }

          if (includeSongs) {
            headers.push("Songs Count");
          }

          const csvRows = [headers.join(",")];

          for (const lesson of lessons) {
            const row = [
              lesson.id,
              `"${lesson.title || ""}"`,
              lesson.student_id,
              lesson.teacher_id,
              lesson.date || "",
              lesson.time || "",
              lesson.status,
              `"${lesson.notes || ""}"`,
              lesson.created_at,
              lesson.updated_at
            ];

            if (includeProfiles) {
              row.push(
                `"${lesson.profile?.email || ""}"`,
                `"${lesson.profile?.firstName || ""} ${lesson.profile?.lastName || ""}"`,
                `"${lesson.teacher_profile?.email || ""}"`,
                `"${lesson.teacher_profile?.firstName || ""} ${lesson.teacher_profile?.lastName || ""}"`
              );
            }

            if (includeSongs) {
              row.push(lesson.lesson_songs?.length || 0);
            }

            csvRows.push(row.join(","));
          }

          exportData = csvRows.join("\n");
        }
        contentType = "text/csv";
        filename = `lessons_export_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      default:
        return NextResponse.json({ error: "Unsupported export format" }, { status: 400 });
    }

    // Return the export data
    return new NextResponse(exportData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache"
      }
    });

  } catch (error) {
    console.error("Error in lesson export API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
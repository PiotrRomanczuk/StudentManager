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

    const userId = searchParams.get("userId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build base query
    let baseQuery = supabase.from("lessons").select("*");

    if (userId) {
      baseQuery = baseQuery.or(`student_id.eq.${userId},teacher_id.eq.${userId}`);
    }

    if (dateFrom) {
      baseQuery = baseQuery.gte("date", dateFrom);
    }

    if (dateTo) {
      baseQuery = baseQuery.lte("date", dateTo);
    }

    // Get total lessons count
    const { count: totalLessons, error: totalError } = await baseQuery;
    if (totalError) {
      console.error("Error getting total lessons:", totalError);
      return NextResponse.json({ error: totalError.message }, { status: 500 });
    }

    // Get lessons by status
    const statusStats: { [key: string]: number } = {};
    for (const status of LessonStatusEnum.options) {
      const { count, error } = await baseQuery.eq("status", status);
      if (!error) {
        statusStats[status] = count || 0;
      }
    }

    // Get lessons by month (last 12 months)
    const monthlyStats = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStart = monthDate.toISOString();
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).toISOString();
      
      const { count, error } = await baseQuery
        .gte("date", monthStart)
        .lte("date", monthEnd);
      
      if (!error) {
        monthlyStats.push({
          month: monthDate.toISOString().slice(0, 7), // YYYY-MM format
          count: count || 0
        });
      }
    }

    // Get lessons with songs count
    const { data: lessonsWithSongs, error: songsError } = await supabase
      .from("lesson_songs")
      .select("lesson_id", { count: "exact" });

    const uniqueLessonsWithSongs = songsError ? 0 : 
      new Set(lessonsWithSongs?.map((ls: any) => ls.lesson_id) || []).size;

    // Get average lessons per student (if userId not specified)
    let avgLessonsPerStudent = 0;
    if (!userId) {
      // Use a separate query for unique students
      const { data: studentStats, error: studentError } = await supabase
        .from("lessons")
        .select("student_id", { count: "exact" });

      let studentCount = 0;
      if (!studentError && studentStats) {
        studentCount = new Set(studentStats.map((l: any) => l.student_id)).size;
      }
      avgLessonsPerStudent = studentCount > 0 ? (totalLessons || 0) / studentCount : 0;
    }

    // Get upcoming lessons (scheduled for future)
    const { count: upcomingLessons, error: upcomingError } = await baseQuery
      .eq("status", "SCHEDULED")
      .gte("date", new Date().toISOString());

    // Get completed lessons this month
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const { count: completedThisMonth, error: completedError } = await baseQuery
      .eq("status", "COMPLETED")
      .gte("date", currentMonthStart);

    const stats = {
      total: totalLessons || 0,
      byStatus: statusStats,
      monthly: monthlyStats,
      lessonsWithSongs: uniqueLessonsWithSongs,
      avgLessonsPerStudent: Math.round(avgLessonsPerStudent * 100) / 100,
      upcoming: upcomingLessons || 0,
      completedThisMonth: completedThisMonth || 0,
      dateRange: {
        from: dateFrom || null,
        to: dateTo || null
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error in lesson stats API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
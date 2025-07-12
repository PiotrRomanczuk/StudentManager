import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";

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

    const teacherId = searchParams.get("teacherId");
    const studentId = searchParams.get("studentId");
    const period = searchParams.get("period") || "month"; // week, month, quarter, year
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build base query for lessons
    let baseQuery = supabase.from("lessons").select("*");

    if (teacherId) {
      baseQuery = baseQuery.eq("teacher_id", teacherId);
    }

    if (studentId) {
      baseQuery = baseQuery.eq("student_id", studentId);
    }

    if (dateFrom) {
      baseQuery = baseQuery.gte("date", dateFrom);
    }

    if (dateTo) {
      baseQuery = baseQuery.lte("date", dateTo);
    }

    // Get lesson completion rates
    const { data: allLessons, error: lessonsError } = await baseQuery;
    if (lessonsError) {
      console.error("Error fetching lessons for analytics:", lessonsError);
      return NextResponse.json({ error: lessonsError.message }, { status: 500 });
    }

    const totalLessons = allLessons?.length || 0;
    const completedLessons = allLessons?.filter((l: any) => l.status === "COMPLETED").length || 0;
    const cancelledLessons = allLessons?.filter((l: any) => l.status === "CANCELLED").length || 0;
    const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Get average lesson duration
    const { data: lessonDurations, error: durationError } = await supabase
      .from("lesson_durations")
      .select("*");

    let avgDuration = 0;
    if (!durationError && lessonDurations) {
      const totalDuration = lessonDurations.reduce((sum: any, ld: any) => sum + (ld.duration || 0), 0);
      avgDuration = lessonDurations.length > 0 ? totalDuration / lessonDurations.length : 0;
    }

    // Get student progress analytics
    const { data: studentProgress, error: progressError } = await supabase
      .from("lesson_songs")
      .select(`
        song_status,
        songs(level, key),
        lesson:lessons(date, status)
      `);

    let progressAnalytics = {
      songsStarted: 0,
      songsMastered: 0,
      averageProgress: 0,
      levelDistribution: {}
    };

    if (!progressError && studentProgress) {
      const statusCounts = studentProgress.reduce((acc: {[key: string]: any}, sp: any) => {
        acc[sp.song_status] = (acc[sp.song_status] || 0) + 1;
        return acc;
      }, {});

      progressAnalytics = {
        songsStarted: statusCounts.started || 0,
        songsMastered: statusCounts.mastered || 0,
        averageProgress: studentProgress.length > 0 ? 
          (statusCounts.mastered || 0) / studentProgress.length * 100 : 0,
        levelDistribution: studentProgress.reduce((acc: {[key: string]: any}, sp: any) => {
          const level = sp.songs?.level || 'unknown';
          acc[level] = (acc[level] || 0) + 1;
          return acc;
        }, {})
      };
    }

    // Get teacher performance metrics
    const { data: teacherMetrics, error: teacherError } = await supabase
      .from("lessons")
      .select(`
        teacher_id,
        status,
        profile:profiles!lessons_teacher_id_fkey(email, firstName, lastName)
      `);

    let teacherPerformance = {};
    if (!teacherError && teacherMetrics) {
      teacherPerformance = teacherMetrics.reduce((acc: {[key: string]: any}, lesson: any) => {
        const teacherId = lesson.teacher_id;
        if (!acc[teacherId]) {
          acc[teacherId] = {
            totalLessons: 0,
            completedLessons: 0,
            completionRate: 0,
            teacher: lesson.profile
          };
        }
        acc[teacherId].totalLessons++;
        if (lesson.status === "COMPLETED") {
          acc[teacherId].completedLessons++;
        }
        acc[teacherId].completionRate = (acc[teacherId].completedLessons / acc[teacherId].totalLessons) * 100;
        return acc;
      }, {});
    }

    // Get time-based analytics
    const { data: timeAnalytics, error: timeError } = await supabase
      .from("lessons")
      .select("date, status, time");

    let timeBasedAnalytics = {
      peakHours: {} as {[key: string]: any},
      weeklyDistribution: {} as {[key: string]: any},
      monthlyTrends: {} as {[key: string]: any}
    };

    if (!timeError && timeAnalytics) {
      // Analyze peak hours
      timeAnalytics.forEach((lesson: any) => {
        if (lesson.time) {
          const hour = lesson.time.split(':')[0];
          timeBasedAnalytics.peakHours[hour] = (timeBasedAnalytics.peakHours[hour] || 0) + 1;
        }
      });

      // Analyze weekly distribution
      timeAnalytics.forEach((lesson: any) => {
        if (lesson.date) {
          const dayOfWeek = new Date(lesson.date).getDay();
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayName = dayNames[dayOfWeek];
          timeBasedAnalytics.weeklyDistribution[dayName] = (timeBasedAnalytics.weeklyDistribution[dayName] || 0) + 1;
        }
      });
    }

    const analytics = {
      overview: {
        totalLessons,
        completedLessons,
        cancelledLessons,
        completionRate: Math.round(completionRate * 100) / 100,
        averageDuration: Math.round(avgDuration * 100) / 100
      },
      progress: progressAnalytics,
      teacherPerformance,
      timeAnalytics: timeBasedAnalytics,
      filters: {
        teacherId,
        studentId,
        period,
        dateFrom,
        dateTo
      }
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error in lesson analytics API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
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
    const completedLessons = allLessons?.filter((l: { status: string }) => l.status === "COMPLETED").length || 0;
    const cancelledLessons = allLessons?.filter((l: { status: string }) => l.status === "CANCELLED").length || 0;
    const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Get average lesson duration
    const { data: lessonDurations, error: durationError } = await supabase
      .from("lesson_durations")
      .select("*");

    let avgDuration = 0;
    if (!durationError && lessonDurations) {
      const totalDuration = lessonDurations.reduce((sum: number, ld: { duration?: number }) => sum + (ld.duration || 0), 0);
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
      const statusCounts = studentProgress.reduce((acc: {[key: string]: number}, sp: { song_status: string }) => {
        acc[sp.song_status] = (acc[sp.song_status] || 0) + 1;
        return acc;
      }, {});

      progressAnalytics = {
        songsStarted: statusCounts.started || 0,
        songsMastered: statusCounts.mastered || 0,
        averageProgress: studentProgress.length > 0 ? 
          (statusCounts.mastered || 0) / studentProgress.length * 100 : 0,
        levelDistribution: studentProgress.reduce((acc: {[key: string]: number}, sp: { songs?: { level?: string } }) => {
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

    let teacherPerformance: {[key: string]: {
      totalLessons: number;
      completedLessons: number;
      completionRate: number;
      teacher: { email?: string; firstName?: string; lastName?: string };
    }} = {};
    if (!teacherError && teacherMetrics) {
      teacherPerformance = teacherMetrics.reduce((acc: {[key: string]: {
        totalLessons: number;
        completedLessons: number;
        completionRate: number;
        teacher: { email?: string; firstName?: string; lastName?: string };
      }}, lesson: { teacher_id: string; status: string; profile: { email?: string; firstName?: string; lastName?: string } }) => {
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

    const timeBasedAnalytics = {
      peakHours: {} as {[key: string]: number},
      weeklyDistribution: {} as {[key: string]: number},
      monthlyTrends: {} as {[key: string]: number}
    };

    if (!timeError && timeAnalytics) {
      // Analyze peak hours
      timeAnalytics.forEach((lesson: { time?: string }) => {
        if (lesson.time) {
          const hour = lesson.time.split(':')[0];
          timeBasedAnalytics.peakHours[hour] = (timeBasedAnalytics.peakHours[hour] || 0) + 1;
        }
      });

      // Analyze weekly distribution
      timeAnalytics.forEach((lesson: { date?: string }) => {
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
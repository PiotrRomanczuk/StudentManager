import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get("userId");
    const sort = searchParams.get("sort") || "created_at";
    const filter = searchParams.get("filter");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("lessons")
      .select(`
        *,
        profile:profiles!lessons_student_id_fkey(email, firstName, lastName),
        teacher_profile:profiles!lessons_teacher_id_fkey(email, firstName, lastName)
      `)
      .order(sort, { ascending: false });

    if (userId) {
      query = query.or(`student_id.eq.${userId},teacher_id.eq.${userId}`);
    }

    if (filter && filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data: lessons, error } = await query;

    if (error) {
      console.error("Error fetching lessons:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("Error in lessons API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
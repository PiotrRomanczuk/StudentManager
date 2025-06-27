import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";
import { getUserAndAdmin } from "@/app/dashboard/utils/getUserAndAdmin";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  
  try {
    const { isAdmin } = await getUserAndAdmin(supabase);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, isActive } = body;

    if (userId === undefined || isActive === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: userId and isActive" },
        { status: 400 }
      );
    }

    // Update the user's isActive status
    const { data, error } = await supabase
      .from("profiles")
      .update({ isActive })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: data,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully` 
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { isAdmin } = await getUserAndAdmin(supabase);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Get all users with their isActive status
    const { data: users, error } = await supabase
      .from("profiles")
      .select("*")
      .order("email");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ users });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 
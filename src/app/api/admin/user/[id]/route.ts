import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Create server client with service role key for admin operations
    const supabase = await createClient(
      process.env.SUPABASE_SERVICE_ROLE_KEY // Use server-side env var
    );

    const { data: user } = await supabase.auth.admin.getUserById(id);

    if (user.error) {
      return NextResponse.json({ error: user.error.message }, { status: 400 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
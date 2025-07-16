import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Create server client with service role key for admin operations
    const supabase = await createClient(
      process.env.SUPABASE_SERVICE_ROLE_KEY // Use server-side env var
    );

    const { data: user, error } = await supabase.auth.admin.getUserById(params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
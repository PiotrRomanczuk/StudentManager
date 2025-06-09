import { createClient } from "@/utils/supabase/clients/server";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: user, error: userIdError } = await supabase.auth.getUser();
    if (userIdError) {
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 401 },
      );
    }

    if (!user.user) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 },
      );
    }

    console.log(user.user.id);

    // Get user's role from the user metadata
    const { data: adminData, error: adminError } =
      await supabase.auth.admin.getUserById(user.user.id);

    console.log(adminData);
    console.log(adminError);

    // If admin check fails, return user data with isAdmin: false
    if (adminError) {
      return NextResponse.json({
        user: { ...user.user },
        isAdmin: false,
      });
    }

    return NextResponse.json({
      user: { ...user.user },
      isAdmin: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

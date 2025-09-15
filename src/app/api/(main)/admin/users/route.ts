import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyAdminAccess } from "@/utils/admin-helpers";

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await verifyAdminAccess();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Optional filters
    const isActive = searchParams.get('isActive');
    const isAdmin = searchParams.get('isAdmin');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from("profiles")
      .select("*");

    // Apply filters
    if (isActive !== null) {
      query = query.eq("isActive", isActive === 'true');
    }
    
    if (isAdmin !== null) {
      query = query.eq("isAdmin", isAdmin === 'true');
    }
    
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    // Apply pagination and ordering
    const { data: users, error: usersError, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Error fetching users" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      users,
      pagination: {
        limit,
        offset,
        total: count || users.length
      }
    });
  } catch (error) {
    console.error("Error getting users for admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await verifyAdminAccess();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const supabase = await createClient();
    const body = await request.json();

    // TODO: Add user creation schema validation
    const { data: newUser, error: createError } = await supabase
      .from("profiles")
      .insert(body)
      .select()
      .single();

    if (createError) {
      console.error("Error creating user:", createError);
      return NextResponse.json(
        { error: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
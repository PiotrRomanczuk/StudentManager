import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserEditSchema } from "@/schemas/UserSchema";
import { verifyAdminAccess, validateUserId } from "@/utils/admin-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Validate user ID format
    if (!validateUserId(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Verify admin access
    const authResult = await verifyAdminAccess();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const supabase = await createClient();

    // Fetch the specific user profile
    const { data: userProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching user:", fetchError);
      return NextResponse.json(
        { error: "Error fetching user" },
        { status: 500 }
      );
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('[DEBUG] PATCH /api/admin/users/[id] - Starting request');
    
    const { id: userId } = await params;
    console.log('[DEBUG] Extracted userId from params:', userId);
    
    const body = await request.json();
    console.log('[DEBUG] Request body:', body);

    // Validate user ID format
    console.log('[DEBUG] Validating user ID format...');
    if (!validateUserId(userId)) {
      console.log('[DEBUG] User ID validation failed for:', userId);
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }
    console.log('[DEBUG] User ID validation passed');

    // Validate the request body
    console.log('[DEBUG] Validating request body with schema...');
    const validationResult = UserEditSchema.safeParse({ ...body, user_id: userId });
    if (!validationResult.success) {
      console.log('[DEBUG] Request body validation failed:', validationResult.error.errors);
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.errors },
        { status: 400 }
      );
    }
    console.log('[DEBUG] Request body validation passed');

    // Verify admin access
    console.log('[DEBUG] Verifying admin access...');
    const authResult = await verifyAdminAccess();
    if (authResult instanceof NextResponse) {
      console.log('[DEBUG] Admin access verification failed');
      return authResult;
    }
    console.log('[DEBUG] Admin access verified for user:', authResult.user.id);

    console.log('[DEBUG] Creating Supabase client...');
    const supabase = await createClient();

    // Remove user_id from the update data as it's used for identification
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, ...updateData } = body;
    console.log('[DEBUG] Update data (without user_id):', updateData);

    // Update the user profile
    console.log('[DEBUG] Executing Supabase update query...');
    console.log('[DEBUG] Query: UPDATE profiles SET', updateData, 'WHERE user_id =', userId);
    
    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", userId)
      .select()
      .single();

    console.log('[DEBUG] Supabase update result:');
    console.log('[DEBUG] - Data:', updatedProfile);
    console.log('[DEBUG] - Error:', updateError);

    if (updateError) {
      console.log('[DEBUG] Update error occurred:');
      console.log('[DEBUG] - Error code:', updateError.code);
      console.log('[DEBUG] - Error message:', updateError.message);
      console.log('[DEBUG] - Error details:', updateError.details);
      console.log('[DEBUG] - Error hint:', updateError.hint);
      
      if (updateError.code === 'PGRST116') {
        console.log('[DEBUG] PGRST116 error detected - User not found in database');
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      console.error("Error updating user profile:", updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    console.log('[DEBUG] Update successful, returning updated profile');
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('[DEBUG] Unexpected error in PATCH handler:', error);
    console.error('[DEBUG] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Validate user ID format
    if (!validateUserId(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Verify admin access
    const authResult = await verifyAdminAccess();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Prevent admin from deleting themselves
    if (userId === authResult.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Soft delete by setting isActive to false
    const { data: deletedProfile, error: deleteError } = await supabase
      .from("profiles")
      .update({ isActive: false })
      .eq("user_id", userId)
      .select()
      .single();

    if (deleteError) {
      console.error("Error deactivating user:", deleteError);
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "User deactivated successfully",
      user: deletedProfile 
    });
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
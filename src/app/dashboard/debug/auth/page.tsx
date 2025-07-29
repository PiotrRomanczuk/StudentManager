import { getUserAndAdminStatus, getCurrentUser } from "@/utils/auth-helpers";
import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";
import { DirectSupabaseClient } from "./components/DirectSupabaseClient";
import { AuthHelperResults } from "./components/AuthHelperResults";
import { ApiFunctionCalls } from "./components/ApiFunctionCalls";
import { EnvironmentInfo } from "./components/EnvironmentInfo";

export default async function DebugAuthPage() {
  try {
    // Test 1: Direct Supabase client
    const supabase = await createClient();
    const { data: { user: supabaseUser }, error: supabaseError } = await supabase.auth.getUser();
    
    // Test 2: API endpoints
    const { user, isAdmin } = await getUserAndAdminStatus();
    const currentUser = await getCurrentUser();
    
    // Test 3: Direct API function calls (no HTTP requests)
    let apiTest1, apiTest2;
    try {
      const response1 = await getCurrentUserAPI();
      const data1 = await response1.json();
      apiTest1 = {
        status: response1.status,
        data: data1
      };
    } catch (e) {
      apiTest1 = { error: e instanceof Error ? e.message : String(e) };
    }
    
    try {
      const response2 = await getUserAndAdminAPI();
      const data2 = await response2.json();
      apiTest2 = {
        status: response2.status,
        data: data2
      };
    } catch (e) {
      apiTest2 = { error: e instanceof Error ? e.message : String(e) };
    }

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
        
        <div className="space-y-4">
          <DirectSupabaseClient 
            supabaseUser={supabaseUser} 
            supabaseError={supabaseError} 
          />
          
          <AuthHelperResults 
            user={user} 
            isAdmin={isAdmin} 
            currentUser={currentUser} 
          />
          
          <ApiFunctionCalls 
            apiTest1={apiTest1} 
            apiTest2={apiTest2} 
          />
          
          <EnvironmentInfo />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Debug - Error</h1>
        <div className="border border-red-300 p-4 rounded bg-red-50">
          <h2 className="text-lg font-semibold mb-2">Error Details:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}

// Import the API route handlers directly
async function getCurrentUserAPI() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getUserAndAdminAPI() {
  try {
    const supabase = await createClient();
    const { data: user, error: userIdError } = await supabase.auth.getUser();
    
    if (userIdError) {
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 401 }
      );
    }

    if (!user?.user?.id) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }

    // First, try to get the existing profile
    const { data: profile, error: userProfileError } = await supabase
      .from("profiles")
      .select("isAdmin, isStudent, isTeacher")
      .eq("user_id", user.user.id)
      .single();

    // If no profile exists, create one with default values
    if (userProfileError && userProfileError.code === 'PGRST116') {
      // PGRST116 is the error code for "no rows returned" when using .single()
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.user.id,
          email: user.user.email,
          isAdmin: false,
          isStudent: true,
          isTeacher: false,
          canEdit: false
        })
        .select("isAdmin, isStudent, isTeacher")
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        return NextResponse.json(
          { error: "Error creating user profile" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        user: { ...user.user },
        isAdmin: newProfile?.isAdmin || false,
      });
    }

    // If there's a different error in profile check, treat as non-admin instead of throwing
    if (userProfileError) {
      console.error("Error checking permissions:", userProfileError);
      return NextResponse.json({
        user: { ...user.user },
        isAdmin: false,
      });
    }

    return NextResponse.json({
      user: { ...user.user },
      isAdmin: profile?.isAdmin || false,
    });
  } catch (error) {
    console.error("Error getting user and admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
import { createClient } from "@/utils/supabase/clients/server";
import { getUserAndAdminStatus } from "@/utils/auth-helpers";

export default async function FixAdminPage() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Not Authenticated</h1>
          <p>You need to sign in first.</p>
        </div>
      );
    }

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { user: apiUser, isAdmin } = await getUserAndAdminStatus();

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Status Check & Fix</h1>
        
        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Current User Info:</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify({
                id: user.id,
                email: user.email,
                email_confirmed_at: user.email_confirmed_at
              }, null, 2)}
            </pre>
          </div>

          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Current Profile (Database):</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify({ profile, error: profileError }, null, 2)}
            </pre>
          </div>

          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">API Response:</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify({ user: apiUser, isAdmin }, null, 2)}
            </pre>
          </div>

          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Analysis:</h2>
            <div className="space-y-2">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Profile exists:</strong> {profile ? "Yes" : "No"}</p>
              <p><strong>Current isAdmin:</strong> {profile?.isAdmin ? "Yes" : "No"}</p>
              <p><strong>API says isAdmin:</strong> {isAdmin ? "Yes" : "No"}</p>
              <p><strong>Email confirmed:</strong> {user.email_confirmed_at ? "Yes" : "No"}</p>
            </div>
          </div>

          {profile && !profile.isAdmin && (
            <div className="border border-yellow-300 p-4 rounded bg-yellow-50">
              <h2 className="text-lg font-semibold mb-2 text-yellow-800">Potential Fix:</h2>
              <p className="text-yellow-700 mb-4">
                Your profile exists but you&apos;re not marked as admin. You can manually update your admin status in the database.
              </p>
              <div className="bg-gray-100 p-2 rounded text-sm">
                <p><strong>SQL to run in Supabase:</strong></p>
                <code className="block mt-2">
                  UPDATE profiles SET &quot;isAdmin&quot; = true WHERE &quot;user_id&quot; = &apos;{user.id}&apos;;
                </code>
              </div>
            </div>
          )}

          {!profile && (
            <div className="border border-red-300 p-4 rounded bg-red-50">
              <h2 className="text-lg font-semibold mb-2 text-red-800">Issue Found:</h2>
              <p className="text-red-700 mb-4">
                No profile found for your user. This might be causing the authentication issues.
              </p>
              <div className="bg-gray-100 p-2 rounded text-sm">
                <p><strong>SQL to run in Supabase:</strong></p>
                <code className="block mt-2">
                  INSERT INTO profiles (&quot;user_id&quot;, &quot;email&quot;, &quot;isAdmin&quot;, &quot;isStudent&quot;, &quot;isTeacher&quot;, &quot;canEdit&quot;) 
                  VALUES (&apos;{user.id}&apos;, &apos;{user.email}&apos;, true, false, false, true);
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <div className="border border-red-300 p-4 rounded bg-red-50">
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
} 
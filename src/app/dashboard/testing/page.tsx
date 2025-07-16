// import DropboxPage from "./Dropbox";
import { createClient } from "@/utils/supabase/clients/server";

export default async function TestingPage() {
  const supabase = await createClient();

  // Get current user
  const { error } = await supabase.auth.admin.getUserById(
    "734d25a3-75f8-46c8-bceb-bac84bcf405f",
  );

  

  if (error) {
    console.error("Error getting user:", error);
  }

  // console.log(users)

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
            Google Integration Testing
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test Google Login and Google Drive features below.
          </p>
        </div>
        <div className="space-y-6">{/* <DropboxPage /> */}</div>
      </div>
    </div>
  );
}

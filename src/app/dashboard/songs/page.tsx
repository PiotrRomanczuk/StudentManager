import { createClient } from "@/utils/supabase/clients/server";
import { getUserAndAdmin } from "../@utils/getUserAndAdmin";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SongsPage() {
    const supabase = await createClient();
    const { isAdmin } = await getUserAndAdmin(supabase);

    if (isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">
                            Which version would you like to use?
                        </h1>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Link 
                                href="/dashboard/songs/v1"
                                className="flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                            >
                                Version 1
                            </Link>
                            <Link 
                                href="/dashboard/songs/v2"
                                className="flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                            >
                                Version 2
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    redirect("/dashboard/songs/v1");
}
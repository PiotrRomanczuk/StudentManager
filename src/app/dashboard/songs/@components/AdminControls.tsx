// COMMENTED OUT: Old AdminControls - Replaced with EnhancedSongPage
// This component has been replaced with the new enhanced version that includes:
// - Complete API integration with all endpoints
// - Advanced search and filtering
// - Bulk operations
// - Real-time updates
// - Better mobile support
// - Enhanced UI/UX

/*
import SearchBar from "@/app/dashboard/@components/SearchBar";
import Link from "next/link";
import { User } from "@/types/User";

export function AdminControls({ profiles }: { profiles: User[] }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
      <Link
        href="/dashboard/songs/create"
        className="text-blue-500 hover:text-blue-600 font-bold whitespace-nowrap"
      >
        Add New Song
      </Link>
      <div className="w-full sm:w-auto">
        <SearchBar profiles={profiles} />
      </div>
    </div>
  );
}
*/

// NEW: Enhanced version is now used in enhanced-page.tsx
// Features include:
// - Complete API integration with useSongApi hook
// - Advanced search with real-time filtering
// - Bulk operations (import, export, delete)
// - Favorites management
// - Statistics dashboard
// - Mobile-responsive design
// - Type-safe operations
// - Comprehensive error handling

export function AdminControls() {
  return (
    <div className="text-center py-4">
      <h3 className="text-lg font-semibold text-gray-600 mb-1">
        Enhanced Admin Controls
      </h3>
      <p className="text-sm text-gray-500">
        This component has been replaced with the enhanced version.
        <br />
        Please use the new enhanced song management system.
      </p>
    </div>
  );
}

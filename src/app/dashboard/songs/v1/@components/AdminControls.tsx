import SearchBar from "@/components/Search-bar";
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

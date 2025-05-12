"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, User } from "lucide-react";
import { User as UserType } from "@/types/User";

export default function SearchBar({ profiles }: { profiles: UserType[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("user_id");

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("user_id", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Select
          onValueChange={handleValueChange}
          defaultValue={search || undefined}
        >
          <SelectTrigger className="w-[220px] pl-9 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <SelectValue placeholder="Search users..." />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1.5 text-sm font-medium text-gray-500 border-b">
              Select a user
            </div>
            {[...profiles]
              .sort((a, b) => a.email.localeCompare(b.email))
              .map((profile: UserType) => (
                <SelectItem
                  key={profile.user_id}
                  value={profile.user_id}
                  className="flex items-center gap-2 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-sm">{profile.email}</span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

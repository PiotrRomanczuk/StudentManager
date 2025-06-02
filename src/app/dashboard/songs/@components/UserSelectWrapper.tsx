"use client";
import { useRouter, useSearchParams } from "next/navigation";
import UserSelectDropdown from "./UserSelectDropdown";

interface Profile {
  user_id: string;
  full_name?: string;
  email?: string;
}

export default function UserSelectWrapper({
  profiles,
  selectedUserId,
}: {
  profiles: Profile[];
  selectedUserId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (newUserId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("user_id", newUserId);
    router.replace(`?${params.toString()}`);
  };

  return (
    <UserSelectDropdown
      profiles={profiles}
      selectedUserId={selectedUserId}
      onChange={handleChange}
    />
  );
}

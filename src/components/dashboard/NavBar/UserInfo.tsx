"use client";

import { createClient } from "@/utils/supabase/clients/client";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { logout } from "@/app/auth/signin/actions";
import { useEffect, useState } from "react";

interface UserMetadata {
  name?: string;
  avatar_url?: string;
  [key: string]: string | undefined;
}

interface UserData {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
}

const UserInfo = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data?.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchUser();
  }, []);

  if (error || !user) {
    return (
      <div className="text-red-500 flex items-center gap-2">
        <User className="h-4 w-4" />
        No user {error}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-secondary/20 px-4 py-2 rounded-lg text-white">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{user.email}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-1"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Log out
      </Button>
    </div>
  );
};

export default UserInfo;

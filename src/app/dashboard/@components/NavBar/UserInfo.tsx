"use client";

import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const UserInfo = () => {
  const { user, loading, error, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <User className="h-4 w-4" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-red-500 flex items-center gap-2">
        <User className="h-4 w-4" />
        <span className="text-sm">No user {error}</span>
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
        onClick={signOut}
        className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-1"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Log out
      </Button>
    </div>
  );
};

export default UserInfo;

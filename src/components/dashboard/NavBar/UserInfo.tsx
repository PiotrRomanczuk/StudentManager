import { createClient } from "@/utils/supabase/clients/server";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { logout } from "@/app/auth/signin/actions";

const UserInfo = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return (
      <div className="text-red-500 flex items-center gap-2">
        <User className="h-4 w-4" />
        No user {error?.message}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-secondary/20 px-4 py-2 rounded-lg text-white">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{data.user?.email}</span>
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

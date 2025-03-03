import { createClient } from "@/utils/supabase/clients/server";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/login/actions";

const UserInfo = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return <div>No user {error?.message}</div>;
  }

  return (
    <div className="flex items-center gap-2">
      Signed in as {data.user?.email}
      <Button variant="outline" onClick={logout}>
        <LogOut className="mr-2" /> Log out
      </Button>
    </div>
  );
};

export default UserInfo;

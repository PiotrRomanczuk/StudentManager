import { UserManagement } from "../@components/admin/UserManagement";
import { getUserAndAdminStatus } from "@/utils/auth-helpers";
import { ErrorComponent } from "../@components/ErrorComponent";

export default async function UserManagementPage() {
  try {
    const { user, isAdmin } = await getUserAndAdminStatus();

    if (!user?.id) {
      return <ErrorComponent error="Please sign in to access this page" />;
    }

    if (!isAdmin) {
      return <ErrorComponent error="Admin access required" />;
    }

    return (
      <div className="container mx-auto px-4 py-6">
        <UserManagement />
      </div>
    );
  } catch (error) {
    console.error("Error in user management page:", error);
    return <ErrorComponent error="Failed to load user management page" />;
  }
} 
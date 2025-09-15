import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Profile } from "./types";

interface StudentRowProps {
  user: Profile;
  onEdit?: (user: Profile) => void;
  onToggleActive?: (user: Profile) => void;
}

export function StudentRow({ user, onEdit, onToggleActive }: StudentRowProps) {
  const getRoleBadge = (user: Profile) => {
    if (user.isAdmin) return <Badge variant="destructive">Admin</Badge>;
    if (user.isTeacher) return <Badge variant="secondary">Teacher</Badge>;
    return <Badge variant="default">Student</Badge>;
  };

  const getStatusBadge = (user: Profile) => {
    return user.isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>
    );
  };

  return (
    <TableRow key={user.user_id}>
      <TableCell>
        <Link
          href={`/dashboard/students/${user.user_id}`}
          className="text-blue-600 hover:underline"
        >
          {user.email || "-"}
        </Link>
      </TableCell>
      <TableCell>{user.username || "-"}</TableCell>
      <TableCell>{user.firstName || "-"}</TableCell>
      <TableCell>{user.lastName || "-"}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {getRoleBadge(user)}
          {getStatusBadge(user)}
        </div>
      </TableCell>
      <TableCell>
        {user.created_at
          ? new Date(user.created_at).toLocaleString()
          : "-"}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(user)}
            >
              Edit
            </Button>
          )}
          {onToggleActive && (
            <Button
              variant={user.isActive ? "destructive" : "default"}
              size="sm"
              onClick={() => onToggleActive(user)}
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
} 
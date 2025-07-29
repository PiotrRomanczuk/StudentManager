interface UserInfoCardProps {
  user: {
    id?: string;
    email?: string;
  } | null;
  isAdmin: boolean;
}

export function UserInfoCard({ user, isAdmin }: UserInfoCardProps) {
  if (!isAdmin) return null;

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h2 className="text-lg font-semibold text-blue-800 mb-2">User Information</h2>
      <div className="space-y-2">
        <p className="text-blue-700">
          <span className="font-medium">User ID:</span> {user?.id || 'Not available'}
        </p>
        <p className="text-blue-700">
          <span className="font-medium">Email:</span> {user?.email || 'Not available'}
        </p>
        <p className="text-blue-700">
          <span className="font-medium">Admin Status:</span> {isAdmin ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
} 
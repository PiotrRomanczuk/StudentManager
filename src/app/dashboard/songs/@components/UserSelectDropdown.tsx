import React from "react";

interface Profile {
  user_id: string;
  full_name?: string;
  email?: string;
}

interface UserSelectDropdownProps {
  profiles: Profile[];
  selectedUserId: string;
  onChange: (userId: string) => void;
}

const UserSelectDropdown: React.FC<UserSelectDropdownProps> = ({
  profiles,
  selectedUserId,
  onChange,
}) => {
  return (
    <select
      value={selectedUserId}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-2 py-1"
    >
      {profiles.map((profile) => (
        <option key={profile.user_id} value={profile.user_id}>
          {profile.full_name || profile.email || profile.user_id}
        </option>
      ))}
    </select>
  );
};

export default UserSelectDropdown; 
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
import { fetchApi } from "@/utils/api-helpers";
import { User } from "@/types/User";
import { format } from "date-fns";

interface UserProfile extends User {
  id: number;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const filterUsers = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchApi<{ users: UserProfile[] }>("/api/admin/user-management");
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      bio: user.bio || "",
      isStudent: user.isStudent,
      isTeacher: user.isTeacher,
      isAdmin: user.isAdmin,
      canEdit: user.canEdit,
      isActive: user.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      setSaving(true);
      const updatedUser = await fetchApi<UserProfile>("/api/admin/user-management", {
        method: "PATCH",
        body: JSON.stringify({
          user_id: selectedUser.user_id,
          ...editForm,
        }),
      });
      
      // Update the users list
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === selectedUser.user_id ? { ...user, ...updatedUser } : user
        )
      );

      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: UserProfile) => {
    try {
      const updatedUser = await fetchApi<UserProfile>("/api/admin/user-management", {
        method: "PATCH",
        body: JSON.stringify({
          user_id: user.user_id,
          isActive: !user.isActive,
        }),
      });
      
      // Update the users list
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.user_id === user.user_id ? { ...u, ...updatedUser } : u
        )
      );

      toast.success(`User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update user status");
    }
  };

  const getRoleBadge = (user: UserProfile) => {
    if (user.isAdmin) return <Badge variant="destructive">Admin</Badge>;
    if (user.isTeacher) return <Badge variant="secondary">Teacher</Badge>;
    return <Badge variant="default">Student</Badge>;
  };

  const getStatusBadge = (user: UserProfile) => {
    return user.isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage student profiles</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.user_id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {getRoleBadge(user)}
                  {getStatusBadge(user)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {user.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Joined: {format(new Date(user.created_at), 'MMM dd, yyyy')}</span>
                  {user.canEdit && <Badge variant="outline" className="text-xs">Can Edit</Badge>}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={user.isActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleActive(user)}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchTerm ? "No users found matching your search." : "No users found."}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editForm.firstName || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editForm.lastName || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="isStudent">Student</Label>
                <Switch
                  id="isStudent"
                  checked={editForm.isStudent || false}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isStudent: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="isTeacher">Teacher</Label>
                <Switch
                  id="isTeacher"
                  checked={editForm.isTeacher || false}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isTeacher: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="isAdmin">Admin</Label>
                <Switch
                  id="isAdmin"
                  checked={editForm.isAdmin || false}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isAdmin: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="canEdit">Can Edit</Label>
                <Switch
                  id="canEdit"
                  checked={editForm.canEdit || false}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, canEdit: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={editForm.isActive || false}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveUser}
                disabled={saving}
                className="flex-1"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
import { fetchApi } from "@/utils/api-helpers";
import { Profile } from "./types";
import { StudentsTable } from "./StudentsTable";

interface StudentsCardProps {
  data: Profile[];
  sortField: string;
  sortDir: string;
  isAdmin?: boolean;
}

export function StudentsCard({ data: initialData, sortField, sortDir, isAdmin = false }: StudentsCardProps) {
  const [users, setUsers] = useState<Profile[]>(initialData);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);

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

  const handleEditUser = (user: Profile) => {
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

    // Debug: Log selected user before making the PATCH request
    console.log('[DEBUG] Attempting to update user:', selectedUser);
    console.log('[DEBUG] PATCH URL:', `/api/admin/users/${selectedUser.user_id}`);
    console.log('[DEBUG] PATCH Body:', { user_id: selectedUser.user_id, ...editForm });

    try {
      setSaving(true);
      const updatedUser = await fetchApi<Profile>(`/api/admin/users/${selectedUser.user_id}`, {
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
      // Debug: Log error details
      console.error('[DEBUG] Error updating user:', error);
      if (error instanceof Error && 'status' in error && error.status === 404) {
        console.error('[DEBUG] 404 Not Found: User does not exist in the database.');
      }
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: Profile) => {
    try {
      const updatedUser = await fetchApi<Profile>(`/api/admin/users/${user.user_id}`, {
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

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                {isAdmin ? "Manage student profiles and permissions" : "View student profiles"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentsTable 
            data={filteredUsers} 
            sortField={sortField} 
            sortDir={sortDir}
            onEditUser={isAdmin ? handleEditUser : undefined}
            onToggleActive={isAdmin ? handleToggleActive : undefined}
          />
        </CardContent>
      </Card>

      {/* Edit Modal - Only show for admins */}
      {isAdmin && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Student Profile</DialogTitle>
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
      )}
    </div>
  );
} 
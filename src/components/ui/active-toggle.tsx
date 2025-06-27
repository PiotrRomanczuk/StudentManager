"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ActiveToggleProps {
  userId: string;
  isActive: boolean;
  onStatusChange?: (isActive: boolean) => void;
}

export function ActiveToggle({ userId, isActive, onStatusChange }: ActiveToggleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(isActive);

  const handleToggle = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isActive: !currentStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setCurrentStatus(!currentStatus);
      onStatusChange?.(!currentStatus);
      toast.success(data.message || `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={currentStatus ? "default" : "secondary"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={`${
        currentStatus 
          ? "bg-green-600 hover:bg-green-700 text-white" 
          : "bg-red-600 hover:bg-red-700 text-white"
      }`}
    >
      {isLoading ? "Updating..." : currentStatus ? "Active" : "Inactive"}
    </Button>
  );
} 
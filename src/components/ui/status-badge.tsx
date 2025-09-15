"use client";

import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export function StatusBadge({ status, variant = "outline", className = "" }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
      case "beginner":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
      case "mastered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "in_progress":
      case "intermediate":
      case "started":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
      case "remembered":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Badge
      variant={variant}
      className={`${getStatusColor(status)} border-transparent ${className}`}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
} 
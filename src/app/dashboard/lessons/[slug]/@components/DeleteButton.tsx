"use client"; // Mark this as a client component

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteLesson } from "../actions";

type DeleteButtonProps = {
  lessonId: string;
};

export default function DeleteButton({ lessonId }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLesson(lessonId); // Call the server action
      router.push("/dashboard/lessons"); // Redirect after deletion
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      variant="destructive"
    >
      {isDeleting ? "Deleting..." : "Delete Lesson"}
    </Button>
  );
}
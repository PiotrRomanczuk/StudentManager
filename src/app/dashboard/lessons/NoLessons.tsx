import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, Plus } from "lucide-react";
import React from "react";

const NoLessons = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-lg font-medium">No lessons found</p>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdmin
            ? "Create your first lesson to get started"
            : "No lessons available at the moment"}
        </p>
        {isAdmin && (
          <Button asChild className="mt-4">
            <Link href="/dashboard/lessons/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Lesson
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NoLessons;

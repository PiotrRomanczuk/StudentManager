import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NoLesson() {
  return (
      <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <p className="text-lg font-medium">No lesson found.</p>
            <p className="text-sm text-muted-foreground">
              The lesson you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/lessons">Back to Lessons</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { ArrowLeft, Music } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SongNotFound = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/songs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Back to Songs</span>
        </Link>
      </div>

      <Card className="border-2 border-dashed border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Music className="w-16 h-16 text-gray-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Song Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            The song you're looking for doesn't exist or has been removed.
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90"
          >
            <Link href="/dashboard/songs">
              Return to Songs List
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SongNotFound;

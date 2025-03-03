import { CardFooter } from "@/components/ui/card";
import type { Song } from "@/types/Song";
import { createClient } from "@/utils/supabase/clients/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { updateLesson } from "./actions";

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  console.log("Resolved Params:", slug);

  const supabase = await createClient();

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*");

  if (songsError) {
    console.error(songsError);
  }

  async function updateLesson(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const songId = formData.get("songs") as string;
    const notes = formData.get("notes") as string;

    const { error } = await supabase
      .from("lessons")
      .update({ title, song_id: songId, notes })
      .eq("slug", formData.get("slug"));

    if (error) {
      console.error("Error updating lesson:", error);
      return { success: false, error };
    }

    return { success: true };
  }

  return (
    <div className="container max-w-3xl py-10">
      <Link
        href="/lessons"
        className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to lessons
      </Link>

      <form action={updateLesson}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Lesson</CardTitle>
            <CardDescription>
              Make changes to your lesson information below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Enter lesson title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="songs">Song</Label>
              <Select name="songs">
                <SelectTrigger
                  id="songs"
                  className="focus:bg-white active:bg-white data-[state=open]:bg-white text-black bg-white"
                >
                  <SelectValue placeholder="Select a song" />
                </SelectTrigger>
                <SelectContent>
                  {songs?.map((song: Song) => (
                    <SelectItem
                      key={song.id}
                      value={song.id.toString()}
                      className="text-black bg-white"
                    >
                      {song.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter additional notes or instructions"
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

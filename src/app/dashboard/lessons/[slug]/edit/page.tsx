
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
  CardFooter
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

type Params = { slug: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  console.log("Resolved Params:", slug);

  const supabase = await createClient();

  // Fetch the lesson data to pre-fill the form
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", slug)
    .single();

  if (lessonError) {
    console.error(lessonError);
    return <div>Error loading lesson data.</div>;
  }

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*");

  if (songsError) {
    console.error(songsError);
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

      <form
        action={async (formData: FormData) => {
          "use server";
          const supabase = await createClient();

          const title = formData.get("title") as string;
          const songId = formData.get("songs") as string;
          const notes = formData.get("notes") as string;
          const slug = formData.get("slug") as string;

          const { error } = await supabase
            .from("lessons")
            .update({ title, song_id: songId, notes })
            .eq("id", slug); // Use 'id' instead of 'slug' if 'id' is the primary key

          if (error) {
            console.error("Error updating lesson:", error);
            // Handle the error (e.g., display a message or log it)
            return; // Return void to satisfy the type requirement
          }

          // Handle success (e.g., redirect the user or display a success message)
          console.log("Lesson updated successfully!");
          return; // Return void to satisfy the type requirement
        }}
      >
        <input type="hidden" name="slug" value={slug} />{" "}
        {/* Include slug in form data */}
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
              <Input
                id="title"
                name="title"
                placeholder="Enter lesson title"
                defaultValue={lesson.title}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="songs">Song</Label>
              <Select name="songs" defaultValue={lesson.song_id?.toString()}>
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
                defaultValue={lesson.notes}
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

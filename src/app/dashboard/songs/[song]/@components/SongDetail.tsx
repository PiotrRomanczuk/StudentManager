"use client";

import { redirect } from "next/navigation";
import { Music, BarChart, Key, Edit, Trash2, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Song } from "@/types/Song";
import { createClient } from "@/utils/supabase/clients/client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SongDetailsProps {
  song: Song;
}

export default function SongDetails({ song }: SongDetailsProps) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      const supabase = await createClient();
      const { error } = await supabase.from("songs").delete().eq("id", song.id);

      if (error) {
        console.error("Error deleting song:", error);
      } else {
        redirect("/dashboard/songs");
      }
    }
  };

  function handleUpdate() {
    redirect(`/dashboard/songs/${encodeURIComponent(song.id)}/edit`);
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {song.title}
        </h1>
        <div className="space-x-4">
          <Button 
            variant="outline" 
            onClick={handleUpdate}
            className="hover:bg-blue-50 transition-colors"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Song
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="hover:bg-red-50 transition-colors"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Song
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center text-purple-700">
              <Music className="mr-2" size={20} />
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium">{song.title}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Short Title</p>
                <p className="font-medium">{song.short_title || "N/A"}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(song.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Updated</p>
                  <p className="font-medium">{new Date(song.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Musical Details Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center text-purple-700">
              <Key className="mr-2" size={20} />
              Musical Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="font-medium">{song.author || "N/A"}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Key</p>
                  <Badge variant="outline" className="mt-1">{song.key || "N/A"}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <Badge variant="outline" className="mt-1">{song.level || "N/A"}</Badge>
                </div>
              </div>
              {song.chords && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Chords</p>
                    <p className="font-medium mt-1">{song.chords}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resources Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center text-purple-700">
              <BarChart className="mr-2" size={20} />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Ultimate Guitar</p>
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  asChild
                >
                  <a
                    href={song.ultimate_guitar_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    View Tab
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Audio Files</p>
                <p className="font-medium mt-1">{song.audio_files || "No audio files available"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Large Content Section */}
      <div className="mt-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center text-purple-700">
              <Music className="mr-2" size={20} />
              Song Content
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Chords & Notes</p>
                <div className="p-6 bg-gray-50 rounded-lg min-h-[300px]">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap font-mono text-sm">
                      {song.chords || "No chord progression available"}
                    </div>
                    {song.comments && (
                      <>
                        <Separator className="my-4" />
                        <div className="whitespace-pre-wrap text-sm">
                          {song.comments}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

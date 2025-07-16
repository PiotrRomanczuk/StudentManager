"use client";

import React from 'react';
import { Song } from "@/utils/song-api-helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Heart } from "lucide-react";

interface SimpleSongTableProps {
  songs: Song[];
  isAdmin?: boolean;
}

export function SimpleSongTable({ songs, isAdmin = false }: SimpleSongTableProps) {
  return (
    <div className="space-y-4">
      {/* Debug info */}
      <div className="text-sm text-gray-500">
        Simple Table: {songs.length} songs received
      </div>

      {/* Songs Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No songs found
                </TableCell>
              </TableRow>
            ) : (
              songs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell className="font-medium">{song.title}</TableCell>
                  <TableCell>{song.author || "Unknown"}</TableCell>
                  <TableCell>
                    <Badge variant={song.level === "beginner" ? "default" : song.level === "intermediate" ? "secondary" : "destructive"}>
                      {song.level || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>{song.key || "Unknown"}</TableCell>
                  <TableCell>
                    {song.status && (
                      <Badge variant="outline">
                        {song.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 
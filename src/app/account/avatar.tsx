"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/clients/client";
import Image from "next/image";
import { downloadImage, useAvatarUpload } from "./avatar-utils";

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) {
      downloadImage(supabase, url)
        .then(setAvatarUrl)
        .catch((error) => console.log("Error downloading image: ", error));
    }
  }, [url, supabase]);

  const handleUpload = useAvatarUpload(supabase, uid, setUploading, onUpload);

  return (
    <div>
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>
    </div>
  );
}

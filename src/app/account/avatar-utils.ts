import { SupabaseClient } from "@supabase/supabase-js";

export const downloadImage = async (supabase: SupabaseClient, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) {
      throw new Error("Error downloading image:" + error);
    }

    const url = URL.createObjectURL(data);
    return url;
  } catch (error) {
    throw new Error("Error downloading image:" + error);
  }
};

export const uploadAvatarImage = async (
  supabase: SupabaseClient,
  uid: string | null,
  file: File,
) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${uid}-${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error("Error uploading avatar:" + uploadError);
  }

  return filePath;
};

export const useAvatarUpload = (
  supabase: SupabaseClient,
  uid: string | null,
  setUploading: (uploading: boolean) => void,
  onUpload: (url: string) => void,
) => {
  return async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const filePath = await uploadAvatarImage(supabase, uid, file);
      onUpload(filePath);
    } catch (error) {
      throw new Error("Error uploading avatar:" + error);
    } finally {
      setUploading(false);
    }
  };
};

import { createClient } from "@/utils/supabase/clients/client";
import { type User } from "@supabase/supabase-js";
import { type IProfile } from "./IProfile";

export const supabase = createClient();

export const getProfile = async (user: User): Promise<IProfile | null> => {
  if (!user) return null;

  try {
    const { data, error, status } = await supabase
      .from("user_profiles")
      .select("full_name, username, website, avatar_url")
      .eq("id", user.id)
      .single();

    if (error && status !== 406) {
      throw new Error(`Error loading user data: ${error}`);
    }

    return data;
  } catch {
    throw new Error(`Error loading user data`);
  }
};

export const updateProfile = async ({
  user,
  fullname,
  username,
  website,
  avatar_url,
}: {
  user: User | null;
  username: string | null;
  fullname: string | null;
  website: string | null;
  avatar_url: string | null;
}) => {
  try {
    const { error } = await supabase.from("profiles").upsert({
      id: user?.id as string,
      full_name: fullname,
      username,
      website,
      avatar_url,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    return true;
  } catch {
    throw new Error("Error updating the data");
  }
};

export const useFetchProfile = (
  user: User | null,
  setLoading: (loading: boolean) => void,
  setProfile: (profile: IProfile) => void,
) => {
  return async () => {
    try {
      setLoading(true);
      if (!user) return;
      const data = await getProfile(user);
      if (data) {
        setProfile({
          full_name: data.full_name,
          username: data.username,
          website: data.website,
          avatar_url: data.avatar_url,
        });
      }
    } catch {
      throw new Error("Error loading user data");
    } finally {
      setLoading(false);
    }
  };
};

export const useHandleUpdateProfile = (
  user: User | null,
  setLoading: (loading: boolean) => void,
) => {
  return async (profile: IProfile) => {
    try {
      setLoading(true);
      await updateProfile({
        user,
        fullname: profile.full_name,
        username: profile.username,
        website: profile.website,
        avatar_url: profile.avatar_url,
      });
      // Profile updated successfully
    } catch {
      throw new Error("Error updating the data");
    } finally {
      setLoading(false);
    }
  };
};

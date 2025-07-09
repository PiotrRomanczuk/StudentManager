import { BASE_URL } from "@/constants/BASE_URL";

export async function fetchProfilesData(cookieHeader: string) {
  const profiles_res = await fetch(`${BASE_URL}/api/user?includeProfile=true&admin=true`, {
    cache: "no-store",
    headers: { Cookie: cookieHeader },
  });

  if (!profiles_res.ok) {
    throw new Error(
      (await profiles_res.json()).error || "Failed to fetch profiles",
    );
  }

  const data = await profiles_res.json();
  return { profiles: data.profiles || [] };
}

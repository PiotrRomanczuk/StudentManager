import { cookies } from "next/headers";

export async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');
} 
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import oAuth2Client from "@/utils/google/google-auth";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    const sessionExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    const cookieStore = await cookies();
    cookieStore.set("google_access_token", tokens.access_token ?? "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: sessionExpiresAt,
    });

    if (tokens.refresh_token) {
      cookieStore.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: sessionExpiresAt,
      });
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("OAuth2 callback error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
} 
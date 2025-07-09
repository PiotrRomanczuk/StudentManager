// src/app/api/auth/signout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Remove the google_access_token cookie
  const response = NextResponse.redirect("/dashboard/testing"); // or wherever you want to redirect
  response.cookies.set("google_access_token", "", { maxAge: 0, path: "/" });
  response.cookies.set("code", "", { maxAge: 0, path: "/" });
  return response;
}

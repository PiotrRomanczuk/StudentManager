import { NextResponse } from "next/server";
import { google } from "googleapis";
import oAuth2Client from "@/utils/google/google-auth";

export async function GET() {
  const SCOPES = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  return NextResponse.redirect(authUrl);
} 
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import oAuth2Client from "@/utils/google/google-auth";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Not authenticated with Google" },
      { status: 401 }
    );
  }

  oAuth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return NextResponse.json({ events: response.data.items });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
} 
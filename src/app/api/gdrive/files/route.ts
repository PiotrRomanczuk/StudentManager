import { NextResponse } from "next/server";
import { google } from "googleapis";
import oAuth2Client from "@/utils/google/google-auth";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  oAuth2Client.setCredentials({ access_token: accessToken });
  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  try {
    const response = await drive.files.list({
      pageSize: 100,
      fields:
        "files(id, name, mimeType, webViewLink, createdTime, size, owners)",
      orderBy: "createdTime desc",
      spaces: "drive",
      corpora: "user",
    });
    if (!response.data.files) {
      return NextResponse.json({ files: [], error: null });
    }
    return NextResponse.json({ files: response.data.files, error: null });
  } catch (error) {
    return NextResponse.json(
      {
        files: null,
        error: error instanceof AxiosError ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

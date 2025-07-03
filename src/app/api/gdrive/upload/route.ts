import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import oAuth2Client from "@/utils/google/google-auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  oAuth2Client.setCredentials({ access_token: accessToken });
  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

    const fileMetadata = {
      name: file.name,
    };

    const media = {
      mimeType: file.type,
      body: file.stream(),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    return NextResponse.json({ id: response.data.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

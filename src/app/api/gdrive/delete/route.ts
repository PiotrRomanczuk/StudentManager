import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import oAuth2Client from "@/utils/google/google-auth";
import { cookies } from "next/headers";

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  oAuth2Client.setCredentials({ access_token: accessToken });
  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    await drive.files.delete({ fileId: id });

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

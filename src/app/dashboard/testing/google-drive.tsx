import GoogleDriveManager from "./GoogleDriveManager";
import { cookies } from "next/headers";
import { google } from "googleapis";
import oAuth2Client from "@/utils/google/google-auth";
import { AxiosError } from "axios";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  createdTime: string;
}

async function getDriveFiles() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;

  if (!accessToken) {
    return { files: null, error: null };
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
      return { files: [], error: null };
    }
    return { files: response.data.files as DriveFile[], error: null };
  } catch (error) {
    return {
      files: null,
      error: error instanceof AxiosError ? error.message : "Unknown error",
    };
  }
}

export default async function GoogleDrive() {
  const { files, error } = await getDriveFiles();

  return (
    <div>
      <GoogleDriveManager initialFiles={files || []} initialError={error} />
    </div>
  );
}

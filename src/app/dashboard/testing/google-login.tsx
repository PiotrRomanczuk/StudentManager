import oAuth2Client from "@/utils/google/google-auth";
// import { google } from 'googleapis';
import { cookies } from "next/headers";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

export default async function GoogleLogin() {
  const SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
  ];
  const cookieStore = await cookies();
  const code = cookieStore.get("code")?.value;

  let errorMsg = "";
  if (code) {
    try {
      await oAuth2Client.getToken(code);
      // Store the tokens in cookies or your preferred storage method
      // Note: In a production environment, you should use secure HTTP-only cookies
      // and implement proper token refresh logic
  
    } catch (error) {
      errorMsg = "Failed to exchange code for tokens.";
      console.error("Error exchanging code for tokens:", error);
    }
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  const googleAccessToken = cookieStore.get("google_access_token")?.value;
  const isLoggedIn = Boolean(googleAccessToken);

  return (
    <div className="mb-6 text-center">
      {isLoggedIn ? (
        <>
          <div className="mb-2 text-green-600 font-semibold">
            Logged in with Google
          </div>
          <a
            href="/api/auth/session/signout"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-colors font-medium"
          >
            <FaGoogle /> Sign Out
          </a>
        </>
      ) : (
        <Link
          href={authUrl}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors font-medium"
        >
          <FaGoogle /> Login with Google
        </Link>
      )}
      {errorMsg && <div className="text-red-500 mt-2">{errorMsg}</div>}
    </div>
  );
}

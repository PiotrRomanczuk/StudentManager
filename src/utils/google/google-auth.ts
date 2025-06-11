import { google } from "googleapis";

// Log environment variables (without sensitive values) for debugging
console.log("Google OAuth Configuration:");
console.log("Client ID exists:", !!process.env.GOOGLE_CLIENT_ID_CALENDAR);
console.log("Client Secret exists:", !!process.env.GOOGLE_CLIENT_SECRET_CALENDAR);
console.log("Redirect URI:", process.env.GOOGLE_REDIRECT_URI);

if (!process.env.GOOGLE_CLIENT_ID_CALENDAR) {
  throw new Error("Missing GOOGLE_CLIENT_ID_CALENDAR environment variable");
}

if (!process.env.GOOGLE_CLIENT_SECRET_CALENDAR) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET_CALENDAR environment variable");
}

if (!process.env.GOOGLE_REDIRECT_URI) {
  throw new Error("Missing GOOGLE_REDIRECT_URI environment variable");
}

const oAuth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID_CALENDAR,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET_CALENDAR,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export default oAuth2Client;

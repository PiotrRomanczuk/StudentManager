import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID_CALENDAR,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET_CALENDAR,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
});


export default oAuth2Client;
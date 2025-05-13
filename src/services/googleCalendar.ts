// import { google } from "googleapis";
// import path from "path";
// import fs from 'fs';

// // If modifying these scopes, delete token.json.
// const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first time.
// const TOKEN_PATH = path.join(process.cwd(), "token.json");
// const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

// export class GoogleCalendarService {
//   private calendar: any;
//   private auth: any;

//   async initialize() {
//     try {
//       // Load client secrets from a local file.
//       const content = fs.readFileSync(CREDENTIALS_PATH);
//       const credentials = JSON.parse(content.toString());
      
//       const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
//       this.auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//       // Check if we have previously stored a token.
//       try {
//         const token = fs.readFileSync(TOKEN_PATH);
//         this.auth.setCredentials(JSON.parse(token.toString()));
//       } catch (err) {
//         // If no token exists, we'll need to handle authentication differently
//         // For now, we'll throw an error
//         throw new Error('No token found. Please authenticate first.');
//       }

//       this.calendar = google.calendar({ version: "v3", auth: this.auth });
//       return true;
//     } catch (error) {
//       console.error("Error initializing Google Calendar:", error);
//       return false;
//     }
//   }

//   async listEvents(maxResults = 10) {
//     try {
//       const response = await this.calendar.events.list({
//         calendarId: "primary",
//         timeMin: new Date().toISOString(),
//         maxResults: maxResults,
//         singleEvents: true,
//         orderBy: "startTime",
//       });

//       return response.data.items;
//     } catch (error) {
//       console.error("Error listing events:", error);
//       throw error;
//     }
//   }

//   async createEvent(event: {
//     summary: string;
//     description?: string;
//     start: { dateTime: string; timeZone: string };
//     end: { dateTime: string; timeZone: string };
//   }) {
//     try {
//       const response = await this.calendar.events.insert({
//         calendarId: "primary",
//         requestBody: event,
//       });

//       return response.data;
//     } catch (error) {
//       console.error("Error creating event:", error);
//       throw error;
//     }
//   }
// }

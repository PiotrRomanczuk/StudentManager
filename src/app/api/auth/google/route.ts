// import { NextResponse } from 'next/server';
// import { google } from 'googleapis';
// import path from 'path';
// import fs from 'fs';

// const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
// const TOKEN_PATH = path.join(process.cwd(), "token.json");

// export async function GET() {
//   try {
//     const content = fs.readFileSync(CREDENTIALS_PATH);
//     const credentials = JSON.parse(content.toString());
    
//     const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//     const authUrl = oAuth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: SCOPES,
//     });

//     return NextResponse.json({ url: authUrl });
//   } catch (error) {
//     console.error('Error generating auth URL:', error);
//     return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const { code } = await request.json();
//     const content = fs.readFileSync(CREDENTIALS_PATH);
//     const credentials = JSON.parse(content.toString());
    
//     const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     // Store the token to disk for later program executions
//     fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error getting tokens:', error);
//     return NextResponse.json({ error: 'Failed to get tokens' }, { status: 500 });
//   }
// } 
import oAuth2Client from "@/utils/google/google-auth";
import Link from "next/link";


export default async function TestingPage() {

  const SCOPE = ['https://www.googleapis.com/auth/drive.file'];

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPE,
  });

  const response = await fetch(authUrl);

  const data = await response.json();



  return <div>Testing
    <Link href={authUrl}>Login with Google</Link>
  </div>;
}


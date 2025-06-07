import { Dropbox } from "dropbox";
import fetch from "node-fetch";

export default async function DropboxPage() {
  const dbx = new Dropbox({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    fetch,
  });

  const files = await dbx.filesListFolder({ path: "" });

  // Get temporary links for each file
  const filesWithLinks = await Promise.all(
    files.result.entries
      .filter((file: any) => file.name.endsWith(".mp3"))
      .map(async (file: any) => {
        const linkRes = await dbx.filesGetTemporaryLink({
          path: file.path_display,
        });
        return {
          ...file,
          tempLink: linkRes.result.link,
        };
      }),
  );

  return (
    <div>
      <h2>Dropbox MP3 Files</h2>
      <ul>
        {filesWithLinks.map((file: any) => (
          <li key={file.id}>
            {file.name}
            <audio
              controls
              src={file.tempLink}
              style={{ display: "block", marginTop: 8 }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

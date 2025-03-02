import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  // make a Get request to the database to get the song by id or by title from the url

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  let song;
  if (id) {
    const { data } = await (await supabase)
      .from("songs")
      .select("*")
      .eq("id", id);
    song = data;
    console.log(song);
  } else if (title) {
    const { data } = await (await supabase)
      .from("songs")
      .select("*")
      .eq("title", title);
    song = data;
    console.log(song);
  }

  if (!song) {
    return NextResponse.json({ success: false, error: "Song not found" });
  }

  return NextResponse.json({ success: true, data: song });
}

// export async function PUT(req: NextRequest) {
// 	try {
// 		const { pathname } = new URL(req.url);
// 		const songId = pathname.split('/').pop();
// 		console.log('ID:');
// 		console.log(songId);
// 		const body = await req.json();
// 		const validatedData = songInputSchema.parse(body);

// 		const db = await openDb();
// 		const {
// 			Title,
// 			Author,
// 			Level,
// 			Key,
// 			Chords,
// 			AudioFiles,
// 			UltimateGuitarLink,
// 			ShortTitle,
// 		} = validatedData;

// 		const result = await db.run(
// 			`UPDATE songs
// 			 SET title = ?, author = ?, level = ?, Key = ?,
// 				 chords = ?, audioFiles = ?, UltimateGuitar = ?, shortTitle = ?
// 			 WHERE id = ?`,
// 			[
// 				Title,
// 				Author,
// 				Level,
// 				Key,
// 				Chords,
// 				AudioFiles,
// 				UltimateGuitarLink,
// 				ShortTitle,
// 				songId,
// 			]
// 		);

// 		if (result.changes === 0) {
// 			return NextResponse.json({ error: 'Song not found' }, { status: 404 });
// 		}

// 		return NextResponse.json({ success: true, data: validatedData });
// 	} catch (error) {
// 		if (error instanceof z.ZodError) {
// 			return NextResponse.json(
// 				{ error: 'Validation error', details: error.errors },
// 				{ status: 400 }
// 			);
// 		}

// 		if (error instanceof APIError) {
// 			return NextResponse.json(
// 				{ error: error.message },
// 				{ status: error.status }
// 			);
// 		}

// 		console.error('Error updating song:', error);
// 		return NextResponse.json(
// 			{ error: 'Internal server error' },
// 			{ status: 500 }
// 		);
// 	}
// }

// /**
//  * DELETE /api/songs
//  * Deletes a song from the database.
//  *
//  * Query Parameters:
//  * - id: string (required): The ID of the song to delete.
//  *
//  * Response:
//  * - success: boolean
//  */

// export async function DELETE(req: NextRequest) {
// 	try {
// 		const db = await openDb();
// 		const { searchParams } = new URL(req.url);
// 		const id = searchParams.get('id');
// 		await db.run('DELETE FROM songs WHERE id = ?', [id]);
// 		return NextResponse.json({ success: true });
// 	} catch (error: unknown) {
// 		return NextResponse.json({ success: false, error: error });
// 	}
// }

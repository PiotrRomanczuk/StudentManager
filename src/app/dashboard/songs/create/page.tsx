// import SongCreateClientForm from './SongCreateClientForm';
type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const songResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/songs?title=${slug}`,
  );
  const song = await songResponse.json();

  if (!song) {
    return <div>Song not found</div>;
  }

  return (
    <div>
      {slug}
      {song}
    </div>
  );
}

// export default async function Page() {
// 	return <div>Create Song</div>;
// }

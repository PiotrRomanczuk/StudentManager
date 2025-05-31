import SpotifyTokenFetcher from "@/components/SpotifyTokenFetcher";

export default function Page() {

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    return (
        <div>
            <SpotifyTokenFetcher clientId={clientId ?? ''} clientSecret={clientSecret ?? ''} />
        </div>
    )
}
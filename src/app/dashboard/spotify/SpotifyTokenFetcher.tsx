"use client";

import React, { useState } from "react";

interface SpotifyTokenFetcherProps {
  clientId: string;
  clientSecret: string;
}

const SpotifyTokenFetcher: React.FC<SpotifyTokenFetcherProps> = ({
  clientId,
  clientSecret,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchToken = async () => {
    setLoading(true);
    setError(null);
    setToken(null);
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setToken(data.access_token);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
        maxWidth: 400,
      }}
    >
      <h3>Spotify Token Fetcher</h3>
      <button
        onClick={fetchToken}
        disabled={loading}
        style={{ marginBottom: 12 }}
      >
        {loading ? "Fetching..." : "Get Spotify Token"}
      </button>
      {token && (
        <div>
          <strong>Access Token:</strong>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {token}
          </pre>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default SpotifyTokenFetcher;

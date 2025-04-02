import { API_HOST } from "$env/static/private";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET({ locals, url  }: RequestEvent) {
    const playlistId = url.searchParams.get("id");

    if (!playlistId) {
        return json({ error: "Playlist ID is required" }, { status: 400 });
    }

    const response = await fetch(`${API_HOST}/playlists/${playlistId}/songs`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${locals.user?.jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        return json({ error: errorData.error || "Error getting songs on playlist" }, { status: response.status });
    }

    const playlists = await response.json();

    return json(playlists);
}
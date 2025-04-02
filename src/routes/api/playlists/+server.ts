import { API_HOST } from "$env/static/private";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET({ locals }: RequestEvent) {
    const response = await fetch(`${API_HOST}/playlists`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${locals.user?.jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        return json({ error: errorData.error || "Error getting playlists" }, { status: response.status });
    }

    const playlists = await response.json();

    return json(playlists);
}

export async function DELETE({ locals, url}: RequestEvent) {
    const id = url.searchParams.get("id");

    if (!id) {
        return json({ error: "Playlist ID is required" }, { status: 400 });
    }

    const response = await fetch(`${API_HOST}/playlists/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${locals.user?.jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        return json({ error: errorData.error || "Error deleting playlist" }, { status: response.status });
    }

    return json({ message: "Playlist deleted successfully" });
} 
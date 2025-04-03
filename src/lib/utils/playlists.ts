import { playlistsStore, selectedPlaylistSongsStore, selectedPlaylistStore } from "$lib/stores/playlistStore2";
import type { Playlist } from "./types";

export async function fetchPlaylists(jwt: string) {
    const response = await fetch(`${"https://music.emilstorgaard.dk/api"}/playlists`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${jwt}` }
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetch Playlists failed.");
    }

    const playlists = await response.json();
    playlistsStore.set(playlists);
}

export async function deletePlaylist(playlist: Playlist | null, jwt: string) {
    if (playlist == null) throw new Error("Playlist not found.");

    if (!confirm(`Are you sure you want to delete "${playlist.name}"?`)) return;

    const response = await fetch(`${"https://music.emilstorgaardandersen.dk/api"}/playlists?id=${playlist.id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${jwt}` }
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete playlist failed.");
    }

    selectedPlaylistSongsStore.set([]);
    selectedPlaylistStore.set(null)

    return
}
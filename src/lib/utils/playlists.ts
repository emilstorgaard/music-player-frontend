import { playlistsStore, selectedPlaylistSongsStore, selectedPlaylistStore } from "$lib/stores/playlistStore2";
import type { Playlist } from "./types";

export async function fetchPlaylists() {
    const response = await fetch("/api/playlists", {
        method: "GET",
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetch Playlists failed.");
    }

    const playlists = await response.json();
    playlistsStore.set(playlists);
}

export async function deletePlaylist(playlist: Playlist | null) {
    if (playlist == null) throw new Error("Playlist not found.");

    if (!confirm(`Are you sure you want to delete "${playlist.name}"?`)) return;

    const response = await fetch(`/api/playlists?id=${playlist.id}`, {
        method: "DELETE"
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete playlist failed.");
    }
        
    const songs = await response.json();
    selectedPlaylistSongsStore.set([]);
    selectedPlaylistStore.set(null)

    return response.json();
}
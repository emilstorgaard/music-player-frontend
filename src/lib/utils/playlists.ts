import { playlistsStore, selectedPlaylistSongsStore, selectedPlaylistStore } from "$lib/stores/playlistStore";
import { API_BASE_URL } from "./config";
import type { Playlist } from "./types";

export async function fetchPlaylists(jwt: string) {
    const response = await fetch(`${API_BASE_URL}/playlists`, {
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

export async function createPlaylist(name: string, image: File | null, jwt: string) {
    if (!name || typeof name !== "string") {
        throw new Error("Name is required.");
    }

    if (image && !(image instanceof File)) {
        throw new Error("Invalid image.");
    }

    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const formData = new FormData();
    formData.append("name", name);

    if (image) {
        formData.append("coverImageFile", image);
    }

    const response = await fetch(`${API_BASE_URL}/playlists`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${jwt}` },
        body: formData,
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Create Playlist failed.");
    }

    return;
}

export async function deletePlaylist(playlist: Playlist | null, jwt: string) {
    if (playlist == null) throw new Error("Playlist not found.");

    if (!confirm(`Are you sure you want to delete "${playlist.name}"?`)) return;

    const response = await fetch(`${API_BASE_URL}/playlists/${playlist.id}`, {
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

export async function updatePlaylist(playlistId: number, name: string, image: File | null, jwt: string) {
    if (typeof name !== 'string' || !name) {
        throw new Error("Invalid data.");
    }

    if (image && !(image instanceof File)) {
        throw new Error("Invalid image file.");
    }

    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const formData = new FormData();
    formData.append("name", name);

    if (image) {
        formData.append("coverImageFile", image);
    }

    const response = await fetch(`${API_BASE_URL}/Playlists/${playlistId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update playlist.");
    }

    return;
}

export async function likePlaylist(playlistId: number, jwt: string) {
    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const response = await fetch(`${API_BASE_URL}/Playlists/${playlistId}/like`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like playlist.");
    }

    return;
}

export async function dislikePlaylist(playlistId: number, jwt: string) {
    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const response = await fetch(`${API_BASE_URL}/Playlists/${playlistId}/dislike`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to dislike playlist.");
    }

    return;
}
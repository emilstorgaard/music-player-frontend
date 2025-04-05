import { selectedPlaylistSongsStore } from "$lib/stores/playlistStore";
import { API_BASE_URL } from "./config";

export async function uploadSong(title: string, artist: string, image: File | null, audio: File | null, jwt: string) {
    if (typeof title !== 'string' || typeof artist !== 'string' || !title || !artist || !audio || !(audio instanceof File)) {
        throw new Error("Invalid data.");
    }

    if (image && !(image instanceof File)) {
        throw new Error("Invalid data.");
    }

    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audioFile", audio);

    if (image) {
        formData.append("coverImageFile", image);
    }

    const response = await fetch(`${API_BASE_URL}/songs`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${jwt}`
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload song failed.");
    }
    
    return;
}

export const fetchSongs = async (playlistId: number, jwt: string | undefined) => {
    if (!jwt) {
        throw new Error("Not logged in.");
    }
       

    const response = await fetch(`${API_BASE_URL}/Playlists/${playlistId}/songs`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${jwt}` }
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Get songs on playlist failed.");
    }
        
    const songs = await response.json();

    selectedPlaylistSongsStore.set(songs);
    return;
};

export const addSongToPlaylist = async (playlistId: number, selectedSongId: number, jwt: string) => {
    const response = await fetch(`${API_BASE_URL}/Playlists/${playlistId}/songs/${selectedSongId}`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error('Failed to add song to playlist');

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add song to playlist.");
    }
}

export const updateSong = async (songId: number, title: string, artist: string, image: File | null, audio: File | null, jwt: string) => {
    if (typeof title !== 'string' || typeof artist !== 'string' || !title || !artist) {
        throw new Error("Invalid data.");
    }
    
    if (image && !(image instanceof File)) {
        throw new Error("Invalid image file.");
    }

    if (audio && !(audio instanceof File)) {
        throw new Error("Invalid audio file.");
    }

    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);

    if (image) {
        formData.append("coverImageFile", image);
    }

    if (audio) {
        formData.append("audioFile", audio);
    }

    const response = await fetch(`${API_BASE_URL}/Songs/${songId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Update song failed.");
    }
    
    return;
}

export const deleteSong = async (songId: number, jwt: string) => {
    const response = await fetch(`${API_BASE_URL}/Songs/${songId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwt}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error while deleting song.");
    }
    
    return;
};

export async function likeSong(songId: number, jwt: string) {
    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const response = await fetch(`${API_BASE_URL}/Songs/${songId}/like`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like song.");
    }

    return;
}

export async function dislikeSong(songId: number, jwt: string) {
    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const response = await fetch(`${API_BASE_URL}/Songs/${songId}/dislike`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to dislike song.");
    }

    return;
}
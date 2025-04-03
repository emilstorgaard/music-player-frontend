import { selectedPlaylistSongsStore } from "$lib/stores/playlistStore2";
import { getCookie } from "$lib/utils/cookies";

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

    const response = await fetch(`${"https://music.emilstorgaard.dk/api"}/songs`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${jwt}` // Include the JWT in the Authorization header
        },
        body: formData, // Send the form data
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.log("okay kaldet fejler")
        throw new Error(errorData.error || "Upload song failed.");
    }
    
    return;
}

export const fetchSongs = async (playlistId: number ) => {
    const response = await fetch(`${"https://music.emilstorgaard.dk/api"}/Playlists/${playlistId}/songs`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${getCookie("jwt")}` }
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
    const response = await fetch(`${"https://music.emilstorgaard.dk/api"}/Playlists/${playlistId}/songs/${selectedSongId}`, {
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
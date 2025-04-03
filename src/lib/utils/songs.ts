import { selectedPlaylistSongsStore } from "$lib/stores/playlistStore2";

export async function uploadSong(title: string, artist: string, image: File | null, audio: File | null) {
    if (!title || !artist || !audio) {
        throw new Error("Invalid data.");
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    if (image) formData.append('image', image);
    formData.append('audio', audio);
    
    const response = await fetch("/api/uploadsong", {
        method: "POST",
        headers: { 
            // No need to set "Content-Type"; the browser will handle it.
        },
        body: formData // Pass FormData directly
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload song failed.");
    }

    return response.json();
}

export const fetchSongs = async (playlistId: number ) => {
    const response = await fetch(`/api/songs?id=${playlistId}`, {
        method: "GET"
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Get songs on playlist failed.");
    }
        
    const songs = await response.json();
    selectedPlaylistSongsStore.set(songs);

    return response.json();
};
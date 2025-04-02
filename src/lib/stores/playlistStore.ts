import { writable, derived  } from 'svelte/store';
import type { Playlist, Song } from '$lib/utils/types';

export const selectedPlaylist = writable<Playlist | null>(null);
export const selectedPlaylistSongs = writable<Song[]>([]);
export const error = writable<string | null>(null)

// Fetch songs when playlist changes
export const fetchSongs = async (playlistId: number) => {
    console.log("den henter sangene")
    try {
        const res = await fetch(`${"https://music.emilstorgaard.dk/api"}/Playlists/${playlistId}/songs`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

        const data: Song[] = await res.json();
        selectedPlaylistSongs.set(data);
        error.set(null);
    } catch (err: any) {
        error.set('Error fetching songs: ' + err.message);
    }
};

// Automatically fetch songs when `selectedPlaylist` changes
export const derivedSongs = derived(selectedPlaylist, ($selectedPlaylist, set) => {
    if ($selectedPlaylist) {
        fetchSongs($selectedPlaylist.id);
    }
});

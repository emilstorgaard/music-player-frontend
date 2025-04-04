import { writable } from 'svelte/store';
import type { Playlist, Song } from '$lib/utils/types';

export const playlistsStore = writable<Playlist[]>([]);
export const errorStore = writable<string | null>(null);

export const selectedPlaylistStore = writable<Playlist | null>(null);
export const selectedPlaylistSongsStore = writable<Song[]>([]);
export const selectedPlaylistSongserrorStore = writable<string | null>(null);

export const selectedPlaylistSongStore = writable<Song | null>(null);
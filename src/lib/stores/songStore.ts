import { writable } from 'svelte/store';
import type { Song } from '$lib/utils/types';

export const volume = writable<number>(1.0);
export const isPaused = writable<boolean>(true);
export const currentTime = writable<number>(0);
export const duration = writable<number>(0);
export const currentSongIndex = writable<number | null>(null);
export const currentSong = writable<Song | null>(null);
export const shuffledOrder = writable<number[]>([]);
export const isShuffleEnabled = writable<boolean>(false);
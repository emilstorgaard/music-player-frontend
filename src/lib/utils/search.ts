import { writable } from 'svelte/store';
import type { Song, Playlist, Search } from './types';

export const searchQuery = writable(''); // Store the search query
export const search = writable<Search>({ playlists: [], songs: [] }); // Reactive store for search results

export const searchResults = async (query: string) => {
    try {
        const response = await fetch(`https://music.emilstorgaard.dk/api/Search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }

        const data: Search = await response.json();
        search.set(data); // Update the search store with fetched data
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};
import { writable } from 'svelte/store';
import type { Search } from './types';

export const searchQuery = writable('');
export const search = writable<Search>({ playlists: [], songs: [] });

export const searchResults = async (query: string) => {
    try {
        const response = await fetch(`${"https://music.emilstorgaard.dk/api"}/Search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }

        const data: Search = await response.json();
        search.set(data);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};
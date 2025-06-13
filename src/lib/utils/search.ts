import { writable } from 'svelte/store';
import type { Search } from './types';
import { API_BASE_URL } from './config';

export const searchQuery = writable('');
export const search = writable<Search>({ playlists: [], songs: [] });

export const getSearchResults = async (query: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Search?query=${encodeURIComponent(query)}`, {
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
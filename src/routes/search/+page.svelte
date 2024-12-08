<script lang="ts">
    import PlaylistList from '$lib/components/PlaylistList.svelte';
    import SongList from '$lib/components/SongList.svelte';
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';

    interface Song {
        id: number;
        title: string;
        artist: string;
        filePath: string;
    }

    interface Playlist {
        id: number;
        name: string;
        createdAtUtc: string;
    }

    interface Search {
        playlists: Playlist[];
        songs: Song[];
    }

    const searchQuery = writable(''); // Store the search query
    const search = writable<Search>({ playlists: [], songs: [] }); // Reactive store for search results

    const searchResults = async (query: string) => {
        try {
            const response = await fetch(`https://music.emilstorgaard.dk/api/Search?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: Search = await response.json();
            search.set(data); // Update the search store with fetched data
        } catch (error) {
            console.error('Error fetching search:', error);
        }
    };

    // Handle search on query change but only in client-side environment
    onMount(() => {
        const unsubscribe = searchQuery.subscribe((query) => {
            if (query) {
                searchResults(query);
            }
        });

        return () => unsubscribe();
    });

    // Function to handle the input change
    const handleSearchChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        searchQuery.set(target.value);
    };
</script>

<main class="max-w-screen-sm mx-auto p-4 sm:p-6">
    <div class="bg-gray-900 text-white rounded-lg p-6 shadow-lg max-w-auto">
        <!-- Search Input -->
        <input
            type="text"
            placeholder="Search songs or playlists..."
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            on:input={handleSearchChange}
        />
    
        {#if $search.songs.length > 0}
            <h1>Songs</h1>
            <SongList songs={$search.songs} />
        {/if}
        
        {#if $search.playlists.length > 0}
            <h1>Playlists</h1>
            <PlaylistList playlists={$search.playlists} />
        {/if}
    </div>
</main>

<style>
    /* Styling for the range slider thumb */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: #22c55e;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: #22c55e;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]::-ms-thumb {
        width: 16px;
        height: 16px;
        background: #22c55e;
        border-radius: 50%;
        cursor: pointer;
    }
</style>

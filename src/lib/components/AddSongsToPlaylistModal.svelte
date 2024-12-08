<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { writable } from 'svelte/store';

    export let playlistId: Number;

    const dispatch = createEventDispatcher();

    interface Song {
        id: number;
        title: string;
        artist: string;
    }

    interface Search {
        songs: Song[];
    }

    const searchQuery = writable('');
    const searchResults = writable<Search>({ songs: [] });

    async function fetchSearchResults(query: string) {
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
            searchResults.set(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    function handleSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        searchQuery.set(target.value);
    }

    searchQuery.subscribe((query) => {
        if (query.trim()) {
            fetchSearchResults(query);
        } else {
            searchResults.set({ songs: [] });
        }
    });

    let selectedSongId: number | null = null;

    async function addSongToPlaylist() {
        if (selectedSongId) {
            try {
                const response = await fetch(`https://music.emilstorgaard.dk/api/Playlists/${playlistId}/songs/${selectedSongId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Failed to add song to playlist');
                }

                alert('Song added to playlist successfully!');
                dispatch('add');
                //dispatch('close');
            } catch (error) {
                console.error('Error adding song to playlist:', error);
                alert('Could not add song to playlist');
            }
        } else {
            alert('Please select a song first');
        }
    }

    function closeModal() {
        dispatch('close');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-900 text-white rounded-lg p-6 shadow-xl w-full max-w-lg">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Add Song to Playlist</h2>
            <button
                on:click={closeModal}
                class="text-2xl text-gray-400 hover:text-white transition duration-200 focus:outline-none"
                aria-label="Close Modal"
            >
                x
            </button>
        </div>

        <!-- Search Input -->
        <div class="mb-4">
            <input
                type="text"
                placeholder="Search for a song..."
                on:input={handleSearch}
                class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>

        <!-- Search Results -->
        {#if $searchResults.songs.length > 0}
            <ul class="space-y-2">
                {#each $searchResults.songs as song}
                    <li
                        class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                        on:click={() => (selectedSongId = song.id)}
                        class:selected={selectedSongId === song.id}
                        on:click={addSongToPlaylist}
                    >
                        <span>{song.title} - {song.artist}</span>
                        <span
                            class="text-sm text-green-400"
                            class:opacity-100={selectedSongId === song.id}
                            class:opacity-0={selectedSongId !== song.id}
                        >
                            Selected
                        </span>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="text-gray-400 text-center">No songs found</p>
        {/if}
    </div>
</div>


<style>
    li.selected {
        background-color: #22c55e;
        color: #fff;
    }
</style>

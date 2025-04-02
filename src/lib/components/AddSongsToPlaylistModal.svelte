<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { searchQuery, search, searchResults } from '$lib/utils/search';
    import { page } from '$app/stores';

    export let playlistId: number;

    const dispatch = createEventDispatcher();

    function handleSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        searchQuery.set(target.value);
    }

    searchQuery.subscribe((query) => {
        if (query.trim()) {
            searchResults(query);
        } else {
            search.set({ songs: [], playlists: [] });
        }
    });

    let selectedSongId: number | null = null;

    async function addSongToPlaylist() {
        if (selectedSongId) {
            try {
                const response = await fetch(`${$page.data.API_HOST}/Playlists/${playlistId}/songs/${selectedSongId}`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${$page.data.loggedInUser.jwt}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Failed to add song to playlist');
                dispatch('add');
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
    <div class="bg-dark-gray text-white rounded-lg p-6 shadow-xl w-full max-w-lg">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Add Song to Playlist</h2>
            <button
                on:click={closeModal}
                class="text-2xl text-light-gray hover:text-white transition duration-200 focus:outline-none"
                aria-label="Close Modal"
            >
                x
            </button>
        </div>

        <div class="mb-4">
            <input
                type="text"
                placeholder="Search for a song..."
                on:input={handleSearch}
                class="w-full px-4 py-2 bg-dark-gray text-white rounded-lg border border-gray focus:outline-none focus:ring-2 focus:ring-green"
            />
        </div>

        {#if $search.songs.length > 0}
            <ul class="space-y-2">
                {#each $search.songs as song}
                    <li
                        class="p-2 rounded-lg bg-dark-gray hover:bg-gray cursor-pointer flex items-center justify-between"
                        on:click={() => (selectedSongId = song.id)}
                        class:selected={selectedSongId === song.id}
                        on:click={addSongToPlaylist}
                    >
                        <span>{song.title} - {song.artist}</span>
                        <span
                            class="text-sm text-green"
                            class:opacity-100={selectedSongId === song.id}
                            class:opacity-0={selectedSongId !== song.id}
                        >
                            Selected
                        </span>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="text-light-gray text-center">No songs found</p>
        {/if}
    </div>
</div>


<style>
    li.selected {
        background-color: #22c55e;
        color: #fff;
    }
</style>

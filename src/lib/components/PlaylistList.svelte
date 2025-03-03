<script lang="ts">
    import { onMount } from 'svelte';
    import PlaylistCreateModal from '$lib/components/PlaylistCreateModal.svelte';
    import type { Playlist } from '$lib/utils/types';

    import { createEventDispatcher } from 'svelte';

    export let selectedPlaylist: Playlist | null = null;

    let playlists: Playlist[] = [];
    const dispatch = createEventDispatcher(); // For emitting events to parent

    let error: string | null = null;
    let loading = true;

    let showModal = false;

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    async function fetchPlaylists() {
        try {
            const response = await fetch('https://music.emilstorgaard.dk/api/Playlists');
            if (!response.ok) {
                throw new Error('Failed to fetch playlists');
            }
            playlists = await response.json();
            handlePlaylistClick(playlists[0])
        } catch (err: any) {
            error = err.message || 'An unexpected error occurred.';
        } finally {
            loading = false;
        }
    }

    // Emit event when a playlist is clicked
    const handlePlaylistClick = (playlist: Playlist) => {
        dispatch('select', playlist); // Pass playlistId to parent
    };

    onMount(fetchPlaylists);
</script>

<div>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-left">Your Playlists</h2>
        <button class="p-2 rounded-full hover:bg-green focus:outline-none focus:ring-2 focus:ring-pink-500 transition" on:click={openModal} title="Create Playlist">
            <!-- Add Icon (SVG) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    </div>
    
    <div class="border-t border-gray my-2"></div>

    {#if error}
        <p class="text-red-500 font-semibold">{error}</p>
    {/if}

    {#if loading}
        <p class="text-gray">Loading playlists...</p>
    {:else}
        {#each playlists as playlist}
        <div class="p-2 rounded-md flex items-center gap-4 justify-between hover:bg-gray hover:cursor-pointer transition">
            <img src="https://music.emilstorgaard.dk/api/Playlists/{playlist.id}/cover" alt="{playlist.name}" class="w-16 h-16 rounded-md object-cover" />
            <button class="text-left w-full">
                <p class="text-lg font-medium line-clamp-1">{playlist.name}</p>
                <button 
                >
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        fill={playlist.isLiked ? 'red' : 'none'} 
                        viewBox="0 0 24 24" 
                        stroke-width="1.5" 
                        stroke="currentColor" 
                        class="w-6 h-6 text-red-500 hover:text-red-700 transition duration-150">
                        <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            d="M21.8 8.1c0-2.8-2.3-5.1-5.1-5.1-1.4 0-2.7.6-3.7 1.6-.9-1-2.3-1.6-3.7-1.6-2.8 0-5.1 2.3-5.1 5.1 0 3.7 3.4 6.6 8.1 11 4.7-4.4 8.1-7.3 8.1-11z" 
                        />
                    </svg>
                </button>
            </button>
        </div>
        {/each}
    {/if}

    {#if showModal}
        <PlaylistCreateModal on:close={closeModal} on:created={fetchPlaylists}  />
    {/if}
</div>
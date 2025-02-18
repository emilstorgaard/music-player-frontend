<script lang="ts">
    import { onMount } from 'svelte';
    import PlaylistCreateModal from '$lib/components/PlaylistCreateModal.svelte';
    import type { Playlist } from '$lib/utils/types';

    import { createEventDispatcher } from 'svelte';
	import CustomContainer from './CustomContainer.svelte';

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


<CustomContainer>
    <div class="mb-3">

        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-semibold text-light-gray">Your Playlists</h2>
            <button  class="bg-green p-3 rounded-full hover:bg-light-green focus:outline-none focus:ring-2 focus:ring-green transition duration-150" on:click={openModal} title="Create Playlist">
                <img src="/add.png" alt="Create Playlist" class="h-4 w-4" />
            </button>
        </div>

    </div>
    
    <div class="border-t border-gray my-6"></div>

    {#if error}
        <p class="text-red-500 font-semibold">{error}</p>
    {/if}

    {#if loading}
        <p class="text-gray">Loading playlists...</p>
    {:else}
        <ul>
            {#each playlists as playlist}
            <li class="border-b border-gray hover:bg-dark-gray flex items-center gap-2 p-2">
                <img src="https://music.emilstorgaard.dk/api/Playlists/{playlist.id}/cover" alt="{playlist.name}" class="w-12 h-12 rounded-md object-cover" />
            
                <button 
                    on:click={() => handlePlaylistClick(playlist)}
                    class="flex justify-between items-center hover:text-green w-full text-left bg-transparent border-none cursor-pointer"
                >
                    <span class="font-semibold">{playlist.name}</span>
                    <span class="text-sm text-light-gray">
                        {new Date(playlist.createdAtUtc).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        })}
                    </span>
                </button>
            </li>
            {/each}
        </ul>
    {/if}

    {#if showModal}
        <PlaylistCreateModal on:close={closeModal} on:created={fetchPlaylists}  />
    {/if}
    
</CustomContainer>
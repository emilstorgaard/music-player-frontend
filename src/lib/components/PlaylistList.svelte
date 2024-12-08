<script lang="ts">
    import { onMount } from 'svelte';
    import PlaylistCreateModal from '$lib/components/PlaylistCreateModal.svelte';

    let playlists: Playlist[] = [];
    let error: string | null = null;
    let loading = true;

    interface Playlist {
        id: number;
        name: string;
        createdAtUtc: string;
    }

    onMount(async () => {
        await loadPlaylists();
    });

    let showModal = false;

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    async function loadPlaylists() {
        try {
            const response = await fetch('https://music.emilstorgaard.dk/api/Playlists');
            if (!response.ok) {
                throw new Error('Failed to fetch playlists');
            }
            playlists = await response.json();
        } catch (err: any) {
            error = err.message || 'An unexpected error occurred.';
        } finally {
            loading = false;
        }
    }

</script>

<div class="bg-gray-900 text-white rounded-lg p-6 shadow-lg max-w-auto">

    <div class="flex justify-between items-center">
        <h2 class="text-2xl font-semibold text-gray-100">Playlists</h2>
        <button class="bg-green-500 p-3 rounded-full hover:bg-green-400 mb-4" on:click={openModal} title="Create Playlist">
            <img src="/add.png" alt="Create Playlist" class="h-4 w-4" />
        </button>
    </div>

    {#if error}
        <p class="text-red-500 font-semibold">{error}</p>
    {/if}

    {#if loading}
        <p class="text-gray-500">Loading playlists...</p>
    {:else}
        <ul>
            {#each playlists as playlist}
            <li class="py-2 border-b border-gray-600 hover:bg-gray-800">
                <a 
                    href={`/Playlists/${playlist.id}`} 
                    class="flex justify-between items-center hover:text-green-400"
                    title="View Playlist"
                >
                    <span class="font-semibold">{playlist.name}</span>
                    <span class="text-sm text-gray-400">
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
                </a>
            </li>
            {/each}
        </ul>
    {/if}

    {#if showModal}
        <PlaylistCreateModal on:close={closeModal} on:created={loadPlaylists}  />
    {/if}
</div>

<style>
    /* Styling for consistency with the SongList component */
    .bg-gray-900 {
        background-color: #1a202c;
    }

    .hover\:bg-gray-800:hover {
        background-color: #2d3748;
    }

    .hover\:bg-green-400:hover {
        background-color: #38a169;
    }

    .hover\:text-green-400:hover {
        color: #38a169;
    }
</style>

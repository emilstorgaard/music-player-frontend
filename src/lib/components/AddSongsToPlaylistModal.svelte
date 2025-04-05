<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { searchQuery, search, searchResults } from '$lib/utils/search';
	import { userStore } from '$lib/stores/auth';
	import { addSongToPlaylist } from '$lib/utils/songs';
	import Modal from './Modal.svelte';

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

    let errorMessage = ""

    async function handleAddSongToPlaylist(event: SubmitEvent) {
        event.preventDefault();

        const jwt = $userStore?.jwt
        if (!jwt) throw new Error("Authentication token (JWT) is required.");

        if (!selectedSongId) throw new Error("Song was not selected.");

        try {
            await addSongToPlaylist(playlistId, selectedSongId, jwt);

            dispatch('add');
        } catch (error: any) {
            errorMessage = error.message;
        }
    }

    function closeModal() {
        dispatch('close');
    }
</script>

<Modal title="Add Songs to Playlist" on:close={closeModal}>
        <input
            type="text"
            placeholder="Search for a song..."
            on:input={handleSearch}
            class="w-full bg-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green mb-2"
        />

        {#if $search.songs.length > 0}
            <ul class="space-y-2">
                {#each $search.songs as song}
                    <li
                        class="p-2 rounded-lg bg-dark-gray hover:bg-gray cursor-pointer flex items-center justify-between"
                        on:click={() => (selectedSongId = song.id)}
                        class:selected={selectedSongId === song.id}
                        on:click={handleAddSongToPlaylist}
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

        {#if errorMessage}
            <p class="text-red-500">{errorMessage}</p>
        {/if}
</Modal>


<style>
    li.selected {
        background-color: #22c55e;
        color: #fff;
    }
</style>

<script lang="ts">
    import PlaylistList from '$lib/components/PlaylistList.svelte';
    import { selectedPlaylistStore, playlistsStore } from '$lib/stores/playlistStore';
	import PlaylistCreateModal from '$lib/components/PlaylistCreateModal.svelte';
    import { deletePlaylist } from '$lib/utils/playlists';
    import AddSongsToPlaylistModal from '$lib/components/AddSongsToPlaylistModal.svelte';
    import EditPlaylistModal from '$lib/components/EditPlaylistModal.svelte';
    import { fetchSongs } from '$lib/utils/songs'
	import { userStore } from '$lib/stores/auth';
	import SongList from '$lib/components/SongList.svelte';
    import { fetchPlaylists } from '$lib/utils/playlists';
	import { API_BASE_URL } from '$lib/utils/config';
	import { triggerToast } from '$lib/stores/toastStore';

    let showSettings = false;
    let showAddSongModal = false;
    let showEditPlaylistModal = false;
    let showModal = false;

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    async function handleDeletePlaylist() {
        try {
			const jwt = $userStore?.jwt

            if (!jwt) throw new Error("Authentication token (JWT) is required.");

            await deletePlaylist($selectedPlaylistStore, jwt)
            await fetchPlaylists(jwt);
			close()
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }

    async function handleCreate() {
        closeModal();

        const jwt = $userStore?.jwt

        if (!jwt) throw new Error("Authentication token (JWT) is required.");

        await fetchPlaylists(jwt);
    }

    async function handleUpdate() {
        try {
            const jwt = $userStore?.jwt;

            if (!jwt) throw new Error("Authentication token (JWT) is required.");

            await fetchPlaylists(jwt);
            const selectedPlaylist = $selectedPlaylistStore;
            const updatedPlaylist = $playlistsStore.find(playlist => playlist.id === selectedPlaylist?.id);
            if (updatedPlaylist) {
                selectedPlaylistStore.set(updatedPlaylist);
            } else {
                console.error('Updated playlist not found in the store.');
            }

           
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }

    const openAddSongModal = () => { showSettings = false; showAddSongModal = true; };
    const closeAddSongModal = () => { showAddSongModal = false; };

    const openEditPlaylistModal = () => { showSettings = false; showEditPlaylistModal = true; };
    const closeEditPlaylistModal = () => { showEditPlaylistModal = false; };
</script>

<div class="flex-grow flex flex-col lg:flex-row gap-4 px-4">
    <div class="max-h-[75vh] sm:h-[calc(100vh-14rem)] sm:max-h-none sm:mb-0 lg:w-1/4 w-full flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto">
        <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray">
            <h2 class="text-xl font-semibold text-white text-left">Your Playlists</h2>
            <button class="p-2 rounded-full hover:bg-green transition" on:click={openModal} title="Create Playlist">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
        
        {#if $userStore}
        <PlaylistList />
        {:else}
            <p class="text-red-500">You are not logged in</p>
        {/if}

        {#if showModal}
            <PlaylistCreateModal on:close={closeModal} on:create={handleCreate} />
        {/if}
    </div>

    {#if $selectedPlaylistStore}
    <div class="max-h-[75vh] mb-44 sm:h-[calc(100vh-14rem)] sm:max-h-none sm:mb-0 lg:w-3/4 w-full flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto">
        <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray">
            <div class="flex items-center gap-4">
                <img src="{API_BASE_URL}/songs/cover/{$selectedPlaylistStore?.coverImagePath}"  
                    alt={$selectedPlaylistStore?.name} 
                    class="w-16 h-16 rounded-md object-cover" />
                <h2 class="text-xl font-semibold text-white text-left">{$selectedPlaylistStore?.name}</h2>
            </div>
            <button title="Settings" on:click={() => showSettings = !showSettings} class="p-2 rounded-full hover:bg-green transition ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="19" r="1" />
                </svg>
            </button>

            {#if showSettings}
                <div class="absolute right-10 z-10 mt-40 w-56 origin-top-right rounded-md bg-gray shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <button title="Add Songs To Playlist" on:click={openAddSongModal} class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-light-gray">Add Songs</button>
                    <button title="Edit Playlist" on:click={openEditPlaylistModal} class="block w-full text-left rounded-md px-4 py-2 text-sm text-white hover:bg-light-gray">Edit</button>
                    <button title="Delete Playlist" on:click={handleDeletePlaylist} class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-red-600">Delete</button>
                </div>
            {/if}
        </div>

        <SongList />
        
        {#if showAddSongModal}
            <AddSongsToPlaylistModal on:close={closeAddSongModal} on:add={() => fetchSongs($selectedPlaylistStore?.id, $userStore?.jwt)} playlistId={$selectedPlaylistStore?.id} />
        {/if}

        {#if showEditPlaylistModal}
            <EditPlaylistModal on:close={closeEditPlaylistModal} on:update={handleUpdate} />
        {/if}
    </div>
    {/if}

</div>
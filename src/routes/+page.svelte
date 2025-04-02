<script lang="ts">
    import PlaylistList from '$lib/components/PlaylistList.svelte';
    import { selectedPlaylistStore } from '$lib/stores/playlistStore2';
	import PlaylistCreateModal from '$lib/components/PlaylistCreateModal.svelte';

    let showModal = false;

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    import { page } from '$app/stores';

    let showSettings = false;
    let showAddSongModal = false;
    let showEditPlaylistModal = false;

    async function handleDeletePlaylist() {
        try {
            await deletePlaylist($selectedPlaylistStore)
			close()
        } catch (error: any) {
            errorMessage = error.message;
        }
    }

    let errorMessage = "";


	import { deletePlaylist } from '$lib/utils/playlists';
    import AddSongsToPlaylistModal from '$lib/components/AddSongsToPlaylistModal.svelte';
    import EditPlaylistModal from '$lib/components/EditPlaylistModal.svelte';
    import { fetchSongs } from '$lib/utils/songs'
	import { userStore } from '$lib/stores/auth';
	import SongList from '$lib/components/SongList.svelte';
	import { testFunction } from '$lib/utils/test';


    const openAddSongModal = () => { showSettings = false; showAddSongModal = true; };
    const closeAddSongModal = () => { showAddSongModal = false; };

    const openEditPlaylistModal = () => { showSettings = false; showEditPlaylistModal = true; };
    const closeEditPlaylistModal = () => { showEditPlaylistModal = false; };

    let errorMessageTest = "";

async function handleTest() {
    try {
        console.log("you clicked me")
        await testFunction()
        console.log("der kom ikke en fejl")
    } catch (error: any) {
        errorMessageTest = error.message;
    }
}

</script>

<button on:click={handleTest} class="bg-blue-600">test</button>
{#if errorMessageTest}
    <p class="text-red-500">{errorMessageTest}</p>
{/if}

<div class="flex-grow flex flex-col lg:flex-row gap-4 px-4">
    <div class="h-[70vh] lg:w-1/4 w-full flex flex-col border bg-dark-gray rounded-lg shadow-lg p-4">

        <div class="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 class="text-xl font-semibold text-white text-left">Playlists</h2>
            <button class="p-2 rounded-full hover:bg-green focus:outline-none focus:ring-2 focus:ring-pink-500 transition" on:click={openModal} title="Create Playlist">
                <!-- Add Icon (SVG) -->
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
        <!-- on:create={fetchPlaylists} -->
            <PlaylistCreateModal on:close={closeModal} />
        {/if}
    </div>

        
    <div class="h-[70vh] lg:w-3/4 w-full flex flex-col border bg-dark-gray rounded-lg shadow-lg p-4">
        {#if $selectedPlaylistStore}
            <div class="flex justify-between items-center mb-4 pb-2 border-b">
                <div class="flex items-center gap-4">
                    <img src="{$page.data.API_HOST}/Playlists/{$selectedPlaylistStore?.id}/cover" 
                        alt={$selectedPlaylistStore?.name} 
                        class="w-16 h-16 rounded-md object-cover" />
                    <h2 class="text-xl font-semibold text-white text-left">{$selectedPlaylistStore?.name}</h2>
                </div>
                <button on:click={() => showSettings = !showSettings} class="p-2 rounded-full hover:bg-green focus:outline-none focus:ring-2 focus:ring-pink-500 transition ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>

                <!-- Settings Dropdown -->
                {#if showSettings}
                    <div class="absolute right-0 z-10 mt-8 w-56 origin-top-right rounded-md bg-gray shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <button on:click={openAddSongModal} class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-light-gray">Add Songs</button>
                        <button on:click={openEditPlaylistModal} class="block w-full text-left rounded-md px-4 py-2 text-sm text-white hover:bg-light-gray">Edit</button>
                        <button on:click={handleDeletePlaylist} class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-red-600">Delete</button>
                    </div>
                {/if}
            </div>

            <SongList />
            
            <!-- Modals -->
            {#if showAddSongModal}
                <AddSongsToPlaylistModal on:close={closeAddSongModal} on:add={() => fetchSongs($selectedPlaylistStore?.id)} playlistId={$selectedPlaylistStore?.id} />
            {/if}
    
            {#if showEditPlaylistModal}
                <EditPlaylistModal on:close={closeEditPlaylistModal} playlist={$selectedPlaylistStore} />
            {/if}
        {/if}

    </div>

</div>



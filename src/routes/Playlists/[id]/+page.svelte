<script lang="ts">
    import { getPlaylist, getSongs } from '$lib/utils/utils';
    export let data: { playlist: Playlist, songs: Song[] };
    import SongList from '$lib/components/SongList.svelte';
    import { goto } from '$app/navigation';
	  import AddSongsToPlaylistModal from '$lib/components/AddSongsToPlaylistModal.svelte';
    import EditPlaylistModal from '$lib/components/EditPlaylistModal.svelte';

    import { playlistSongs } from "$lib/utils/audioStore";

    playlistSongs.set(data.songs);

    interface Playlist {
        id: number;
        name: string;
        createdAtUtc: string;
    }

    interface Song {
        id: number;
        title: string;
        artist: string;
        filePath: string;
    }

    let showSettings = false;
    let showAddSongModal = false;
    let showEditPlaylistModal = false;

    function openAddSongModal() {
        showSettings = false
        showAddSongModal = true;
    }

    function closeAddSongModal() {
        showAddSongModal = false;
    }

    function openEditPlaylistModal() {
      showSettings = false
      showEditPlaylistModal = true;
    }

    function closeEditPlaylistModal() {
      showEditPlaylistModal = false;
    }

    async function reloadPlaylist() {
        try {
            const updatedPlaylist = await getPlaylist(data.playlist.id.toString());
            data.playlist = updatedPlaylist;
        } catch (error) {
            console.error('Error reloading playlist:', error);
        }
    }

    async function reloadSongs() {
        try {
            const songs = await getSongs(data.playlist.id.toString());
            data.songs = songs;
        } catch (error) {
            console.error('Error reloading songs:', error);
        }
    }
    
    async function deletePlaylist() {
        showSettings = false
        const confirmed = confirm(`Are you sure you want to delete the playlist "${data.playlist.name}"?`);
        if (!confirmed) return;

        try {
            const response = await fetch(`https://music.emilstorgaard.dk/api/Playlists/${data.playlist.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete playlist: ${response.statusText}`);
            }

            goto('/Playlists');
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting the playlist.');
        }
    }

</script>

<div class="bg-gray-900 text-white rounded-lg p-6 shadow-xl max-w-screen-sm mx-auto">
    <div class="mb-3">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-gray-400">ID: {data.playlist.id}</span>
        <span class="text-sm text-gray-400">Created: {new Date(data.playlist.createdAtUtc).toLocaleDateString()}</span>
      </div>
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-semibold text-gray-100">{data.playlist.name}</h2>
        <button on:click={() => showSettings = !showSettings} class="bg-green-500 p-3 rounded-full hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150">
          <img src="/menu.png" alt="Settings" class="h-5 w-5" />
        </button>
      </div>
    </div>
  
    <div class="relative">
        <!-- Settings Options - Show on hover -->
        {#if showSettings}
          <div class="absolute right-0 w-48 shadow-xl rounded-lg p-3">
            <div class="bg-gray-800 text-white rounded-lg p-6 shadow-lg w-full max-w-xs">
              <button 
              on:click={openAddSongModal}
                class="w-full text-left text-gray-200 hover:bg-gray-700 p-3 rounded-lg transition duration-200" 
                title="Add Songs">
                Add Song
              </button>
              <button 
              on:click={openEditPlaylistModal}
                class="w-full text-left text-gray-200 hover:bg-gray-700 p-3 rounded-lg transition duration-200" 
                title="Add Songs">
                Edit Playlist
              </button>
              <button 
                class="w-full text-left text-gray-200 hover:bg-red-700 p-3 rounded-lg transition duration-200" 
                title="Delete Playlist" 
                on:click={deletePlaylist}>
                Delete
              </button>
            </div>
          </div>
        {/if}
      </div>
      
    <div class="border-t border-gray-600 my-6"></div>

      <!-- Song List -->
    <SongList songs={data.songs} />

    {#if showAddSongModal}
      <AddSongsToPlaylistModal on:close={closeAddSongModal} on:add={reloadSongs} playlistId={data.playlist.id} />
    {/if}

    {#if showEditPlaylistModal}
      <EditPlaylistModal on:close={closeEditPlaylistModal} on:update={reloadPlaylist} playlist={data.playlist} />
    {/if}
  </div>
  
<style>
  button:hover {
    cursor: pointer;
  }

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

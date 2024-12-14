<script lang="ts">
	import { playlistSongs } from '$lib/utils/audioStore';
  import { getPlaylist, getSongs } from '$lib/utils/utils';
	import type { Song, Playlist } from '$lib/utils/types';
	import SongList from './SongList.svelte';
  import AddSongsToPlaylistModal from '$lib/components/AddSongsToPlaylistModal.svelte';
  import EditPlaylistModal from '$lib/components/EditPlaylistModal.svelte';
  import { goto } from '$app/navigation';
	import CustomContainer from './CustomContainer.svelte';

  export let playlist: Playlist | null = null;

  let songs: Song[] = [];
  let error: string | null = null;

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


  // Fetch songs for the selected playlist
  const fetchSongs = async () => {
    if (playlist === null) {
      songs = []; // No songs to fetch if no playlist is selected
      return;
    }

    try {
      const res = await fetch(`https://music.emilstorgaard.dk/api/Playlists/${playlist.id}/songs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }
      songs = await res.json(); // Store songs in the store
      playlistSongs.set(songs)
      error = null; // Clear any previous error
    } catch (err: any) {
      error = 'Error fetching songs: ' + err.message;
    }
  };

  async function reloadPlaylist() {
        try {
            const updatedPlaylist = await getPlaylist(data.playlist.id.toString());
            playlist = updatedPlaylist;
        } catch (error) {
            console.error('Error reloading playlist:', error);
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

  // Call fetchSongs whenever playlistId changes
  $: playlist?.id, fetchSongs();
</script>

<CustomContainer>
{#if $error}
    <p class="text-red-500">{ $error }</p>
{:else if playlist?.id}
    <div class="mb-3">
        <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-light-gray">ID: {playlist?.id}</span>
            <span class="text-sm text-light-gray">Created: {new Date(playlist?.createdAtUtc).toLocaleDateString()}</span>
        </div>
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-semibold text-light-gray">{playlist?.name}</h2>
            <div>
                <button on:click={() => showSettings = !showSettings} class="bg-green p-3 rounded-full hover:bg-light-green focus:outline-none focus:ring-2 focus:ring transition duration-150">
                    <img src="/menu.png" alt="Settings" class="h-5 w-5" />
                </button>

                <div class="relative">
                    {#if showSettings}
                        <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-dark-gray shadow-lg ring-1 ring-black/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                            <div class="py-1">
                                <button on:click={openAddSongModal} class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray" title="Add Songs">Add Songs</button>
                                <button on:click={openEditPlaylistModal} class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray" title="Edit Song">Edit</button>
                                <button on:click={deletePlaylist} class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600" title="Delete Song">Delete</button>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <div class="border-t border-gray my-6"></div>

        <!-- Song List -->
        <SongList songs={songs} />

        {#if showAddSongModal}
            <AddSongsToPlaylistModal on:close={closeAddSongModal} on:add={fetchSongs} playlistId={playlist?.id} />
        {/if}

        {#if showEditPlaylistModal}
            <EditPlaylistModal on:close={closeEditPlaylistModal} on:update={reloadPlaylist} playlist={playlist} />
        {/if}
{/if}
</CustomContainer>

<style>
  button:hover {
    cursor: pointer;
  }
</style>

<script lang="ts">
	import { playlistSongs } from '$lib/utils/audioStore';
  import { getPlaylist, getSongs } from '$lib/utils/utils';
	import type { Song, Playlist } from '$lib/utils/types';
	import SongList from './SongList.svelte';
  import AddSongsToPlaylistModal from '$lib/components/AddSongsToPlaylistModal.svelte';
  import EditPlaylistModal from '$lib/components/EditPlaylistModal.svelte';

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
    if (playlist === null) {
      songs = []; // No songs to fetch if no playlist is selected
      return;
    }
        try {
            const updatedPlaylist = await getPlaylist(playlist.id.toString());
            playlist = updatedPlaylist;
        } catch (error) {
            console.error('Error reloading playlist:', error);
        }
    }

  async function deletePlaylist() {
    if (playlist === null) {
      songs = []; // No songs to fetch if no playlist is selected
      return;
    }

        showSettings = false
        
        const confirmed = confirm(`Are you sure you want to delete the playlist "${playlist.name}"?`);
        if (!confirmed) return;

        try {
            const response = await fetch(`https://music.emilstorgaard.dk/api/Playlists/${playlist.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete playlist: ${response.statusText}`);
            }

            playlist = null
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting the playlist.');
        }
    }

  // Call fetchSongs whenever playlistId changes
  $: playlist?.id, fetchSongs();
</script>

<div>
{#if $error}
    <p class="text-red-500">{ $error }</p>
{:else if playlist?.id}
<div class="flex justify-between items-center mb-4">
	<div class="flex items-center gap-4">
		<img src={`https://music.emilstorgaard.dk/api/Playlists/${playlist?.id}/cover`} 
			alt={playlist?.name} 
			class="w-16 h-16 rounded-md object-cover" />
		<h2 class="text-xl font-semibold text-left">{playlist?.name}</h2>
	</div>
	<button on:click={() => showSettings = !showSettings} class="p-2 rounded-full hover:bg-green focus:outline-none focus:ring-2 focus:ring-pink-500 transition ml-auto">
		<!-- Add Icon (SVG) -->
		<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
	</button>
	
	<div class="relative">
		{#if showSettings}
			<div class="absolute right-0 z-10 mt-8 w-56 origin-top-right rounded-md bg-gray shadow-lg ring-1 ring-black/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
				<div class="py-1">
					<button on:click={openAddSongModal} class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-light-gray" title="Add Songs">Add Songs</button>
					<button on:click={openEditPlaylistModal} class="block w-full text-left rounded-md px-4 py-2 text-sm text-white hover:bg-light-gray" title="Edit Song">Edit</button>
					<button on:click={deletePlaylist} class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-red-600" title="Delete Song">Delete</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<div class="border-t border-gray my-2"></div>

        <!-- Song List -->
        <SongList songs={songs} />

        {#if showAddSongModal}
            <AddSongsToPlaylistModal on:close={closeAddSongModal} on:add={fetchSongs} playlistId={playlist?.id} />
        {/if}

        {#if showEditPlaylistModal}
            <EditPlaylistModal on:close={closeEditPlaylistModal} on:update={reloadPlaylist} playlist={playlist} />
        {/if}
{/if}
  </div>

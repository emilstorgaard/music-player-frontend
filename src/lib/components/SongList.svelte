<script lang="ts">
    export let songs: Song[] = [];

    import { playSong, stopSong, audio, currentSongIndex } from '$lib/utils/audioStore';
    import EditSongModal from './EditSongModal.svelte';
    import type { Song } from '$lib/utils/types';

    let selectedSongId: number | null = null;

    let showEditSongModal = false;

    function openEditSongModal() {
        showEditSongModal = true
    }

    function closeEditSongModal() {
        selectedSongId = null
        showEditSongModal = false;
    }
    
    const deleteSong = async (songId: number) => {
        try {
            await fetch(`https://music.emilstorgaard.dk/api/Songs/${songId}`, {
                method: 'DELETE',
            });

            songs = songs.filter(song => song.id !== songId);
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    };
</script>

<div class="bg-gray-900 text-white rounded-lg p-6 shadow-lg max-w-auto">
    <ul>
        {#each songs as song, index}
        <li class="flex justify-between items-center py-2 border-b border-gray-600">

            <div class="flex items-center space-x-4">
                <button 
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 flex items-center"
                    on:click={() => {
                        if ($currentSongIndex === index && audio) {
                            stopSong();
                        } else {
                            $currentSongIndex = index;
                            playSong(song);
                        }
                    }}>
                    <img 
                        src={$currentSongIndex === index && audio && !audio.paused ? '/pause.png' : '/play.png'} 
                        alt={$currentSongIndex === index && audio && !audio.paused ? 'Pause' : 'Play'} 
                        class="h-4 w-4"
                    />
                </button>
                <span class="font-semibold">{song.title} - {song.artist}</span>
            </div>

            <div  class="relative">
                <button on:click={() => selectedSongId = selectedSongId === song.id ? null : song.id} class="bg-green-500 p-3 rounded-full hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-150">
                    <img src="/menu.png" alt="Settings" class="h-5 w-5" />
                </button>
    
                <div class="relative z-50">
                    {#if selectedSongId === song.id}
                      <div class="absolute left-0 w-48 shadow-xl rounded-lg p-3">
                        <div class="bg-gray-700 text-white rounded-lg p-6 shadow-lg w-full max-w-xs">
                          <button 
                            on:click={() => openEditSongModal()}
                            class="w-full text-left text-gray-200 hover:bg-gray-600 p-3 rounded-lg transition duration-200" 
                            title="Edit Songs">
                            Edit Song
                          </button>
                          <button
                            on:click={() => deleteSong(song.id)}
                            class="w-full text-left text-gray-200 hover:bg-red-600 p-3 rounded-lg transition duration-200" 
                            title="Delete Playlist" >
                            Delete
                          </button>
                        </div>
                      </div>
                    {/if}
                  </div>
            </div>
        </li>
        {/each}
    </ul>

    {#if showEditSongModal}
        <EditSongModal on:close={closeEditSongModal} song={songs.find(s => s.id === selectedSongId)} />
    {/if}
</div>

<script lang="ts">
    export let songs: Song[] = [];

    import { playSong, pauseContinue, audio, currentSongIndex, isPaused } from '$lib/utils/audioStore';
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

    <ul>
        {#each songs as song, index}
        <li class="flex justify-between items-center py-2 border-b border-gray">

            <div class="flex items-center space-x-4">
                <button 
                    class="bg-green text-white px-4 py-2 rounded hover:bg-light-green flex items-center"
                    on:click={() => {
                        if ($currentSongIndex === index) {
                            pauseContinue();
                        } else {
                            $currentSongIndex = index;
                            playSong(song);
                        }
                    }}>
                    <img 
                        src={$currentSongIndex === index && !$isPaused ? '/pause.png' : '/play.png'} 
                        alt={$currentSongIndex === index && !$isPaused ? 'Pause' : 'Play'} 
                        class="h-4 w-4"
                    />
                </button>
                <span class="font-semibold">{song.title} - {song.artist}</span>
            </div>


            <div>
                <button on:click={() => selectedSongId = selectedSongId === song.id ? null : song.id} class="bg-green p-3 rounded-full hover:bg-light-green focus:outline-none focus:ring-2 focus:ring-green transition duration-150">
                    <img src="/menu.png" alt="Settings" class="h-5 w-5" />
                </button>
      
                <div class="relative">
                    {#if selectedSongId === song.id}
                    <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-dark-gray shadow-lg ring-1 ring-black/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                        <div class="py-1">
                            <button on:click={() => openEditSongModal()} class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray" title="Edit Song">Edit</button>
                            <button on:click={() => deleteSong(song.id)} class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600" title="Delete Song">Delete</button>
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
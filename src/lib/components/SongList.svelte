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

            <img 
                src={`https://music.emilstorgaard.dk/api/Songs/${song.id}/cover`} 
                alt={song.title} 
                class="w-12 h-12 rounded-md object-cover"
            />

            <!-- Make this line responsive -->
            <span class="font-semibold truncate max-w-none xs:max-w-32 sm:max-w-sm md:max-w-md lg:max-w-72 xl:max-w-96 2xl:max-w-none">{song.title} - {song.artist}</span>
        </div>
    
        <div class="flex items-center space-x-4">
            <!-- Like Button on:click={() => toggleLike(song.id)} in button in svg fill={likedSongs.includes(song.id) ? 'red' : 'none'}  --> 
            <button 
                class="p-2 rounded-full focus:outline-none transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" 
                    fill='red'
                    viewBox="0 0 24 24" 
                    stroke-width="1.5" 
                    stroke="currentColor" 
                    class="w-6 h-6 text-red-500 hover:text-red-700 transition duration-150">
                    <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M21.8 8.1c0-2.8-2.3-5.1-5.1-5.1-1.4 0-2.7.6-3.7 1.6-.9-1-2.3-1.6-3.7-1.6-2.8 0-5.1 2.3-5.1 5.1 0 3.7 3.4 6.6 8.1 11 4.7-4.4 8.1-7.3 8.1-11z" 
                    />
                </svg>
            </button>
    
            <!-- Settings Button -->
            <button 
                on:click={() => selectedSongId = selectedSongId === song.id ? null : song.id} 
                class="bg-green p-3 rounded-full hover:bg-light-green focus:outline-none focus:ring-2 focus:ring-green transition duration-150">
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
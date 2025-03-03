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

{#each songs as song, index}
<div class="p-2 rounded-md flex items-center gap-4 justify-between relative group hover:bg-gray hover:cursor-pointer transition  border-b border-gray">
    <div class="relative w-16 h-16">
        <img 
            src={`https://music.emilstorgaard.dk/api/Songs/${song.id}/cover`} 
            alt={song.title} 
            class="w-16 h-16 rounded-md object-cover transition-opacity duration-300 group-hover:opacity-50"
        />

        <button class="absolute inset-0 flex items-center justify-center bg-pink bg-opacity-50 text-white 
            rounded-md opacity-0 group-hover:opacity-100 transition"
            on:click={() => {
                if ($currentSongIndex === index) {
                    pauseContinue();
                } else {
                    $currentSongIndex = index;
                    playSong(song);
                }
            }}>

    <!-- Pause Icon (when playing) -->
    {#if $currentSongIndex === index && !$isPaused}
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green" fill="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 3h4v18H6zm8 0h4v18h-4z" />
        </svg>
    {/if}

    <!-- Play Icon (when paused) -->
    {#if $currentSongIndex !== index || $isPaused}
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green" fill="currentColor" viewBox="0 0 24 24" >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z" />
        </svg>
    {/if}
            
        </button>
    </div>

    <div class="text-left w-full">
        <p class="text-lg font-medium line-clamp-1">
            {song.title} - {song.artist}
        </p>
        <button 
    >
        <svg xmlns="http://www.w3.org/2000/svg" 
            fill={song.isLiked ? 'red' : 'none'} 
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
    </div>

    <div class="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
        <!-- Settings Button -->
        <button 
            on:click={() => selectedSongId = selectedSongId === song.id ? null : song.id} 
            class="p-2 rounded-full hover:bg-green focus:outline-none focus:ring-2 focus:ring-pink-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
            </svg>
        </button>

        <div class="relative">
            {#if selectedSongId === song.id}
            <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray shadow-lg ring-1 ring-black/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <div class="py-1">
                    <button on:click={() => openEditSongModal()} class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-light-gray" title="Edit Song">Edit</button>
                    <button on:click={() => deleteSong(song.id)} class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-red-600" title="Delete Song">Delete</button>
                </div>
            </div>
            {/if}
        </div>
    </div>
</div>
{/each}


{#if showEditSongModal}
    <EditSongModal on:close={closeEditSongModal} song={songs.find(s => s.id === selectedSongId)} />
{/if}
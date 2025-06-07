<script lang="ts">
    import type { Song } from '$lib/utils/types';
    export let songs: Song[] = [];
    import { API_BASE_URL } from '$lib/utils/config';
    import { currentSongIndex, isPaused } from '$lib/stores/songStore';
    import { playSong, pauseContinue } from '$lib/utils/audioPlayer';
    import { userStore } from '$lib/stores/auth';
    import { deleteSong, dislikeSong, fetchSongs, likeSong, removeSongFromPlaylist } from '$lib/utils/songs'
    import { selectedPlaylistSongStore, selectedPlaylistSongsStore, selectedPlaylistStore } from '$lib/stores/playlistStore';
    import { triggerToast } from '$lib/stores/toastStore';

    async function handleLikeSong(song: Song) {
        try {
            const jwt = $userStore?.jwt;
            if (!jwt) throw new Error("Authentication token (JWT) is required.");

            if (song.isLiked) {
                await dislikeSong(song.id, jwt);
            } else {
                await likeSong(song.id, jwt);
            }

            const playlistId = $selectedPlaylistStore?.id;
            if (!playlistId) throw new Error("Failed to update songs no playlist selected.");

            // Refresh Songs after the change
            fetchSongs(playlistId, jwt);
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }
</script>

<!-- Scrollable List -->
<div class="flex-1 overflow-y-auto mt-2 space-y-2">
    {#each songs as song, index}
<div class="p-2 rounded-md flex items-center gap-4 justify-between relative group hover:bg-gray hover:cursor-pointer transition border-b border-gray">
    <!-- Cover Image + Play/Pause Overlay -->
    <div class="relative w-16 h-16 shrink-0">
        <img 
        src={`${API_BASE_URL}/Songs/cover/${song.coverImagePath}`} 
        alt={song.title} 
        class="w-full h-full rounded-lg object-cover transition-opacity duration-300 group-hover:opacity-60"
        />

        <button 
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
        on:click={() => {
            if ($currentSongIndex === index) {
            pauseContinue();
            } else {
            $currentSongIndex = index;
            playSong(song);
            }
        }}>
        
        <!-- Play / Pause Icons -->
        {#if $currentSongIndex === index && !$isPaused}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 3h4v18H6zm8 0h4v18h-4z" />
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3l14 9-14 9V3z" />
            </svg>
        {/if}
        </button>
    </div>
    
        <div class="text-left w-full">
            <h3 class="text-lg font-semibold text-white">{song.title}</h3>
            <p class="text-sm text-light-gray">{song.artist}</p>
        </div>

    </div>
    {/each}
</div>
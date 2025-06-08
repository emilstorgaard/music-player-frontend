<script lang="ts">
    import { playlistsStore, selectedPlaylistStore } from '$lib/stores/playlistStore';
    import { userStore } from '$lib/stores/auth';
	import { dislikePlaylist, fetchPlaylists, likePlaylist } from '$lib/utils/playlists';
	import { onMount } from 'svelte';
	import { API_BASE_URL } from '$lib/utils/config';
	import { triggerToast } from '$lib/stores/toastStore';
	import type { Playlist } from '$lib/utils/types';

    onMount(() => {
        const unsubscribe = userStore.subscribe(user => {
            if (user) {
                fetchPlaylists(user.jwt);
            }
        });

        return () => unsubscribe();
    });

    async function handleLikePlaylist(playlist: Playlist) {
        try {
            const jwt = $userStore?.jwt;
            if (!jwt) throw new Error("Authentication token (JWT) is required.");

            if (playlist.isLiked) {
                await dislikePlaylist(playlist.id, jwt);
            } else {
                await likePlaylist(playlist.id, jwt);
            }

            fetchPlaylists(jwt);
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }

</script>

<div class="flex-1 overflow-y-auto mt-2 space-y-2">

    {#each $playlistsStore as playlist}
    <div class="p-2 rounded-md flex items-center gap-4 justify-between hover:bg-gray hover:cursor-pointer transition">
        <img src={`${API_BASE_URL}/songs/cover/${playlist.coverImagePath}`} alt="{playlist.name}" class="w-16 h-16 rounded-md object-cover" />
        <button title="Select Playlist" on:click={() => selectedPlaylistStore.set(playlist)} class="text-left w-full">
            <p class="text-lg text-white font-medium line-clamp-1">{playlist.name}</p>
        </button>

        <button title={playlist.isLiked ? "Dislike" : "Like"} on:click={() => handleLikePlaylist(playlist)}>
            <svg xmlns="http://www.w3.org/2000/svg" 
                fill={playlist.isLiked ? 'red' : 'none'} 
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
    {/each}
	
</div>
<script lang="ts">
    import type { Playlist } from '$lib/utils/types';
    import { API_BASE_URL } from '$lib/utils/config';
    import { selectedPlaylistStore } from '$lib/stores/playlistStore';
    import { showSearchResults } from '$lib/stores/searchStore';
    export let playlists: Playlist[] = [];
</script>

<div class="flex-1 overflow-y-auto mt-2 space-y-2">
    {#each playlists as playlist (playlist.id)}
    <div class="p-2 rounded-md flex items-center gap-4 justify-between hover:bg-gray hover:cursor-pointer transition">
        <img src={`${API_BASE_URL}/songs/cover/${playlist.coverImagePath}`} alt="{playlist.name}" class="w-16 h-16 rounded-md object-cover" />
        <button title="Select Playlist" on:click={() => { selectedPlaylistStore.set(playlist); showSearchResults.set(false); }} class="text-left w-full">
            <p class="text-lg text-white font-medium line-clamp-1">{playlist.name}</p>
        </button>
    </div>
    {/each}
</div>
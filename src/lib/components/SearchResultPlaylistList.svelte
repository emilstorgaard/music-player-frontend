<script lang="ts">
    import type { Playlist } from '$lib/utils/types';
    export let playlists: Playlist[] = [];
    import { API_BASE_URL } from '$lib/utils/config';
</script>

<!-- Scrollable List -->
<div class="flex-1 overflow-y-auto mt-2 space-y-2">
    {#each playlists as playlist (playlist.id)}
    <div class="p-2 rounded-md flex items-center gap-4 justify-between hover:bg-gray hover:cursor-pointer transition">
        <img src={`${API_BASE_URL}/songs/cover/${playlist.coverImagePath}`} alt="{playlist.name}" class="w-16 h-16 rounded-md object-cover" /> <!-- TODO: est Get image from playlist endpoint -->
        <button class="text-left w-full">
            <p class="text-lg text-white font-medium line-clamp-1">{playlist.name}</p>
        </button>
    </div>
    {/each}
</div>
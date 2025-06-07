<script lang="ts">
    import SearchResultSongList from './SearchResultSongList.svelte';
    import SearchResultPlaylistList from './SearchResultPlaylistList.svelte';
    import type { Song, Playlist } from '$lib/utils/types';

    export let songs: Song[] = [];
    export let playlists: Playlist[] = [];
</script>

<div class="mt-8 bg-dark-gray text-white rounded-lg p-6 shadow-lg w-full border border-green">
    <!-- Songs Section -->
    {#if songs.length > 0}
        <h2 class="text-2xl font-semibold text-light-gray">Songs</h2>
        <div class="overflow-y-auto max-h-96">
            <SearchResultSongList {songs} />
        </div>
    {/if}

    <!-- Playlists Section -->
    {#if playlists.length > 0}
        <h2 class="text-2xl font-semibold text-light-gray mt-4">Playlists</h2>
        <div class="overflow-y-auto max-h-96">
            <SearchResultPlaylistList {playlists} />
        </div>
    {/if}
</div>
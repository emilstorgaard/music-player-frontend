<script lang="ts">
    import SongList from './SongList.svelte';
    import PlaylistList from './PlaylistList.svelte';
    import type { Song, Playlist } from '$lib/utils/types';

    export let songs: Song[] = [];
    export let playlists: Playlist[] = [];
</script>

<div class="bg-dark-gray text-white rounded-lg p-6 shadow-lg w-full">
    <!-- Songs Section -->
    {#if songs.length > 0}
        <div>
            <h2 class="text-2xl font-semibold text-light-gray mb-4">Songs</h2>
            <SongList {songs} />
        </div>
    {/if}

    <!-- Playlists Section -->
    {#if playlists.length > 0}
        <div class="mt-8">
            <h2 class="text-2xl font-semibold text-light-gray mb-4">Playlists</h2>
            <PlaylistList {playlists} />
        </div>
    {/if}
</div>
<script lang="ts">
    import Playlist from '$lib/components/Playlist.svelte';
    import PlaylistList from '$lib/components/PlaylistList.svelte';
	import Stats from '$lib/components/Stats.svelte';

    let selectedPlaylist: Playlist | null = null; // The ID of the selected playlist

    const handlePlaylistSelect = (event: CustomEvent<Playlist>) => {
        selectedPlaylist = event.detail;
    };
</script>

<div class="flex flex-col lg:flex-row mx-4 gap-4 min-h-screen">
    <div class="lg:w-1/4">
        <PlaylistList on:select={handlePlaylistSelect} />
    </div>
    <div class="lg:w-2/4">
    {#if selectedPlaylist}
        <Playlist playlist={selectedPlaylist} />
    {/if}
    </div>
    <div class="lg:w-1/4">
        <Stats />
    </div>
</div>


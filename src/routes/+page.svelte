<script lang="ts">
    import Playlist from '$lib/components/Playlist.svelte';
    import PlaylistList from '$lib/components/PlaylistList.svelte';

    let selectedPlaylist: Playlist | null = null; // The ID of the selected playlist

    const handlePlaylistSelect = (event: CustomEvent<Playlist>) => {
        selectedPlaylist = event.detail;
    };
</script>

<div class="flex flex-col lg:flex-row gap-4 px-4 min-h-[80vh]">
    <div class="bg-dark-gray p-6 text-white w-full lg:w-1/4 rounded-md">
        <PlaylistList on:select={handlePlaylistSelect} />
    </div>
    <div class="bg-dark-gray p-6 text-white w-full lg:w-3/4 rounded-md">
    {#if selectedPlaylist}
        <Playlist playlist={selectedPlaylist} />
    {/if}
    </div>
</div>
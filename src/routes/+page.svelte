<script lang="ts">
    import PlaylistList from '$lib/components/PlaylistList.svelte';
    import SongList from '$lib/components/SongList.svelte';
    import { onMount } from 'svelte';
	import SongUploadModal from '$lib/components/SongUploadModal.svelte';
    import { searchQuery, search, searchResults } from '$lib/utils/search';

    let showModal = false;

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    // Handle search on query change but only in client-side environment
    onMount(() => {
        const unsubscribe = searchQuery.subscribe((query) => {
            if (query) {
                searchResults(query);
            }
        });

        return () => unsubscribe();
    });

    // Function to handle the input change
    const handleSearchChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        searchQuery.set(target.value);
    };

</script>

<div class="max-w-screen-sm mx-auto p-4 sm:p-6">
    <div class="bg-gray-900 text-white rounded-lg p-6 shadow-lg max-w-auto">
        
        <div class="flex justify-between items-center">
            <!-- Search Input -->
            <input
                type="text"
                placeholder="Search songs or playlists..."
                class="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                on:input={handleSearchChange}
            />

            <button class="bg-green-500 p-3 rounded-full hover:bg-green-400 ml-4" on:click={openModal} title="UploadSong">
                <img src="/uploadSong.png" alt="UploadSong" class="h-4 w-4" /> <!-- Smaller size -->
            </button>
        </div>
    
        {#if $search.songs.length > 0}
            <SongList songs={$search.songs} />
        {/if}
        
        {#if $search.playlists.length > 0}
            <PlaylistList playlists={$search.playlists} />
        {/if}
    </div>

    {#if showModal}
        <SongUploadModal on:close={closeModal} />
    {/if}
</div>

<script lang="ts">
    import { searchQuery, search, getSearchResults } from '$lib/utils/search';
    import { showSearchResults } from '$lib/stores/searchStore';
	import SearchResult from './SearchResult.svelte';

    const handleSearchChange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const value = target.value.trim();

        searchQuery.set(value);
        showSearchResults.set(value !== "");

        if (value !== "") {
            await getSearchResults(value);
        } else {
            search.set({ playlists: [], songs: [] });
        }
    };
</script>

<div class="flex-grow max-w-lg">   
    <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-light-gray" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>

        <input
            type="search"
            class="block p-2 ps-10 w-full text-md text-white rounded-full bg-dark-gray focus:outline-none focus:ring-2 focus:ring-green"
            placeholder="Search songs or playlists"
            on:input={handleSearchChange} />
    </div>

    {#if $showSearchResults && ($search.songs.length > 0 || $search.playlists.length > 0)}
        <div class="fixed left-1/2 transform -translate-x-1/2 w-3/4 max-w-[800px] z-50 flex items-center justify-center mt-1">
            <SearchResult songs={$search.songs} playlists={$search.playlists} />
        </div>
    {/if}
</div>
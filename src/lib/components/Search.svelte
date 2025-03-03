<script lang="ts">
    import { onMount } from 'svelte';
    import { searchQuery, search, searchResults } from '$lib/utils/search';
	import SearchResult from './SearchResult.svelte';

    let showSearchResults = false;

    const handleSearchChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        searchQuery.set(target.value);

        showSearchResults = target.value.trim() !== "";
    };

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const searchInput = document.querySelector('input[placeholder="Search songs or playlists..."]');
        const searchResultsDiv = document.querySelector('.search-results-container');

        if (
            searchInput && searchResultsDiv &&
            !searchInput.contains(target) &&
            !searchResultsDiv.contains(target)
        ) {
            showSearchResults = false;
        }
    };

    onMount(() => {
        // Attach a global click listener
        document.addEventListener('click', handleClickOutside);

        const unsubscribe = searchQuery.subscribe((query) => {
            if (query) {
                searchResults(query);
            }
        });

        return () => {
            // Clean up listeners on destroy
            document.removeEventListener('click', handleClickOutside);
            unsubscribe();
        };
    });
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

    {#if showSearchResults && ($search.songs.length > 0 || $search.playlists.length > 0)}
        <div class="fixed w-1/2 left-1/2 transform -translate-x-1/2 mt-1 search-results-container">
            <SearchResult songs={$search.songs} playlists={$search.playlists} />
        </div>
    {/if}
    </div>
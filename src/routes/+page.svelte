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

<div class="flex flex-col lg:flex-row gap-4 px-4 min-h-[80vh]">
    <div class="bg-dark-gray p-6 text-white w-full lg:w-1/4 rounded-md">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-left">Your Playlists</h2>
            <button class="p-2 rounded-full hover:bg-green focus:outline-none focus:ring-2 focus:ring-pink-500 transition">
                <!-- Add Icon (SVG) -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>

        <div class="border-t border-gray my-2"></div>
        
        <div class="p-2 rounded-md flex items-center gap-4 justify-between hover:bg-gray hover:cursor-pointer transition">
            <img src="https://music.emilstorgaard.dk/api/Songs/7/cover" alt="Playlist Cover" class="w-16 h-16 rounded-md object-cover">
            <div class="text-left w-full">
                <p class="text-lg font-medium line-clamp-1">
                    Very Long Playlist Name That Would Normally Break Styling
                </p>
                <p class="text-sm text-light-gray">03-03-2025</p>
            </div>
        </div>

    </div>

    <div class="bg-dark-gray p-6 text-white w-full lg:w-3/4 rounded-md">
        <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-4">
                <img src="https://music.emilstorgaard.dk/api/Songs/7/cover"
                alt="Playlist Cover"
                class="w-16 h-16 rounded-md object-cover" />
                <h2 class="text-xl font-semibold text-left">Songs from playlist</h2>
            </div>
            <button class="p-2 rounded-full hover:bg-green focus:outline-none focus:ring-2 focus:ring-pink-500 transition">
                <!-- Add Icon (SVG) -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>

        <div class="border-t border-gray my-2"></div>

        <div class="p-2 rounded-md flex items-center gap-4 justify-between relative group hover:bg-gray hover:cursor-pointer transition">
            <div class="relative w-16 h-16">
                <img src="https://music.emilstorgaard.dk/api/Songs/7/cover" alt="Song Cover"
                     class="w-16 h-16 rounded-md object-cover">
        
                <button class="absolute inset-0 flex items-center justify-center bg-pink bg-opacity-50 text-white 
                               rounded-md opacity-0 group-hover:opacity-100 transition">
                               <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z" />
                            </svg>
                </button>
            </div>
        
            <div class="text-left w-full">
                <p class="text-lg font-medium line-clamp-1">
                    Very Long Playlist Name That Would Normally Break Styling
                </p>
                <p class="text-sm text-light-gray">03-03-2025</p>
            </div>
        
            <div class="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
                <!-- Three dots menu icon (SVG) -->
                <button class="p-2 rounded-full hover:bg-green focus:outline-none focus:ring-2 focus:ring-pink-500 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>
            </div>
            
        </div>
    </div>
</div>

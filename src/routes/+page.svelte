<script lang="ts">
    import { onMount } from 'svelte';
    import SongList from '$lib/components/SongList.svelte';

    let songs: string[] = []; // Reactive variable to store songs

    // Fetch songs from the API
    onMount(async () => {
        try {
            const response = await fetch('https://music.emilstorgaard.dk/api/Songs/shuffle'); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            songs = await response.json(); // Assuming the response is an array of song names
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    });
</script>

<main class="p-4 max-w-screen-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Songs</h1>
    <SongList {songs} />
</main>
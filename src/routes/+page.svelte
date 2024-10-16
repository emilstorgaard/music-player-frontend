<script>
    import SongList from '$lib/components/SongList.svelte';

    // Sample songs data - an array of song names
    const songs = [
        'Sweater Weather.mp3',
        'BIRDS OF A FEATHER.mp3',
        'Die With a Smile.mp3',
        'Espresso.mp3',
        'Mockingbird.mp3',
    ];
</script>

<main class="p-4 max-w-screen-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Songs</h1>
    <SongList {songs} />
</main>
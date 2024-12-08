<script lang="ts">
    export let songs: Song[] = [];

    import { playSong, stopSong, audio, currentSongIndex } from '$lib/utils/audioStore';

    interface Song {
        id: number;
        title: string;
        artist: string;
        filePath: string;
    }
    
    const deleteSong = async (songId: number) => {
        try {
            await fetch(`https://music.emilstorgaard.dk/api/Songs/${songId}`, {
                method: 'DELETE',
            });

            songs = songs.filter(song => song.id !== songId);
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    };
</script>

<div class="bg-gray-900 text-white rounded-lg p-6 shadow-lg max-w-auto">
    <ul>
        {#each songs as song, index}
        <li class="flex justify-between items-center py-2 border-b border-gray-600">
            <span class="font-semibold">{song.title} - {song.artist}</span>
            <button 
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 flex items-center"
                on:click={() => {
                    if ($currentSongIndex === index && audio) {
                        stopSong();
                    } else {
                        $currentSongIndex = index;
                        playSong(song);
                    }
                }}>
                <img 
                    src={$currentSongIndex === index && audio && !audio.paused ? '/pause.png' : '/play.png'} 
                    alt={$currentSongIndex === index && audio && !audio.paused ? 'Pause' : 'Play'} 
                    class="h-4 w-4"
                />
            </button>
            <button 
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                on:click={() => deleteSong(song.id)}>
                Delete
            </button>
        </li>
        {/each}
    </ul>

</div>

<style>
    /* For Chrome, Safari, and Edge */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px; /* Adjust the width of the thumb */
        height: 16px; /* Adjust the height of the thumb */
        background: #22c55e; /* Green color */
        border-radius: 50%; /* Make it round */
        cursor: pointer; /* Show pointer on hover */
    }

    /* For Firefox */
    input[type="range"]::-moz-range-thumb {
        width: 16px; /* Adjust the width of the thumb */
        height: 16px; /* Adjust the height of the thumb */
        background: #22c55e; /* Green color */
        border-radius: 50%; /* Make it round */
        cursor: pointer; /* Show pointer on hover */
    }

    /* For Internet Explorer */
    input[type="range"]::-ms-thumb {
        width: 16px; /* Adjust the width of the thumb */
        height: 16px; /* Adjust the height of the thumb */
        background: #22c55e; /* Green color */
        border-radius: 50%; /* Make it round */
        cursor: pointer; /* Show pointer on hover */
    }
</style>
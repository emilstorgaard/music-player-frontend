<script lang="ts">
    export let songs: string[] = [];

    // Variable to hold the audio element and track the currently playing song
    let audio: HTMLAudioElement | null = null;
    let currentSong: string | null = null;

    const playSong = async (song: string) => {
        // If the same song is clicked, toggle play/pause
        if (currentSong === song && audio) {
            if (!audio.paused) {
                audio.pause();
                return;
            }
        }

        // Stop the currently playing song if there is one
        if (audio) {
            audio.pause();
        }

        try {
            var url = `https://music.emilstorgaard.dk/api/Songs/stream/song/${song}`
            // Make a request to your API to get the song stream URL
            // const response = await fetch(`https://music.emilstorgaard.dk/api/Songs/stream/song/${song}`);
            
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }

            // // Get the song URL (assuming the API responds with a JSON containing the URL)
            // const data = await response.json();
            // const songUrl = data.url; // Adjust based on your API response structure

            // Create a new audio element and play the song
            audio = new Audio(url); //songUrl
            currentSong = song; // Update the current song variable
            audio.play();
        } catch (error) {
            console.error('Error fetching song:', error);
        }
    };

    const stopSong = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset to the beginning of the song
            currentSong = null; // Clear the current song
        }
    };
</script>

<ul class="divide-y divide-gray-200">
    {#each songs as song}
        <li class="py-2 flex justify-between items-center">
            <span class="font-semibold">{song}</span>
            <button 
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                on:click={() => {
                    if (currentSong === song && audio) {
                        stopSong(); // Stop the song if it's currently playing
                    } else {
                        playSong(song); // Otherwise, play the song
                    }
                }}>
                {currentSong === song && audio && !audio.paused ? 'Stop' : 'Play'}
            </button>
        </li>
    {/each}
</ul>
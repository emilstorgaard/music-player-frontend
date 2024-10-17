<script lang="ts">
    export let songs: string[] = [];

    let audio: HTMLAudioElement | null = null;
    let currentSongIndex: number | null = null;
    let volume: number = 1.0; // Default volume
    let isPaused: boolean = false; // Flag to check if playback is paused
    let currentTime: number = 0; // Current time of the song
    let duration: number = 0; // Duration of the song
    let currentSongName: string | null = null; // Name of the currently playing song

    const playSong = async (song: string) => {
        if (audio) {
            audio.pause();
        }

        try {
            const url = `https://music.emilstorgaard.dk/api/Songs/stream/song/${song}`;
            audio = new Audio(url);
            audio.volume = volume;

            audio.onloadedmetadata = () => {
                duration = audio?.duration || 0; // Get the song duration when metadata is loaded
            };

            audio.ontimeupdate = () => {
                if (audio) {
                    currentTime = audio.currentTime; // Update current time as the song plays
                }
            };

            audio.onended = playNextSong; // Automatically play the next song
            await audio.play();
            isPaused = false; // Reset pause flag
            currentSongName = song; // Set the current song name
        } catch (error) {
            console.error('Error fetching song:', error);
        }
    };

    const stopSong = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset to the beginning of the song
        }
        currentSongIndex = null;
        isPaused = false;
        currentTime = 0;
        duration = 0;
        currentSongName = null; // Clear the current song name
    };

    const playNextSong = () => {
        if (currentSongIndex !== null && currentSongIndex < songs.length - 1) {
            currentSongIndex += 1;
            playSong(songs[currentSongIndex]);
        } else {
            stopSong(); // Stop after the last song
        }
    };

    const playPreviousSong = () => {
        if (currentSongIndex !== null && currentSongIndex > 0) {
            currentSongIndex -= 1;
            playSong(songs[currentSongIndex]);
        }
    };

    const playAllSongs = () => {
        if (songs.length > 0) {
            currentSongIndex = 0;
            playSong(songs[currentSongIndex]);
        }
    };

    const togglePauseContinue = () => {
        if (audio) {
            if (!audio.paused) {
                audio.pause();
                isPaused = true;
            } else {
                audio.play();
                isPaused = false;
            }
        }
    };

    const shuffleArray = (array: string[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const shuffleSongs = () => {
        stopSong();
        songs = shuffleArray([...songs]);
        currentSongIndex = 0;
        if (songs.length > 0) {
            playSong(songs[currentSongIndex]);
        }
    };

    const adjustVolume = (event: Event) => {
        const target = event.target as HTMLInputElement;
        volume = parseFloat(target.value);
        if (audio) {
            audio.volume = volume;
        }
    };

    const seekSong = (event: Event) => {
        if (audio) {
            const target = event.target as HTMLInputElement;
            const newTime = (parseFloat(target.value) / 100) * duration; // Calculate the new time based on the slider value
            audio.currentTime = newTime; // Seek to the new time
        }
    };

    // Convert seconds to MM:SS format
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
</script>

<div class="bg-gray-900 text-white rounded-lg p-6 shadow-lg max-w-screen-md">
    <!-- Control Panel -->
    <div class="flex justify-center items-center space-x-4 mb-6">
        <button class="bg-green-500 p-3 rounded-full hover:bg-green-400" on:click={shuffleSongs} title="Shuffle">
            🔀
        </button>
        <button class="bg-green-500 p-3 rounded-full hover:bg-green-400" on:click={playPreviousSong} title="Previous" disabled={currentSongIndex === null || currentSongIndex === 0}>
            ⏮️
        </button>
        <button class="bg-green-500 p-3 rounded-full hover:bg-green-400" on:click={togglePauseContinue} title={isPaused ? 'Continue' : 'Pause'} disabled={audio === null}>
            {isPaused ? '▶️' : '⏸️'}
        </button>
        <button class="bg-green-500 p-3 rounded-full hover:bg-green-400" on:click={playNextSong} title="Next" disabled={currentSongIndex === null || currentSongIndex >= songs.length - 1}>
            ⏭️
        </button>
    </div>

    <!-- Seek Bar -->
    <div class="mb-4">
        <input 
            type="range" 
            min="0" 
            max="100" 
            value={duration > 0 ? (currentTime / duration) * 100 : 0}
            on:input={seekSong}
            class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer">
    </div>

    <!-- Time Counter and Current Song Name -->
    <div class="mb-4 flex justify-between items-center">
        <span class="text-sm text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <span class="text-sm text-gray-400">{currentSongName || "No song playing"}</span> <!-- Display current song name -->
    </div>

    <!-- Volume Control -->
    <div class="mb-6">
        <label for="volume" class="block text-sm font-medium text-gray-400 mb-2">Volume: {(volume * 100).toFixed(0)}%</label>
        <input 
            id="volume" 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            on:input={adjustVolume}
            class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer">
    </div>

    <div class="border-t border-gray-600 my-4"></div>

    <!-- Song List -->
    <ul>
        {#each songs as song, index}
            <li class="flex justify-between items-center py-2 border-b border-gray-600">
                <span class="font-semibold">{song}</span>
                <button 
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 flex items-center"
                    on:click={() => {
                        if (currentSongIndex === index && audio) {
                            stopSong();
                        } else {
                            currentSongIndex = index;
                            playSong(song);
                        }
                    }}>
                    {currentSongIndex === index && audio && !audio.paused ? '⏹️' : '▶️'}
                </button>
            </li>
        {/each}
    </ul>
</div>

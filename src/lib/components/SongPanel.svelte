<script lang="ts">
    import { currentSongIndex, toggleShuffle, isShuffleEnabled, shuffleSongs, playPreviousSong, togglePauseContinue, isPaused, playNextSong, playlistSongs, currentSongName, formatTime, currentTime, duration, seekSong, volume, adjustVolume, playSong} from '$lib/utils/audioStore';
</script>

<div class="bg-gray-900 text-white rounded-lg pt-6 flex flex-col items-center fixed bottom-16 w-full">
        <!-- Control Panel -->
        <div class="flex justify-center items-center space-x-4">
            <button class="{$isShuffleEnabled ? 'border-4' : ''} bg-green-500 p-3 rounded-full hover:bg-green-400" on:click={toggleShuffle} title="Shuffle">
                <img src='/shuffle.png' alt="Shuffle" class="h-4 w-4" />
            </button>
            <button class="bg-green-500 p-3 rounded-full hover:bg-green-400" on:click={playPreviousSong} title="Previous" > <!-- disabled={$currentSongIndex === null || $currentSongIndex === 0} -->
                <img src="/previous.png" alt="Previous" class="h-4 w-4" /> <!-- Smaller size -->
            </button>

            <!-- Please help me this does not work -->
            <button class="bg-green-500 p-3 rounded-full hover:bg-green-400" on:click={togglePauseContinue} title={$isPaused ? 'Continue' : 'Pause'} > <!-- disabled={audio === null} -->
                <img src={$isPaused ? '/play.png' : '/pause.png'} alt={$isPaused ? 'Play' : 'Pause'} class="h-4 w-4" /> <!-- Smaller size -->
            </button>

            <button class="bg-green-500 p-3 rounded-full hover:bg-green-400" on:click={playNextSong} title="Next" > <!-- disabled={$currentSongIndex === null || $currentSongIndex >= $playlistSongs.length - 1} -->
                <img src="/next.png" alt="Next" class="h-4 w-4" /> <!-- Smaller size -->
            </button>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between w-full p-4">
            <span class="text-sm text-gray-400 sm:mr-auto">
                {$currentSongName || "No song playing"}
            </span>
        
            <div class="flex sm:flex-row md:w-1/2 items-center">
                <span class="text-sm text-gray-400 pr-1">
                    {formatTime($currentTime)}
                </span>
        
                <div class="flex-grow w-full">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={$duration > 0 ? ($currentTime / $duration) * 100 : 0}
                        on:input={(e) => seekSong(e.target.value)}
                        class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer">
                </div>
        
                <span class="text-sm text-gray-400 pl-1">
                    {formatTime($duration)}
                </span>
            </div>

            <div class="flex sm:flex-row items-center sm:ml-auto">
                <span class="text-sm text-gray-400">
                    Volume {($volume * 100).toFixed(0)}%
                </span>
        
                <div class="pl-1 flex-grow">
                    <input 
                        id="volume" 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={$volume}
                        on:input={(e) => adjustVolume(parseFloat(e.target.value))}
                        class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer">
                </div>
            </div>
        
        </div> 
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

    .global-music-controller {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #222;
    color: white;
    text-align: center;
    padding: 10px;
  }
    
</style>
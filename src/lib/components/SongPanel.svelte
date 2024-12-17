<script lang="ts">
    import { currentSongIndex, toggleShuffle, audio, isShuffleEnabled, togglePauseContinue, playPreviousSong, isPaused, playNextSong, playlistSongs, currentSongName, formatTime, currentTime, duration, seekSong, volume, adjustVolume } from '$lib/utils/audioStore';
</script>

<div class="text-white pt-3 flex flex-col w-full">
    <div class="flex justify-center items-center space-x-4">
        <button 
        class="p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0
        bg-green hover:bg-light-green hover:ring-4 hover:ring-green
        {$isShuffleEnabled ? 'ring-4 ring-light-gray' : ''}"
        on:click={toggleShuffle} 
        title="Shuffle"
        disabled={$playlistSongs.length <= 0}>
        <img src='/shuffle.png' alt="Shuffle" class="h-4 w-4" />
    </button>

        <button 
            class="p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0
            bg-green hover:bg-light-green hover:ring-4 hover:ring-green"
            on:click={playPreviousSong} 
            title="Previous" 
            disabled={$currentSongIndex === null || $currentSongIndex === 0}>
            <img src="/previous.png" alt="Previous" class="h-4 w-4" />
        </button>

        <button 
            class="p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0
            bg-green hover:bg-light-green hover:ring-4 hover:ring-green"
            on:click={togglePauseContinue} 
            title={$isPaused ? 'Play' : 'Pause'} 
            disabled={audio == null && $playlistSongs.length <= 0}>
            <img src={$isPaused ? '/play.png' : '/pause.png'} alt={$isPaused ? 'Pause' : 'Play'} class="h-4 w-4" />
        </button>

        <button 
            class="p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0
            bg-green hover:bg-light-green hover:ring-4 hover:ring-green"
            on:click={playNextSong} 
            title="Next" 
            disabled={$currentSongIndex === null || $currentSongIndex >= $playlistSongs.length - 1}>
            <img src="/next.png" alt="Next" class="h-4 w-4" />
        </button>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between w-full px-4">
        <span class="text-sm text-light-gray sm:mr-auto">
            {$currentSongName || "No song playing"}
        </span>

        <div class="flex sm:flex-row md:w-1/2 items-center">
            <span class="text-sm text-light-gray pr-1">
                {formatTime($currentTime)}
            </span>

            <div class="flex-grow w-full">
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={$duration > 0 ? ($currentTime / $duration) * 100 : 0}
                    on:input={(e) => seekSong(e.target.value)}
                    class="w-full h-2 bg-light-gray rounded-lg appearance-none cursor-pointer transition-all duration-200">
            </div>

            <span class="text-sm text-light-gray pl-1">
                {formatTime($duration)}
            </span>
        </div>

        <div class="hidden sm:flex sm:flex-row items-center sm:ml-auto">
            <span class="text-sm text-light-gray">
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
                    class="w-full h-2 bg-light-gray rounded-lg appearance-none cursor-pointer transition-all duration-200">
            </div>
        </div>
    </div> 
</div>

<style>
/* Button transitions and focus effects */
button {
    transition: background-color 0.2s, transform 0.2s;
}
button:active {
    transform: scale(0.95);
}

/* Custom range slider thumb styles */
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #22c55e;
    border-radius: 50%;
    cursor: pointer;
}
input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #22c55e;
    border-radius: 50%;
    cursor: pointer;
}
input[type="range"]::-ms-thumb {
    width: 16px;
    height: 16px;
    background: #22c55e;
    border-radius: 50%;
    cursor: pointer;
}

/* Disabled state styles */
button:disabled {
    background-color: #6b7280; /* Gray color */
    color: #d1d5db; /* Light gray text */
}
</style>

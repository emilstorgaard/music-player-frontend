<script lang="ts">
    import { currentSong, currentSongIndex, isShuffleEnabled, isPaused, currentTime, duration, volume } from '$lib/stores/songStore';
    import { toggleShuffle, togglePauseContinue, playPreviousSong, playNextSong, formatTime, seekSong, adjustVolume } from '$lib/utils/audioPlayer';
    import { selectedPlaylistSongsStore, selectedPlaylistStore } from '$lib/stores/playlistStore';
    import { API_BASE_URL } from '$lib/utils/config';
</script>

<div class="text-white flex flex-col w-full">
    <div class="flex justify-center items-center space-x-4">
        <button 
            class="p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0
            bg-green hover:bg-light-green hover:ring-4 hover:ring-green
            {$isShuffleEnabled ? 'ring-4 ring-light-gray' : ''}"
            on:click={toggleShuffle} 
            title="Shuffle"
            disabled={$selectedPlaylistSongsStore.length <= 0}>
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
            disabled={!$selectedPlaylistStore && !$currentSong}>
            <img src={$isPaused ? '/play.png' : '/pause.png'} alt={$isPaused ? 'Pause' : 'Play'} class="h-4 w-4" />
        </button>

        <button 
            class="p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0
            bg-green hover:bg-light-green hover:ring-4 hover:ring-green"
            on:click={playNextSong} 
            title="Next" 
            disabled={$currentSongIndex === null || $currentSongIndex >= $selectedPlaylistSongsStore.length - 1}>
            <img src="/next.png" alt="Next" class="h-4 w-4" />
        </button>
    </div>

    <div class="flex flex-col sm:flex-row items-center w-full px-4 gap-3 mt-4 sm:mt-0">

        <div class="flex items-center sm:w-1/3">
            {#if $currentSong?.id}
                <img 
                    src={`${API_BASE_URL}/Songs/cover/${$currentSong?.coverImagePath}`} 
                    alt={`${$currentSong?.title} - ${$currentSong?.artist}`} 
                    class="w-12 h-12 rounded-md object-cover mr-3"
                />
                <span class="text-sm text-light-gray truncate">{$currentSong?.title} - {$currentSong?.artist}</span>
            {:else}
                <span class="text-sm h-12 text-light-gray">No song playing</span>
            {/if}
        </div>

        <div class="flex items-center w-full sm:w-1/3">
            <span class="text-xs text-light-gray pr-2">{formatTime($currentTime)}</span>
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={$duration > 0 ? ($currentTime / $duration) * 100 : 0}
                on:input={(e) => seekSong(e.target.value)}
                class="w-full h-1.5 bg-light-gray rounded-lg appearance-none cursor-pointer transition-all duration-200">
            <span class="text-xs text-light-gray pl-2">{formatTime($duration)}</span>
        </div>

        <div class="hidden sm:flex items-center sm:w-1/3 sm:justify-end">
            <span class="text-xs text-light-gray">Volume {($volume * 100).toFixed(0)}%</span>
            <input 
                id="volume" 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={$volume}
                on:input={(e) => adjustVolume(parseFloat(e.target.value))}
                class="w-24 h-1.5 ml-2 bg-light-gray rounded-lg appearance-none cursor-pointer transition-all duration-200">
        </div>
    </div> 
</div>

<style>
	button {
		transition: background-color 0.2s, transform 0.2s;
	}

	button:active {
		transform: scale(0.95);
	}

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

	button:disabled {
		background-color: #6b7280;
		color: #d1d5db;
	}
</style>

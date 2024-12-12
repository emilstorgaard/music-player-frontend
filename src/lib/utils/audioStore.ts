import { writable, get } from 'svelte/store';
import type { Song } from './types';

// State stores
export const playlistSongs = writable<Song[]>([]);
export const currentSongIndex = writable<number | null>(null);
export const volume = writable<number>(1.0);
export const isPaused = writable<boolean>(false);
export const currentTime = writable<number>(0);
export const duration = writable<number>(0);
export const currentSongName = writable<string | null>(null);

export const shuffledOrder = writable<number[]>([]);
export const isShuffleEnabled = writable<boolean>(false);

// Internal variables
export let audio: HTMLAudioElement | null = null;

export const getPlaylistSongs = () => {
    console.log("hej", get(playlistSongs))
    return get(playlistSongs)
}

// Functions
export const playSong = async (song: Song) => {
    if (audio) {
        audio.pause();
    }

    try {
        const url = `https://music.emilstorgaard.dk/api/Songs/${song.id}/stream`;
        audio = new Audio(url);
        audio.volume = get(volume);

        audio.onloadedmetadata = () => {
            duration.set(audio?.duration || 0);
        };

        audio.ontimeupdate = () => {
            if (audio) {
                currentTime.set(audio.currentTime);
            }
        };

        audio.onended = playNextSong;
        await audio.play();
        isPaused.set(false);
        currentSongName.set(`${song.title} - ${song.artist}`);
    } catch (error) {
        console.error('Error fetching song:', error);
    }
};

export const stopSong = () => {
    // if (audio) {
    //     audio.pause();
    //     audio.currentTime = 0;
    // }

    if (audio) {
        audio.pause(); // Stop the current audio playback
        audio.src = ""; // Clear the audio source
        audio.load(); // Ensure the audio element is completely reset
        audio = null; // Remove the reference to the audio element
    }
    currentSongIndex.set(null);
    isPaused.set(false);
    currentTime.set(0);
    duration.set(0);
    currentSongName.set(null);
};

export const playNextSong = () => {
    currentSongIndex.update((currentIndex) => {
        const shuffleEnabled = get(isShuffleEnabled);
        const songs = get(playlistSongs);
        const order = get(shuffledOrder);

        if (currentIndex === null) return null;

        if (shuffleEnabled) {
            const currentShuffleIndex = order.indexOf(currentIndex);
            if (currentShuffleIndex < order.length - 1) {
                const nextIndex = order[currentShuffleIndex + 1];
                playSong(songs[nextIndex]);
                return nextIndex;
            }
        } else if (currentIndex < songs.length - 1) {
            playSong(songs[currentIndex + 1]);
            return currentIndex + 1;
        }

        stopSong();
        return null;
    });
};

export const playPreviousSong = () => {
    currentSongIndex.update((currentIndex) => {
        const shuffleEnabled = get(isShuffleEnabled);
        const songs = get(playlistSongs);
        const order = get(shuffledOrder);

        if (currentIndex === null) return null;

        if (shuffleEnabled) {
            const currentShuffleIndex = order.indexOf(currentIndex);
            if (currentShuffleIndex > 0) {
                const prevIndex = order[currentShuffleIndex - 1];
                playSong(songs[prevIndex]);
                return prevIndex;
            }
        } else if (currentIndex > 0) {
            playSong(songs[currentIndex - 1]);
            return currentIndex - 1;
        }

        return currentIndex;
    });
};

export const toggleShuffle = () => {
    isShuffleEnabled.update((enabled) => {
        // if (!enabled) {
        //     shuffleSongs();
        // }
        return !enabled;
    });
};

// export const playAllSongs = async () => {
//     if (get(playlistSongs).length > 0) {
//         currentSongIndex.set(0);
//         await playSong(get(playlistSongs)[0]);
//     }
// };

export const playAllSongs = async () => {
    const songs = get(playlistSongs);
    const shuffleEnabled = get(isShuffleEnabled);

    if (songs.length > 0) {
        if (shuffleEnabled) {
            console.log("shuffle is enabled")
            shuffleSongs(); // Generate a shuffled order
            const order = get(shuffledOrder);
            currentSongIndex.set(order[0]); // Start with the first song in the shuffled order
            await playSong(songs[order[0]]);
        } else {
            currentSongIndex.set(0); // Start with the first song in the playlist
            await playSong(songs[0]);
        }
    }
};

// export const togglePauseContinue = () => {
//     if (audio) {
//         if (!audio.paused) {
//             audio.pause();
//             isPaused.set(true);
//         } else {
//             audio.play();
//             isPaused.set(false);
//         }
//     } else {
//         playAllSongs();
//     }
// };

export const togglePauseContinue = () => {
    const songs = get(playlistSongs);

    if (audio) {
        console.log(audio)
        if (!audio.paused) {
            audio.pause();
            isPaused.set(true);
        } else {
            audio.play();
            isPaused.set(false);
        }
    } else if (songs.length > 0) {
        playAllSongs(); // Play the first song, considering shuffle mode
    }
};



export const shuffleArray = (array: Song[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// export const shuffleSongs = () => {
//     stopSong();
//     playlistSongs.update((s) => shuffleArray([...s]));
//     currentSongIndex.set(0);
//     if (get(playlistSongs).length > 0) {
//         playSong(get(playlistSongs)[0]);
//     }
// };

export const shuffleSongs = () => {
    const songs = get(playlistSongs);
    const order = songs.map((_, index) => index);

    // Shuffle the order
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }

    console.log(order)
    shuffledOrder.set(order);
};

export const adjustVolume = (value: number) => {
    volume.set(value);
    if (audio) {
        audio.volume = value;
    }
};

export const seekSong = (percentage: number) => {
    if (audio) {
        const newTime = (percentage / 100) * get(duration);
        audio.currentTime = newTime;
    }
};

export const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
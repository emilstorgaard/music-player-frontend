import { writable, get } from 'svelte/store';
import type { Song } from './types';

// State stores
export const playlistSongs = writable<Song[]>([]);
export const currentSongIndex = writable<number | null>(null);
export const volume = writable<number>(1.0);
export const isPaused = writable<boolean>(true);
export const currentTime = writable<number>(0);
export const duration = writable<number>(0);
export const currentSongName = writable<string | null>(null);
export const currentSongId = writable<number | null>(null);

export const shuffledOrder = writable<number[]>([]);
export const isShuffleEnabled = writable<boolean>(false);

export let audio: HTMLAudioElement | null = null;

export const getPlaylistSongs = () => {
    return get(playlistSongs)
}

export const playSong = async (song: Song) => {
    if (audio) {
        if (!get(isPaused)) {
            isPaused.set(true);
            audio.pause();
        }
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
        isPaused.set(false);
        await audio.play();
        currentSongName.set(`${song.title} - ${song.artist}`);
        currentSongId.set(song.id);
    } catch (error) {
        console.error('Error fetching song:', error);
    }
};

export const pauseContinue = () => {
    if (audio) {
        if (get(isPaused)) {
            isPaused.set(false);
            audio.play();
        } else {
            isPaused.set(true);
            audio.pause();
        }
    }
}

export const stopSong = () => {
    if (audio) {
        isPaused.set(true);
        audio.pause();
        audio.src = "";
        audio.load();
        audio = null;
    }
    currentSongIndex.set(null);
    currentTime.set(0);
    duration.set(0);
    currentSongName.set(null);
    currentSongId.set(null);
};

export const playAllSongs = async () => {
    const songs = get(playlistSongs);
    const shuffleEnabled = get(isShuffleEnabled);

    if (songs.length > 0) {
        if (shuffleEnabled) {
            shuffleSongs();
            const order = get(shuffledOrder);
            currentSongIndex.set(order[0]);
            await playSong(songs[order[0]]);
        } else {
            currentSongIndex.set(0);
            await playSong(songs[0]);
        }
    }
};

export const shuffleSongs = () => {
    const songs = get(playlistSongs);
    const order = songs.map((_, index) => index);

    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }

    shuffledOrder.set(order);
};

export const toggleShuffle = () => {
    isShuffleEnabled.update((enabled) => {
        return !enabled;
    });

    if (get(isShuffleEnabled)) playAllSongs();
};

export const togglePauseContinue = async () => {
    const songs = get(playlistSongs);

    if (audio) {
        pauseContinue();
    } else if (songs.length > 0) {
        playAllSongs();
    }
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
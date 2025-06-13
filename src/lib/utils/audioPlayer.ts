import { get } from 'svelte/store';
import type { Song } from './types';
import { API_BASE_URL } from './config';
import { currentSong, currentSongIndex, volume, isPaused, currentTime, duration, shuffledOrder, isShuffleEnabled } from '$lib/stores/songStore';
import { selectedPlaylistSongsStore } from '$lib/stores/playlistStore';

export let audio: HTMLAudioElement | null = null;

export const playSong = async (song: Song) => {
    if (audio) {
        if (!get(isPaused)) {
            isPaused.set(true);
            audio.pause();
        }
    }

    try {
        const url = `${API_BASE_URL}/Songs/${song.id}/stream`;
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
        currentSong.set(song);

        setupMediaSession(song);
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
    currentSong.set(null);
};

export const playAllSongs = async () => {
    const songs = get(selectedPlaylistSongsStore);
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
    const songs = get(selectedPlaylistSongsStore);
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
    const songs = get(selectedPlaylistSongsStore);

    if (audio) {
        pauseContinue();
    } else if (songs.length > 0) {
        playAllSongs();
    }
};

export const playNextSong = () => {
    currentSongIndex.update((currentIndex) => {
        const shuffleEnabled = get(isShuffleEnabled);
        const songs = get(selectedPlaylistSongsStore);
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
        const songs = get(selectedPlaylistSongsStore);
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

const setupMediaSession = (song: Song) => {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: '', // Optional
            artwork: [
                {
                    src: `${API_BASE_URL}/Songs/cover/${song.coverImagePath}`,
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => {
            pauseContinue(); // resumes playback
        });

        navigator.mediaSession.setActionHandler('pause', () => {
            pauseContinue(); // pauses playback
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => {
            playPreviousSong();
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
            playNextSong();
        });
    }
};
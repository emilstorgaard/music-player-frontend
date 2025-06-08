export interface Playlist {
    id: number;
    name: string;
    coverImagePath: string;
    createdAtUtc: string;
    isLiked: boolean;
}

export interface Song {
    id: number;
    title: string;
    artist: string;
    duration: string;
    filePath: string;
    coverImagePath: string;
    isLiked: boolean;
}

export interface Search {
    playlists: Playlist[];
    songs: Song[];
}
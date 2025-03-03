export interface Playlist {
    id: number;
    name: string;
    createdAtUtc: string;
    isLiked: boolean;
}

export interface Song {
    id: number;
    title: string;
    artist: string;
    filePath: string;
    isLiked: boolean;
}

export interface Search {
    playlists: Playlist[];
    songs: Song[];
}
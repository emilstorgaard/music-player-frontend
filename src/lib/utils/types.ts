export interface Playlist {
    id: number;
    name: string;
    createdAtUtc: string;
}

export interface Song {
    id: number;
    title: string;
    artist: string;
    filePath: string;
}

export interface Search {
    playlists: Playlist[];
    songs: Song[];
}
import { getPlaylist, getSongs } from "$lib/utils/utils";

export const load = async ({ params }: { params: { id: string } }) => {
    const playlist = await getPlaylist(params.id);
    const songs = await getSongs(params.id)

    return {
      playlist,
      songs
    }
};
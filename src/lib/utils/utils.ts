export const getPlaylist = async (id: string) => {
    const res = await fetch(`https://music.emilstorgaard.dk/api/Playlists/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    return await res.json();
};

export const getSongs = async (id: string) => {
    const res = await fetch(`https://music.emilstorgaard.dk/api/Playlists/${id}/songs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }
  
    return await res.json()
  };
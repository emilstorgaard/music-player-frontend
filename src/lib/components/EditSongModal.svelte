<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Song } from '$lib/utils/types';

    export let song: Song;

    const dispatch = createEventDispatcher();

    let updatedTitle = song.title;
    let updatedArtist = song.artist;

    async function updateSong() {
        if (!updatedTitle.trim() && !updatedArtist.trim()) {
            alert('Playlist name cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`https://music.emilstorgaard.dk/api/Songs/${song.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: updatedTitle, artist: updatedArtist }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update song: ${response.statusText}`);
            }

            alert('Song updated successfully!');
            dispatch('update');
            dispatch('close');
        } catch (error) {
            console.error('Error updating song:', error);
            alert('An error occurred while updating the song.');
        }
    }

    function closeModal() {
        dispatch('close');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-900 text-white rounded-lg p-6 shadow-xl w-full max-w-lg">

        <form on:submit|preventDefault={updateSong}>
            <div class="mb-4">
                                    <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Update Song</h2>
            <button
                on:click={closeModal}
                class="text-2xl text-gray-400 hover:text-white transition duration-200 focus:outline-none"
                aria-label="Close Modal"
            >
                x
            </button>
        </div>

                <input
                    id="title"
                    type="text"
                    bind:value={updatedTitle}
                    placeholder="Enter song title"
                    class="w-full bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                />
                
                <input
                    id="artist"
                    type="text"
                    bind:value={updatedArtist}
                    placeholder="Enter song artist"
                    class="w-full bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            <div class="flex justify-end space-x-4">
                <button
                    type="submit"
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
                >
                    Save Changes
                </button>
            </div>
        </form>

    </div>
</div>

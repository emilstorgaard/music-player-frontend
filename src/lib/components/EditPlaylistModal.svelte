<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let playlist: Playlist;

    const dispatch = createEventDispatcher();

    interface Playlist {
        id: number;
        name: string;
        createdAtUtc: string;
    }

    let updatedName = playlist.name;

    async function updatePlaylist() {
        if (!updatedName.trim()) {
            alert('Playlist name cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`https://music.emilstorgaard.dk/api/Playlists/${playlist.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: updatedName }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update playlist: ${response.statusText}`);
            }

            alert('Playlist updated successfully!');
            dispatch('update');
            dispatch('close');
        } catch (error) {
            console.error('Error updating playlist:', error);
            alert('An error occurred while updating the playlist.');
        }
    }

    function closeModal() {
        dispatch('close');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-900 text-white rounded-lg p-6 shadow-xl w-full max-w-lg">

        <form on:submit|preventDefault={updatePlaylist}>
            <div class="mb-4">
                                    <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Update Playlist</h2>
            <button
                on:click={closeModal}
                class="text-2xl text-gray-400 hover:text-white transition duration-200 focus:outline-none"
                aria-label="Close Modal"
            >
                x
            </button>
        </div>

                <input
                    id="name"
                    type="text"
                    bind:value={updatedName}
                    placeholder="Enter playlist name"
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

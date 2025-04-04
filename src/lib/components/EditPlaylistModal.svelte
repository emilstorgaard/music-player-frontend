<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Playlist } from '$lib/utils/types';
    import { userStore } from '$lib/stores/auth';
	import { updatePlaylist } from '$lib/utils/playlists';
	import { selectedPlaylistStore } from '$lib/stores/playlistStore2';

    const dispatch = createEventDispatcher();

    let updatedName = $selectedPlaylistStore?.name;
    let image: File | null = null;
    let errorMessage: "";

    function handleImageChange(event: Event) {
        const target = event.target as HTMLInputElement;
        image = target.files?.[0] || null;
    }

    async function handleUpdatePlaylist(event: SubmitEvent) {
        event.preventDefault();

        try {
			const jwt = $userStore?.jwt

			if (!jwt) throw new Error("Authentication token (JWT) is required.");

            if (!updatedName) {
                throw new Error("Name is required.");
            }

            const playlistId = $selectedPlaylistStore?.id

            if (!playlistId) throw new Error("No playlist selected.");

            await updatePlaylist(playlistId, updatedName, image, jwt);
            dispatch('update');
            dispatch('close');
        } catch (error: any) {
            errorMessage = error.message;
            console.error('Error updating playlist:', error);
        }
    }

    function closeModal() {
        dispatch('close');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-dark-gray text-white rounded-lg p-6 shadow-xl w-full max-w-lg">

        <form on:submit|preventDefault={handleUpdatePlaylist}>
            <div class="mb-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Update Playlist</h2>
                    <button
                        on:click={closeModal}
                        class="text-2xl text-light-gray hover:text-white transition duration-200 focus:outline-none"
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
                    class="w-full bg-dark-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green"
                />

                <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg block w-full p-2.5"
                    on:change={handleImageChange}
                />

            </div>

            <div class="flex justify-end space-x-4">
                <button
                    type="submit"
                    class="bg-green text-white px-4 py-2 rounded hover:bg-light-green"
                >
                    Save Changes
                </button>
            </div>
        </form>

    </div>
</div>

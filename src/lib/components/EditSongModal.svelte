<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { userStore } from '$lib/stores/auth';
    import { updateSong } from '$lib/utils/songs';
	import { selectedPlaylistSongStore } from '$lib/stores/playlistStore2';

    const dispatch = createEventDispatcher();

    let updatedTitle = $selectedPlaylistSongStore?.title;
    let updatedArtist = $selectedPlaylistSongStore?.artist;
    let image: File | null = null;
	let audio: File | null = null;
    let errorMessage: "";

    function handleImageChange(event: Event) {
        const target = event.target as HTMLInputElement;
        image = target.files?.[0] || null;
    }

    function handleAudioChange(event: Event) {
        const target = event.target as HTMLInputElement;
        audio = target.files?.[0] || null;
    }

    async function handleUpdateSong(event: SubmitEvent) {
        event.preventDefault();

        try {
			const jwt = $userStore?.jwt

			if (!jwt) throw new Error("Authentication token (JWT) is required.");

            if (!updatedTitle || !updatedArtist) {
                alert('Title and artist are required.');
                return;
            }

            const songId = $selectedPlaylistSongStore?.id;

            if (!songId) throw new Error("No song selected.");

            await updateSong(songId, updatedTitle, updatedArtist, image, audio, jwt);
            dispatch('update');
            dispatch('close');
        } catch (error: any) {
            errorMessage = error.message;
            console.error('Error updating song:', error);
        }
    }

    function closeModal() {
        dispatch('close');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-dark-gray text-white rounded-lg p-6 shadow-xl w-full max-w-lg">

        <form on:submit={handleUpdateSong}>
            <div class="mb-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Update Song</h2>
                    <button
                        on:click={closeModal}
                        class="text-2xl text-light-gray hover:text-white transition duration-200 focus:outline-none"
                        aria-label="Close Modal"
                    >
                        x
                    </button>
                </div>

                {#if errorMessage}
                    <p class="text-red-500">{errorMessage}</p>
                {/if}

                <input
                    id="title"
                    type="text"
                    bind:value={updatedTitle}
                    placeholder={updatedTitle}
                    class="w-full bg-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green mb-2"
                />
                
                <input
                    id="artist"
                    type="text"
                    bind:value={updatedArtist}
                    placeholder={updatedTitle}
                    class="w-full bg-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green mb-2"
                />

                 <!-- Image Upload -->
                <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg block w-full p-2.5"
                    on:change={handleImageChange}
                />

                <!-- Audio Upload -->
                <input
                    type="file"
                    name="audio"
                    bind:value={audio}
                    id="audio"
                    accept="audio/*"
                    class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg block w-full p-2.5"
                    on:change={handleAudioChange}
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

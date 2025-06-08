<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { userStore } from '$lib/stores/auth';
    import { updateSong } from '$lib/utils/songs';
	import { selectedPlaylistSongStore } from '$lib/stores/playlistStore';
	import { triggerToast } from '$lib/stores/toastStore';
	import Modal from './Modal.svelte';

    const dispatch = createEventDispatcher();

    let updatedTitle = $selectedPlaylistSongStore?.title;
    let updatedArtist = $selectedPlaylistSongStore?.artist;
    let image: File | null = null;
	let audio: File | null = null;

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
            triggerToast(error.message, 'error');
        }
    }

    function closeModal() {
        dispatch('close');
    }
</script>

<Modal title="Edit Song" on:close={closeModal}>
    <form on:submit={handleUpdateSong}>
        <div class="space-y-4 md:space-y-6" >
            <div>
                <label for="Title" class="block mb-2 text-sm font-medium">Title</label>
                <input
                    id="title"
                    type="text"
                    bind:value={updatedTitle}
                    placeholder={updatedTitle}
                    class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
                />
            </div>
            
            <div>
                <label for="artist" class="block mb-2 text-sm font-medium">Artist</label>
                <input
                    id="artist"
                    type="text"
                    bind:value={updatedArtist}
                    placeholder={updatedTitle}
                    class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
                />
            </div>

            <!-- Image Upload -->
            <div>
                <label for="image" class="block mb-2 text-sm font-medium">Cover Image</label>
                <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
                    on:change={handleImageChange}
                />
            </div>

            <!-- Audio Upload -->
            <div>
                <label for="audio" class="block mb-2 text-sm font-medium">Audio File</label>
                <input
                    type="file"
                    name="audio"
                    id="audio"
                    accept="audio/*"
                    class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
                    on:change={handleAudioChange}
                />
            </div>

            <button type="submit" title="Edit Song" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Save Changes</button>
        </div>
    </form>
</Modal>
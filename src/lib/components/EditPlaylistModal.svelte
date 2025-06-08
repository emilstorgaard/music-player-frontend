<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { userStore } from '$lib/stores/auth';
	import { updatePlaylist } from '$lib/utils/playlists';
	import { selectedPlaylistStore } from '$lib/stores/playlistStore';
	import { triggerToast } from '$lib/stores/toastStore';
    import Modal from './Modal.svelte';

    const dispatch = createEventDispatcher();

    let updatedName = $selectedPlaylistStore?.name;
    let image: File | null = null;

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
            triggerToast(error.message, 'error');
        }
    }

    function closeModal() {
        dispatch('close');
    }
</script>

<Modal title="Edit Playlist" on:close={closeModal}>
    <form on:submit|preventDefault={handleUpdatePlaylist}>
        <div class="space-y-4 md:space-y-6" >
            <div>
                <label for="Title" class="block mb-2 text-sm font-medium">Title</label>
                <input
                    id="name"
                    type="text"
                    bind:value={updatedName}
                    placeholder="Enter playlist name"
                    class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
                />
            </div>

            <div>
                <label for="image" class="block mb-2 text-sm font-medium">Playlist Image</label>
                <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
                    on:change={handleImageChange}
                />
            </div>

            <button type="submit" title="Edit Playlist" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Save Changes</button>
        </div>
    </form>
</Modal>
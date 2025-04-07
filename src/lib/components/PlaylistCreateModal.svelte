<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Modal from './Modal.svelte';
	import { createPlaylist } from '$lib/utils/playlists';
	import { userStore } from '$lib/stores/auth';

    const dispatch = createEventDispatcher();

    let playlistName: string = '';
    let imageFile: File | null = null;
    let errorMessage: string | null = null;

    function handleImageChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            imageFile = target.files[0];
        }
    }

    async function handleSignup() {
        try {
			const jwt = $userStore?.jwt

            if (!jwt) throw new Error("Authentication token (JWT) is required.");

            await createPlaylist(playlistName, imageFile, jwt);
            dispatch('create');
            close();
        } catch (error: any) {
            errorMessage = error.message;
        }
    }

    function close() {
        dispatch('close');
    }
</script>

<Modal title="Create Playlist" on:close={close}>
    <form on:submit={handleSignup}>
		<div class="space-y-4 md:space-y-6" >
			<div>
				<label for="name" class="block mb-2 text-sm font-medium">Playlist Name</label>
				<input
					type="text"
					name="name"
					bind:value={playlistName}
					id="name"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					placeholder="Playlist Namee"
					required
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

			{#if errorMessage}
				<p style="color: red;">{errorMessage}</p>
			{/if}

			<button type="submit" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Create</button>
		</div>
	</form>
</Modal>
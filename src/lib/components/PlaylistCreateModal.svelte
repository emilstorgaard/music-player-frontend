<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';
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

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-dark-gray text-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Create Playlist</h2>
        {#if errorMessage}
            <p class="text-red-500 mb-4">{errorMessage}</p>
        {/if}

        <input 
            type="text" 
            placeholder="Playlist Name" 
            bind:value={playlistName} 
            class="mb-4 bg-gray text-white p-2 rounded focus:outline-none focus:ring focus:ring-green w-full"
        />

        <input 
            type="file" 
            accept="image/*"
            on:change={handleImageChange}
            class="mb-4 bg-gray text-white p-2 rounded w-full"
        />

        <div class="flex justify-end">
            <button 
                on:click={close} 
                class="bg-gray hover:bg-light-gray text-white font-semibold py-2 px-4 rounded mr-2"
            >
                Cancel
            </button>
            <button 
                on:click={handleSignup} 
                class="bg-green hover:bg-light-green text-white font-semibold py-2 px-4 rounded"
            >
                Create
            </button>
        </div>
    </div>
</div>

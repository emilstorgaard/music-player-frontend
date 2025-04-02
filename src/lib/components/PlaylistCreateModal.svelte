<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';

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

    async function submit() {
        if (playlistName.trim()) {
            const formData = new FormData();
            formData.append('name', playlistName);
            if (imageFile) {
                formData.append('coverImageFile', imageFile);
            }

            try {
                const response = await fetch(`${$page.data.API_HOST}/Playlists`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${$page.data.loggedInUser?.jwt}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    dispatch('created');
                    close();
                } else {
                    errorMessage = 'Failed to create playlist. Please try again.';
                }
            } catch (err) {
                errorMessage = 'An unexpected error occurred.';
            }
        } else {
            errorMessage = 'Playlist name cannot be empty.';
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
                on:click={submit} 
                class="bg-green hover:bg-light-green text-white font-semibold py-2 px-4 rounded"
            >
                Create
            </button>
        </div>
    </div>
</div>

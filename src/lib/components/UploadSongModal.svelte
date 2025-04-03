<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }

	import { uploadSong } from "$lib/utils/songs"
	import { userStore } from '$lib/stores/auth';

	let title = "";
	let artist = "";
	let image: File | null = null;
	let audio: File | null = null;
	let errorMessage = "";

	function handleImageChange(event: Event) {
        const target = event.target as HTMLInputElement;
        image = target.files?.[0] || null;
    }

    function handleAudioChange(event: Event) {
        const target = event.target as HTMLInputElement;
        audio = target.files?.[0] || null;
    }

	async function handleUploadSong(event: SubmitEvent) {
        event.preventDefault();

		console.log(title, artist, image, audio)

        try {
			const jwt = $userStore?.jwt

			if (!jwt) throw new Error("Authentication token (JWT) is required.");

            await uploadSong(title, artist, image, audio, jwt);
			close()
        } catch (error: any) {
            errorMessage = error.message;
        }
    }

</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-dark-gray text-white rounded-lg p-6 shadow-lg w-full max-w-md">
		<div class="flex justify-between items-center px-6 sm:px-8">
			<h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl">
				Upload Song
			</h1>
			<button 
				on:click={close} 
				class="bg-gray hover:bg-light-gray text-white font-semibold py-2 px-4 rounded"
			>
				x
			</button>
		</div>
        <form on:submit={handleUploadSong} class="p-6 space-y-4 md:space-y-6 sm:p-8" enctype="multipart/form-data">


			<div class="space-y-4 md:space-y-6" >
				<div>
					<label for="title" class="block mb-2 text-sm font-medium">Title</label>
					<input
						type="text"
						name="title"
						bind:value={title}
						id="title"
						class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
						placeholder="Title"
						required
					/>
				</div>

				<div>
					<label for="artist" class="block mb-2 text-sm font-medium">Artist</label>
					<input
						type="text"
						name="artist"
						bind:value={artist}
						id="artist"
						class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
						placeholder="Artist"
						required
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
                        class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg block w-full p-2.5"
						on:change={handleImageChange}
					/>
                </div>

                <!-- Audio Upload -->
                <div>
                    <label for="audio" class="block mb-2 text-sm font-medium">Audio File</label>
                    <input
                        type="file"
                        name="audio"
						bind:value={audio}
                        id="audio"
                        accept="audio/*"
                        required
                        class="bg-gray-50 border border-gray-300 text-gray sm:text-sm rounded-lg block w-full p-2.5"
						on:change={handleAudioChange}
					/>
                </div>
				
				{#if errorMessage}
					<p style="color: red;">{errorMessage}</p>
				{/if}

				<button type="submit" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Upload</button>
			</div>
		</form>

    </div>
</div>
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import { uploadSong } from "$lib/utils/songs"
	import { userStore } from '$lib/stores/auth';
	import Modal from './Modal.svelte';
	import { triggerToast } from '$lib/stores/toastStore';

	let title = "";
	let artist = "";
	let image: File | null = null;
	let audio: File | null = null;

    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }

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
            triggerToast(error.message, 'error');
        }
    }
</script>

<Modal title="Upload Song" on:close={close}>
	<form on:submit={handleUploadSong} class="p-6 space-y-4 md:space-y-6 sm:p-8" enctype="multipart/form-data">

		<div class="space-y-4 md:space-y-6" >
			<div>
				<label for="title" class="block mb-2 text-sm font-medium">Title</label>
				<input
					type="text"
					name="title"
					bind:value={title}
					id="title"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
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
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
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
					bind:value={audio}
					id="audio"
					accept="audio/*"
					required
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					on:change={handleAudioChange}
				/>
			</div>
			
			<button type="submit" title="Upload" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Upload</button>
		</div>
	</form>
</Modal>
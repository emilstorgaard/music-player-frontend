<script lang="ts">
	import { playSong, pauseContinue } from '$lib/utils/audioPlayer';
	import { currentSongIndex, isPaused } from '$lib/stores/songStore';
	import { selectedPlaylistSongStore, selectedPlaylistSongsStore, selectedPlaylistStore } from '$lib/stores/playlistStore';
	import { deleteSong, dislikeSong, fetchSongs, likeSong, removeSongFromPlaylist } from '$lib/utils/songs';
	import { onMount } from 'svelte';
	import { API_BASE_URL } from '$lib/utils/config';
	import { userStore } from '$lib/stores/auth';
	import { triggerToast } from '$lib/stores/toastStore';
	import EditSongModal from './EditSongModal.svelte';
	import type { Song } from '$lib/utils/types';
	import { formatDuration } from '$lib/utils/format';

	let selectedSongId: number | null = null;

	let showEditSongModal = false;

	function openEditSongModal(song: Song) {
		selectedPlaylistSongStore.set(song);
		showEditSongModal = true;
	}

	function closeEditSongModal() {
		selectedSongId = null;
		showEditSongModal = false;
	}

	async function handleDeleteSong(songId: number) {
		try {
			const jwt = $userStore?.jwt;

			if (!jwt) throw new Error('Authentication token (JWT) is required.');

			await deleteSong(songId, jwt);

			const playlistId = $selectedPlaylistStore?.id;
			if (!playlistId) throw new Error('Not selected playlist.');

			await fetchSongs(playlistId, jwt);
		} catch (error: any) {
			triggerToast(error.message, 'error');
		}
	}

	async function handleUpdate() {
		try {
			closeEditSongModal();

			const jwt = $userStore?.jwt;

			if (!jwt) throw new Error('Authentication token (JWT) is required.');

			const playlistId = $selectedPlaylistStore?.id;
			if (!playlistId) throw new Error('Not selected playlist.');

			await fetchSongs(playlistId, jwt);
		} catch (error: any) {
			triggerToast(error.message, 'error');
		}
	}

	onMount(() => {
		const unsubscribe = selectedPlaylistStore.subscribe((selectedPlaylist) => {
			if (selectedPlaylist) {
				const jwt = $userStore?.jwt;

				fetchSongs(selectedPlaylist.id, jwt);
			}
		});

		return () => unsubscribe();
	});

	async function handleLikeSong(song: Song) {
		try {
			const jwt = $userStore?.jwt;
			if (!jwt) throw new Error('Authentication token (JWT) is required.');

			if (song.isLiked) {
				await dislikeSong(song.id, jwt);
			} else {
				await likeSong(song.id, jwt);
			}

			const playlistId = $selectedPlaylistStore?.id;
			if (!playlistId) throw new Error('Failed to update songs no playlist selected.');

			fetchSongs(playlistId, jwt);
		} catch (error: any) {
			triggerToast(error.message, 'error');
		}
	}

	async function handleRemoveSongFromPlaylist(songId: number) {
		try {
			const jwt = $userStore?.jwt;

			if (!jwt) throw new Error('Authentication token (JWT) is required.');

			const playlistId = $selectedPlaylistStore?.id;
			if (!playlistId) throw new Error('Not selected playlist.');

			await removeSongFromPlaylist(playlistId, songId, jwt);

			await fetchSongs(playlistId, jwt);
		} catch (error: any) {
			triggerToast(error.message, 'error');
		}
	}
</script>

<div class="flex-1 overflow-y-auto mt-2 space-y-2">
	{#each $selectedPlaylistSongsStore as song, index}
		<div
			class="p-2 rounded-md flex items-center gap-4 justify-between relative group hover:bg-gray hover:cursor-pointer transition border-b border-gray"
		>
			<div class="relative w-16 h-16 shrink-0">
				<img
					src={`${API_BASE_URL}/Songs/cover/${song.coverImagePath}`}
					alt={song.title}
					class="w-full h-full rounded-lg object-cover transition-opacity duration-300 group-hover:opacity-60"
				/>

				<button
					title={$currentSongIndex === index ? 'Pause' : 'Play'}
					class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
					on:click={() => {
						if ($currentSongIndex === index) {
							pauseContinue();
						} else {
							$currentSongIndex = index;
							playSong(song);
						}
					}}
				>
					{#if $currentSongIndex === index && !$isPaused}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-8 h-8 text-green-500"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M6 3h4v18H6zm8 0h4v18h-4z" />
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-8 h-8 text-green-500"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M5 3l14 9-14 9V3z" />
						</svg>
					{/if}
				</button>
			</div>

			<div class="text-left w-full">
				<p class="text-lg text-white font-medium line-clamp-1">
					{song.title} - {song.artist}
				</p>

				<div class="flex items-center gap-2 mt-1">
					<button title="Like" on:click={() => handleLikeSong(song)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill={song.isLiked ? 'red' : 'none'}
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6 text-red-500 hover:text-red-700 transition duration-150"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21.8 8.1c0-2.8-2.3-5.1-5.1-5.1-1.4 0-2.7.6-3.7 1.6-.9-1-2.3-1.6-3.7-1.6-2.8 0-5.1 2.3-5.1 5.1 0 3.7 3.4 6.6 8.1 11 4.7-4.4 8.1-7.3 8.1-11z"
							/>
						</svg>
					</button>
					<p class="text-sm text-light-gray">
						{formatDuration(song.duration)}
					</p>
				</div>
			</div>

			<div
				class="absolute right-2 top-1/4 opacity-0 group-hover:opacity-100 transition"
			>
				<button title="Settings"
					on:click={() => (selectedSongId = selectedSongId === song.id ? null : song.id)}
					class="p-2 rounded-full hover:bg-green transition"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<circle cx="12" cy="5" r="1" />
						<circle cx="12" cy="12" r="1" />
						<circle cx="12" cy="19" r="1" />
					</svg>
				</button>

				<div class="relative">
					{#if selectedSongId === song.id}
						<div
							class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray shadow-lg ring-1 ring-black/5 focus:outline-none"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="menu-button"
							tabindex="-1"
						>
							<div class="py-1">
								<button
									on:click={() => openEditSongModal(song)}
									class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-light-gray"
									title="Edit Song">Edit</button
								>
								<button
									on:click={() => handleRemoveSongFromPlaylist(song.id)}
									class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-red-600"
									title="Remove Song From Playlist">Remove</button
								>
								<button
									on:click={() => handleDeleteSong(song.id)}
									class="block w-full text-left px-4 rounded-md py-2 text-sm text-white hover:bg-red-600"
									title="Delete Song">Delete</button
								>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>

{#if showEditSongModal}
	<EditSongModal on:close={closeEditSongModal} on:update={handleUpdate} />
{/if}
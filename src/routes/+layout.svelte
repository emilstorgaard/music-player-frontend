<script>
	import '../styles/app.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { page } from '$app/stores';
	import { selectedPlaylistStore, selectedPlaylistSongsStore } from '$lib/stores/playlistStore';

	import { userStore } from '$lib/stores/auth';  // Importér din userStore

	// Whenever the page updates, check if the user is logged out
	$: if (!$page.data.loggedInUser) {
	    selectedPlaylistStore.set(null);
	    selectedPlaylistSongsStore.set([]);
		userStore.set(null); // Hvis ikke logget ind, sæt userStore til null
	}

	$: if ($page.data.loggedInUser) {
		userStore.set($page.data.loggedInUser); // Sætter brugerdata i store
    }
</script>

<svelte:head>
	<title>BeatStream</title>
</svelte:head>

<Header title="BeatStream" />

<main>
	<slot />
</main>

<Footer year="2024" domain="beatstream.emilstorgaard.dk" name="Emil Storgaard" />
<script>
	import '../styles/app.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SongPanel from '$lib/components/SongPanel.svelte';
</script>

<svelte:head>
	<title>MusicPlayer</title>
</svelte:head>

<Header title="Music Player" />

<main class="mb-64">
	<slot />
</main>

<SongPanel />
<Footer year="2024" domain="musicplayer.dk" name="Emil Storgaard" />
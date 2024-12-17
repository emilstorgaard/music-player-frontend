<script>
	import '../styles/app.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>BeatStream</title>
</svelte:head>

<Header title="BeatStream" />

<main class="mb-64">
	<slot />
</main>

<Footer year="2024" domain="beatstream.emilstorgaard.dk" name="Emil Storgaard" />
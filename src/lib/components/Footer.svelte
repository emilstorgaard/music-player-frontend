<script>
	import SongPanel from "./SongPanel.svelte";

	export let year = 'year';
	export let domain = 'domain';
	export let name = 'name';
</script>

<footer class="flex flex-col items-center text-white fixed bottom-0 w-full bg-black py-2">
	<SongPanel />
	<div class="w-full text-center">
		<span class="text-sm text-light-gray">© {year} -</span>
		<a class="text-green hover:underline" href="/">{domain}</a>
		<span class="text-sm text-light-gray">- {name}</span>
	</div>
</footer>
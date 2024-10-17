<script>
	export let year = 'year';
	export let domain = 'domain';
	export let name = 'name';
</script>

<footer class="flex flex-col items-center bg-gray-900 text-white fixed bottom-0 w-full">
	<div class="w-full p-4 text-center">
		<span class="text-sm text-gray-400">© {year} -</span>
		<a class="text-green-500 hover:underline" href="/">{domain}</a>
		<span class="text-sm text-gray-400">- {name}</span>
	</div>
</footer>
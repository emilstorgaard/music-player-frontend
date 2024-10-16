<script>
	export let year = 'year';
	export let domain = 'domain';
	export let name = 'name';
</script>

<footer class="flex flex-col items-center bg-neutral-200 text-white fixed bottom-0 w-full">
	<div class="w-full bg-gray-100 p-4 text-center text-neutral-700">
		© {year} -
		<a class="text-neutral-800 hover:underline" href="/">{domain}</a> -
		{name}
	</div>
</footer>
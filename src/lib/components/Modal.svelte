<script>
	import { createEventDispatcher } from 'svelte';

	export let title = 'Title';
	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
	<div class="bg-dark-gray text-white rounded-lg py-6 shadow-lg w-full max-w-md m-4">
		<div class="flex justify-between items-center px-6 sm:px-8">
			<h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl">
				{title}
			</h1>
			<button title="Close" on:click={close} class="bg-gray hover:bg-light-gray text-white font-semibold py-2 px-4 rounded">
				x
			</button>
		</div>

		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<slot></slot>
		</div>
	</div>
</div>
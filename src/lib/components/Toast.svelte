<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
</script>

{#if $toastStore.visible}
	<div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-auto max-w-xs">
		<div class={`toast p-4 rounded-lg shadow-lg text-white 
      		${$toastStore.type === 'error' ? 'bg-red-500' : $toastStore.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
		>
			<p class="font-semibold text-sm sm:text-base">{$toastStore.message}</p>
		</div>
	</div>
{/if}

<style>
	.toast {
		transition: opacity 0.3s ease-out;
	}
</style>
